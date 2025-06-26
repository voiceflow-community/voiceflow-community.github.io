const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const CONFIG = require('../../config.js')

const ORG_NAME = 'voiceflow-community'
const API_BASE = 'https://api.github.com'
const TOKEN = process.env.GH_PAT
const OUTPUT_PATH = path.join(__dirname, '../../assets/repos.json')
const README_DIR = path.join(__dirname, '../../assets/readmes')
const IGNORE_REPOS = CONFIG.IGNORE_REPOS || []

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          Authorization: `token ${TOKEN}`,
          ...options.headers,
        },
      })
      if (res.ok) return res
      if (res.status === 403) {
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
        continue
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)))
    }
  }
}

async function fetchAllRepos() {
  let allRepos = []
  let page = 1
  let hasMore = true
  while (hasMore) {
    const res = await fetchWithRetry(
      `${API_BASE}/orgs/${ORG_NAME}/repos?page=${page}&per_page=100&sort=updated`
    )
    const repos = await res.json()
    if (repos.length === 0) {
      hasMore = false
    } else {
      allRepos = allRepos.concat(repos)
      page++
    }
  }
  // Filter out ignored repos
  allRepos = allRepos.filter((repo) => !IGNORE_REPOS.includes(repo.name))
  // Fetch topics and README for each repo
  fs.mkdirSync(README_DIR, { recursive: true })
  for (const repo of allRepos) {
    try {
      const topicsRes = await fetchWithRetry(
        `${API_BASE}/repos/${repo.owner.login}/${repo.name}/topics`
      )
      const topicsData = await topicsRes.json()
      repo.topics = topicsData.names || []
    } catch (e) {
      repo.topics = []
    }
    // Fetch README
    try {
      const readmeRes = await fetchWithRetry(
        `${API_BASE}/repos/${repo.owner.login}/${repo.name}/readme`
      )
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json()
        const content = Buffer.from(readmeData.content, 'base64').toString(
          'utf-8'
        )
        const readmeFile = `${repo.name}.md`
        const readmePath = path.join(README_DIR, readmeFile)
        try {
          fs.writeFileSync(readmePath, content)
          console.log(`[INFO] README written for ${repo.name} at ${readmePath}`)
        } catch (writeErr) {
          console.error(
            `[ERROR] Failed to write README for ${repo.name}:`,
            writeErr
          )
        }
        repo.readmePath = `assets/readmes/${readmeFile}`
      } else {
        console.warn(
          `[WARN] README not found for ${repo.name} (status: ${readmeRes.status})`
        )
        repo.readmePath = null
      }
    } catch (e) {
      console.error(`[ERROR] Exception fetching README for ${repo.name}:`, e)
      repo.readmePath = null
    }
    // Fetch clone stats
    try {
      const clonesRes = await fetchWithRetry(
        `${API_BASE}/repos/${repo.owner.login}/${repo.name}/traffic/clones`
      )
      if (clonesRes.ok) {
        const clonesData = await clonesRes.json()
        repo.clones_count = clonesData.count || 0
      } else {
        repo.clones_count = null
      }
    } catch (e) {
      repo.clones_count = null
    }
  }
  return allRepos
}

;(async () => {
  try {
    const repos = await fetchAllRepos()
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(repos, null, 2))
    console.log(`Fetched and saved ${repos.length} repos to ${OUTPUT_PATH}`)
    console.log(`Fetched and saved READMEs to ${README_DIR}`)
  } catch (err) {
    console.error('Failed to fetch repos:', err)
    process.exit(1)
  }
})()
