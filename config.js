// Configuration file for Voiceflow Community GitHub Pages
// Modify these values to customize the site behavior

const SITE_CONFIG = {
  // GitHub Organization Settings
  organization: {
    name: 'voiceflow-community',
    displayName: 'Voiceflow Community',
    description: 'Building the future of conversational AI together',
  },

  // API Configuration
  api: {
    baseUrl: 'https://api.github.com',
    version: '2022-11-28',
    // token: 'github_token',
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Display Settings
  display: {
    reposPerPage: 30,
    latestReposCount: 3,
    maxTopicsPerCard: 3,
    descriptionMaxLength: 150,
    readmePreviewLength: 1000,
  },

  // Feature Flags
  features: {
    enableSearch: true,
    enableFiltering: true,
    enableSorting: true,
    enableModal: true,
    enableReadmePreview: true,
    enableAnalytics: false,
    enableOfflineSupport: true,
  },

  // UI Customization
  ui: {
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
    },
    animations: {
      enableFloatingCards: true,
      enableHoverEffects: true,
      enableLoadingAnimations: true,
    },
    layout: {
      containerMaxWidth: '1200px',
      cardBorderRadius: '12px',
      sectionPadding: '4rem',
    },
  },

  // External Links
  links: {
    mainWebsite: 'https://www.voiceflow.com',
    documentation: 'https://docs.voiceflow.com',
    discord: 'https://discord.gg/voiceflow-community-1079548823610871889',
    github: 'https://github.com/voiceflow-community',
    integrations: 'https://www.voiceflow.com/integrations',
  },

  // SEO and Meta Information
  meta: {
    title: 'Voiceflow Community - Discover Amazing Projects',
    description:
      'Explore community-built integrations, examples, and tools that extend the power of Voiceflow. From chatbot integrations to advanced AI workflows.',
    keywords: 'voiceflow, community, chatbots, ai, integrations, open source',
    author: 'Voiceflow Community',
    ogImage: 'https://cdn.voiceflow.com/assets/logo.png',
  },

  // Analytics Configuration (if enabled)
  analytics: {
    googleAnalyticsId: '', // Add your GA4 ID here
    trackingEvents: {
      repoClick: 'repo_click',
      searchUsage: 'search_usage',
      filterUsage: 'filter_usage',
      modalOpen: 'modal_open',
    },
  },

  // Error Messages
  messages: {
    loading: 'Loading Voiceflow Community Projects...',
    error: 'Failed to load repositories. Please try again later.',
    noResults: 'No repositories found matching your criteria.',
    offline: 'You are currently offline. Some features may not work properly.',
    rateLimit: 'API rate limit exceeded. Please try again later.',
  },

  // Language Colors for Repository Cards
  languageColors: {
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
    Vue: '#4fc08d',
    React: '#61dafb',
    Svelte: '#ff3e00',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
  },

  // Repositories to ignore (by name)
  IGNORE_REPOS: ['.github', 'voiceflow-community.github.io'],
}

// Export configuration for use in other files (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG
}

// Make config available globally (browser)
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = SITE_CONFIG
}
