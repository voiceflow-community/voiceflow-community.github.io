const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const ORG_NAME = 'voiceflow-community'
const API_BASE = 'https://api.github.com'
const TOKEN = process.env.GH_PAT
const OUTPUT_PATH = path.join(__dirname, '../../assets/repos.json')

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
  // Fetch topics for each repo
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
  }
  return allRepos
}

;(async () => {
  try {
    const repos = await fetchAllRepos()
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(repos, null, 2))
    console.log(`Fetched and saved ${repos.length} repos to ${OUTPUT_PATH}`)
  } catch (err) {
    console.error('Failed to fetch repos:', err)
    process.exit(1)
  }
})()
