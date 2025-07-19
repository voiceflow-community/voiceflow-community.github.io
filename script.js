// GitHub API Configuration
const REPOS_PER_PAGE =
  (window.SITE_CONFIG && window.SITE_CONFIG.display?.reposPerPage) || 8
const LATEST_REPOS_COUNT =
  (window.SITE_CONFIG && window.SITE_CONFIG.display?.latestReposCount) || 3
const IGNORE_REPOS =
  (window.SITE_CONFIG && window.SITE_CONFIG.IGNORE_REPOS) || []

// Global state
let allRepositories = []
let filteredRepositories = []
let currentPage = 1
let isLoading = false
let totalStats = {
  repos: 0,
  stars: 0,
  forks: 0,
  clones: 0,
}

// Loom Videos Section Logic
const LOOM_FOLDER_ID =
  window.SITE_CONFIG?.loom?.FOLDER_ID || 'd29d8d15706341329029ca19295adaa2'
const LOOM_VIDEOS_LIMIT = window.SITE_CONFIG?.loom?.VIDEOS_LIMIT || 12
const LOOM_VIDEOS_PER_PAGE = window.SITE_CONFIG?.loom?.VIDEOS_PER_PAGE || 2
let loomVideos = []
let loomCurrentPage = 1
let loomHasNextPage = false
let loomEndCursor = null

// Language colors mapping
const languageColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572a5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4f5d95',
  Ruby: '#701516',
  Go: '#00add8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Dockerfile: '#384d54',
}

// Utility functions
const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Fetch repositories from static JSON file
const fetchOrganizationRepos = async () => {
  try {
    showLoading(true)
    const response = await fetch('assets/repos.json')
    if (!response.ok) throw new Error('Failed to load repos.json')
    let repos = await response.json()
    // Filter out ignored repos (safety net)
    repos = repos.filter((repo) => !IGNORE_REPOS.includes(repo.name))
    // Filter out private repositories - only show public repos
    repos = repos.filter((repo) => !repo.private)
    allRepositories = repos
    filteredRepositories = [...allRepositories]
    calculateTotalStats()
    updateStatsDisplay()
    populateFilters()
    displayLatestRepos()
    displayAllRepos()
  } catch (error) {
    console.error('Error loading repos.json:', error)
    showError('Failed to load repositories. Please try again later.')
  } finally {
    showLoading(false)
  }
}

// Helper: Extract first non-empty line from README markdown
const extractFirstLineFromReadme = (markdown) => {
  if (!markdown) return ''
  const lines = markdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length > 0 ? lines[0] : ''
}

// Utility function to clean up README HTML (remove leading <hr>, <img>, or empty <p> tags)
function cleanReadmeHtml(html) {
  return html
    .replace(/^<hr[^>]*>/i, '')
    .replace(/^<img[^>]*>/i, '')
    .replace(/^<p>\s*<\/p>/i, '')
    .replace(/^\s+/, '')
}

// Fetch README markdown for a repo and render as HTML
const fetchReadmeContent = async (repo) => {
  if (!repo.readmePath) return 'No README available for this repository.'
  try {
    const response = await fetch(repo.readmePath)
    if (!response.ok) throw new Error('Failed to load README')
    const markdown = await response.text()
    return marked.parse(markdown)
  } catch (e) {
    return 'Failed to load README content.'
  }
}

// UI functions
const showLoading = (show) => {
  const loadingScreen = document.getElementById('loading-screen')
  if (show) {
    loadingScreen.classList.remove('hidden')
  } else {
    loadingScreen.classList.add('hidden')
  }
}

const showError = (message) => {
  // Create a simple error notification
  const errorDiv = document.createElement('div')
  errorDiv.className = 'error-notification'
  errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--error-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `
  errorDiv.textContent = message

  document.body.appendChild(errorDiv)

  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

const calculateTotalStats = () => {
  totalStats = allRepositories.reduce(
    (acc, repo) => ({
      repos: acc.repos + 1,
      stars: acc.stars + (repo.stargazers_count || 0),
      forks: acc.forks + (repo.forks_count || 0),
      clones: acc.clones + (repo.clones_count || 0),
    }),
    { repos: 0, stars: 0, forks: 0, clones: 0 }
  )
}

// Animate stats counters in hero section
function animateStatCounter(elementId, endValue, duration = 1000) {
  const el = document.getElementById(elementId)
  if (!el) return
  const startValue = 0
  const range = endValue - startValue
  const startTime = performance.now()
  function update(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const value = Math.floor(startValue + range * progress)
    el.textContent = formatNumber(value)
    if (progress < 1) {
      requestAnimationFrame(update)
    } else {
      el.textContent = formatNumber(endValue)
    }
  }
  requestAnimationFrame(update)
}

function animateAllHeroStats() {
  animateStatCounter('total-repos', totalStats.repos)
  animateStatCounter('total-stars', totalStats.stars)
  animateStatCounter('total-forks', totalStats.forks)
  animateStatCounter('total-clones', totalStats.clones)
}

const updateStatsDisplay = () => {
  animateAllHeroStats()
}

const createRepoCard = (repo, isLatest = false) => {
  const card = document.createElement('div')
  card.className = isLatest ? 'repo-card' : 'repo-item'
  card.dataset.repoName = repo.name

  const languageColor = languageColors[repo.language] || '#6b7280'
  const topicsHtml = repo.topics
    .slice(0, 3)
    .map((topic) => `<span class="topic-tag">${topic}</span>`)
    .join('')

  // Fallback: use first line of README if description is missing
  let description = repo.description || ''
  if (!description && repo.readmePath) {
    // Synchronously fetch the README first line (not ideal, but for card preview)
    // We'll use a placeholder and update asynchronously
    description = 'Loading description...'
    fetch(repo.readmePath)
      .then((res) => (res.ok ? res.text() : ''))
      .then((md) => {
        const firstLine = extractFirstLineFromReadme(md)
        if (firstLine) {
          card.querySelector(
            '.' + (isLatest ? 'repo-description' : 'repo-item-description')
          ).textContent = firstLine
        }
      })
  }

  card.innerHTML = `
        <div class="${isLatest ? 'repo-header' : 'repo-item-header'}">
            <div>
                <h3 class="${isLatest ? 'repo-name' : 'repo-item-name'}">${
    repo.name
  }</h3>
                <div class="${isLatest ? 'repo-stats' : 'repo-item-stats'}">
                    <span class="repo-stat">
                        <i class="fas fa-star"></i>
                        ${formatNumber(repo.stargazers_count || 0)}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-code-branch"></i>
                        ${formatNumber(repo.forks_count || 0)}
                    </span>
                    <span class="repo-stat">
                        <i class="fas fa-eye"></i>
                        ${formatNumber(repo.watchers_count || 0)}
                    </span>
                </div>
            </div>
        </div>
        <p class="${isLatest ? 'repo-description' : 'repo-item-description'}">
            ${truncateText(
              description || 'No description available',
              isLatest ? 120 : 150
            )}
        </p>
        <div class="${isLatest ? 'repo-topics' : 'repo-item-topics'}">
            ${topicsHtml}
        </div>
        <div class="${isLatest ? 'repo-footer' : 'repo-item-footer'}">
            <div class="${isLatest ? 'repo-language' : 'repo-item-meta'}">
                ${
                  repo.language
                    ? `
                    <span class="language-dot" style="background-color: ${languageColor}"></span>
                    <span>${repo.language}</span>
                `
                    : ''
                }
            </div>
            <span class="${isLatest ? 'repo-updated' : 'repo-updated'}">
                Updated ${formatDate(repo.updated_at)}
            </span>
        </div>
    `

  // Add click event to open modal
  card.addEventListener('click', () => openRepoModal(repo))

  return card
}

const displayLatestRepos = () => {
  const container = document.getElementById('latest-repos-grid')
  container.innerHTML = ''

  const latestRepos = allRepositories
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, LATEST_REPOS_COUNT)

  latestRepos.forEach((repo) => {
    const card = createRepoCard(repo, true)
    card.classList.add('fade-in')
    container.appendChild(card)
  })
}

const displayAllRepos = (page = 1) => {
  const container = document.getElementById('all-repos-list')

  if (page === 1) {
    container.innerHTML = ''
  }

  const startIndex = (page - 1) * REPOS_PER_PAGE
  const endIndex = startIndex + REPOS_PER_PAGE
  const reposToShow = filteredRepositories.slice(startIndex, endIndex)

  reposToShow.forEach((repo, index) => {
    const card = createRepoCard(repo, false)
    card.classList.add('fade-in')
    card.style.animationDelay = `${index * 0.1}s`
    container.appendChild(card)
  })

  // Update load more button
  const loadMoreBtn = document.getElementById('load-more-btn')
  if (endIndex < filteredRepositories.length) {
    loadMoreBtn.style.display = 'inline-flex'
  } else {
    loadMoreBtn.style.display = 'none'
  }
}

const populateFilters = () => {
  const topicFilter = document.getElementById('topic-filter')
  const languageFilter = document.getElementById('language-filter')

  // Get unique topics
  const allTopics = [
    ...new Set(allRepositories.flatMap((repo) => repo.topics)),
  ].sort()
  topicFilter.innerHTML = '<option value="">All Topics</option>'
  allTopics.forEach((topic) => {
    const option = document.createElement('option')
    option.value = topic
    option.textContent = topic
    topicFilter.appendChild(option)
  })

  // Get unique languages
  const allLanguages = [
    ...new Set(allRepositories.map((repo) => repo.language).filter(Boolean)),
  ].sort()
  languageFilter.innerHTML = '<option value="">All Languages</option>'
  allLanguages.forEach((language) => {
    const option = document.createElement('option')
    option.value = language
    option.textContent = language
    languageFilter.appendChild(option)
  })
}

const filterRepositories = () => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase()
  const selectedTopic = document.getElementById('topic-filter').value
  const selectedLanguage = document.getElementById('language-filter').value
  const sortBy = document.getElementById('sort-filter').value

  filteredRepositories = allRepositories.filter((repo) => {
    const matchesSearch =
      !searchTerm ||
      repo.name.toLowerCase().includes(searchTerm) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm))

    const matchesTopic = !selectedTopic || repo.topics.includes(selectedTopic)
    const matchesLanguage =
      !selectedLanguage || repo.language === selectedLanguage

    return matchesSearch && matchesTopic && matchesLanguage
  })

  // Sort repositories
  filteredRepositories.sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return (b.stargazers_count || 0) - (a.stargazers_count || 0)
      case 'forks':
        return (b.forks_count || 0) - (a.forks_count || 0)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'updated':
      default:
        return new Date(b.updated_at) - new Date(a.updated_at)
    }
  })

  currentPage = 1
  displayAllRepos(1)
}

const openRepoModal = async (repo) => {
  const modal = document.getElementById('repo-modal')

  // Populate modal with basic info
  document.getElementById('modal-repo-name').textContent = repo.name
  document.getElementById('modal-stars').textContent = formatNumber(
    repo.stargazers_count || 0
  )
  document.getElementById('modal-forks').textContent = formatNumber(
    repo.forks_count || 0
  )
  document.getElementById('modal-watchers').textContent = formatNumber(
    repo.watchers_count || 0
  )
  document.getElementById('modal-github-link').href = repo.html_url

  // Populate topics
  const topicsContainer = document.getElementById('modal-topics')
  topicsContainer.innerHTML = repo.topics
    .map((topic) => `<span class="topic-tag">${topic}</span>`)
    .join('')

  // Show modal
  modal.classList.add('active')
  document.body.style.overflow = 'hidden'

  // Load README content
  const readmeContainer = document.querySelector(
    '#modal-readme .readme-content'
  )
  readmeContainer.innerHTML =
    '<div class="loading-spinner" style="margin: 2rem auto;"></div>'
  try {
    const readmeHtml = await fetchReadmeContent(repo)
    readmeContainer.innerHTML = cleanReadmeHtml(readmeHtml)
  } catch (error) {
    readmeContainer.textContent = 'Failed to load README content.'
  }

  // Setup star button
  const starBtn = document.getElementById('modal-star-btn')
  starBtn.onclick = (e) => {
    e.stopPropagation()
    window.open(repo.html_url, '_blank')
  }
}

const closeRepoModal = () => {
  const modal = document.getElementById('repo-modal')
  modal.classList.remove('active')
  document.body.style.overflow = ''
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  fetchOrganizationRepos()

  // Search functionality
  const searchInput = document.getElementById('search-input')
  const debouncedFilter = debounce(filterRepositories, 300)
  searchInput.addEventListener('input', debouncedFilter)

  // Filter functionality
  document
    .getElementById('topic-filter')
    .addEventListener('change', filterRepositories)
  document
    .getElementById('language-filter')
    .addEventListener('change', filterRepositories)
  document
    .getElementById('sort-filter')
    .addEventListener('change', filterRepositories)

  // Load more functionality
  document.getElementById('load-more-btn').addEventListener('click', () => {
    if (!isLoading) {
      isLoading = true
      currentPage++
      displayAllRepos(currentPage)
      isLoading = false
    }
  })

  // Modal functionality
  document
    .getElementById('modal-close')
    .addEventListener('click', closeRepoModal)
  document.getElementById('repo-modal').addEventListener('click', (e) => {
    if (e.target.id === 'repo-modal') {
      closeRepoModal()
    }
  })

  // Prevent modal-actions clicks from bubbling to modal background
  const modalActions = document.querySelector('.modal-actions')
  if (modalActions) {
    modalActions.addEventListener('click', (e) => {
      e.stopPropagation()
    })
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeRepoModal()
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  })

  // Loom videos section
  initLoomVideosSection()
  setupLoomLoadMore()

  // Animated hero title cycling
  animateHeroTitle()
})

// Add some CSS animations via JavaScript
const addCustomStyles = () => {
  const style = document.createElement('style')
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .error-notification {
            animation: slideInRight 0.3s ease-out;
        }

        .repo-card:hover .topic-tag,
        .repo-item:hover .topic-tag {
            transform: scale(1.05);
            transition: transform 0.2s ease;
        }

        .floating-card:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: var(--shadow-xl);
        }
    `
  document.head.appendChild(style)
}

// Initialize custom styles
addCustomStyles()

// Performance optimization: Intersection Observer for lazy loading
const observeElements = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '50px',
    }
  )

  // Observe elements that should animate on scroll
  document.querySelectorAll('.repo-card, .repo-item').forEach((el) => {
    observer.observe(el)
  })
}

// Error handling for network issues
window.addEventListener('online', () => {
  if (allRepositories.length === 0) {
    fetchOrganizationRepos()
  }
})

window.addEventListener('offline', () => {
  showError('You are currently offline. Some features may not work properly.')
})

// Analytics and tracking (placeholder for future implementation)
const trackEvent = (eventName, properties = {}) => {
  // Placeholder for analytics tracking
  console.log('Event tracked:', eventName, properties)
}

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatNumber,
    formatDate,
    truncateText,
    fetchOrganizationRepos,
    filterRepositories,
  }
}

const fetchLoomVideos = async (limit = LOOM_VIDEOS_LIMIT, cursor = null) => {
  const body = {
    operationName: 'GetPublicFolderLooms',
    variables: {
      limit,
      cursor,
      folderId: LOOM_FOLDER_ID,
    },
    query:
      'query GetPublicFolderLooms($limit: Int!, $cursor: String, $folderId: String!) {\n  getPublicFolderLooms {\n    ... on GetPublicFolderLoomsPayload {\n      videos(first: $limit, after: $cursor, folderId: $folderId) {\n        edges {\n          cursor\n          node {\n            id\n            name\n            visibility\n            __typename\n          }\n          __typename\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    ... on Error {\n      message\n      __typename\n    }\n    __typename\n  }\n}',
  }
  const res = await fetch('https://loom-api.voiceflow.workers.dev', {
    method: 'POST',
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    console.error('Loom fetch failed:', res.status, res.statusText, text)
    throw new Error('Failed to fetch Loom videos')
  }
  const data = await res.json()
  const payload = data?.data?.getPublicFolderLooms
  if (!payload || !payload.videos) {
    console.error('Loom payload error:', data)
    throw new Error('No Loom videos found')
  }
  return payload.videos
}

const fetchLoomEmbed = async (videoId) => {
  const url = `https://www.loom.com/v1/oembed?url=https://www.loom.com/share/${videoId}`
  const res = await fetch(url, {
    headers: {
      accept: '*/*',
    },
  })
  if (!res.ok) throw new Error('Failed to fetch Loom embed')
  return res.json()
}

const renderHeroLoomVideo = async () => {
  const heroContainer = document.getElementById('hero-loom-video')
  const heroTitle = document.getElementById('hero-loom-title')
  const heroLabel = document.getElementById('hero-loom-label')
  heroContainer.innerHTML = ''
  heroTitle.textContent = ''
  heroLabel.textContent = 'Video of the week'
  if (!loomVideos.length) return
  const video = loomVideos[0]
  try {
    const embed = await fetchLoomEmbed(video.id)
    // Force iframe height to 260px
    let embedHtml = embed.html.replace(
      /<iframe ([^>]*?)height="[0-9]+"([^>]*)>/,
      '<iframe $1height="260" style="height:260px;"$2>'
    )
    heroContainer.innerHTML = embedHtml
    heroTitle.textContent = video.name || ''
  } catch (e) {
    heroContainer.innerHTML =
      '<div style="color: var(--error-color); padding: 1rem;">Failed to load video.</div>'
    heroTitle.textContent = ''
  }
}

const renderLoomVideos = async (reset = false) => {
  const grid = document.getElementById('latest-videos-grid')
  if (reset) {
    grid.innerHTML = ''
    loomCurrentPage = 1
  }
  const start = 1 // skip the first video (used in hero)
  const end = start + loomCurrentPage * LOOM_VIDEOS_PER_PAGE
  const videosToShow = loomVideos.slice(start, end)
  grid.innerHTML = ''
  for (const video of videosToShow) {
    const card = document.createElement('div')
    card.className = 'video-card fade-in'
    card.style.animationDelay = '0s'
    // Loading spinner while fetching embed
    card.innerHTML = `<div class="loading-spinner" style="margin: 2rem auto;"></div>`
    grid.appendChild(card)
    try {
      const embed = await fetchLoomEmbed(video.id)
      // Force iframe height to 260px
      let embedHtml = embed.html.replace(
        /<iframe ([^>]*?)height="[0-9]+"([^>]*)>/,
        '<iframe $1height="260" style="height:260px;"$2>'
      )
      card.innerHTML = `
        ${embedHtml}
        <div class="video-title">${video.name || ''}</div>
      `
    } catch (e) {
      card.innerHTML =
        '<div style="color: var(--error-color); padding: 1rem;">Failed to load video.</div>'
    }
  }
  // Show/hide load more button
  const loadMoreBtn = document.getElementById('load-more-videos-btn')
  if (loomVideos.length - 1 > end - 1) {
    loadMoreBtn.style.display = 'inline-flex'
  } else {
    loadMoreBtn.style.display = 'none'
  }
}

const initLoomVideosSection = async () => {
  const grid = document.getElementById('latest-videos-grid')
  grid.innerHTML =
    '<div class="loading-spinner" style="margin: 2rem auto;"></div>'
  try {
    const videosData = await fetchLoomVideos(LOOM_VIDEOS_LIMIT)
    loomVideos = (videosData.edges || []).map((edge) => edge.node)
    loomHasNextPage = videosData.pageInfo?.hasNextPage
    loomEndCursor = videosData.pageInfo?.endCursor
    await renderHeroLoomVideo()
    await renderLoomVideos(true)
  } catch (e) {
    grid.innerHTML =
      '<div style="color: var(--error-color); padding: 2rem;">Failed to load Loom videos.</div>'
    document.getElementById('hero-loom-video').innerHTML = ''
  }
}

// Event listener for load more videos
const setupLoomLoadMore = () => {
  const btn = document.getElementById('load-more-videos-btn')
  btn.addEventListener('click', async () => {
    loomCurrentPage++
    await renderLoomVideos()
  })
}

function animateHeroTitle() {
  const el = document.getElementById('hero-title-animated')
  if (!el) return
  const HERO_TITLES = window.SITE_CONFIG?.heroTitles || []
  let idx = 0
  function showNext() {
    el.classList.remove('fade-in')
    el.classList.add('fade-out')
    setTimeout(() => {
      el.innerHTML = HERO_TITLES[idx]
      el.classList.remove('fade-out')
      el.classList.add('fade-in')
      idx = (idx + 1) % HERO_TITLES.length
      setTimeout(showNext, 6000)
    }, 500)
  }
  if (HERO_TITLES.length > 0) {
    el.innerHTML = HERO_TITLES[0]
    el.classList.add('fade-in')
    idx = 1
    setTimeout(showNext, 6000)
  }
}
