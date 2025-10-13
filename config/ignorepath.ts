const ignorePaths = [
          // Build and dependency directories
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/out/**",
          "**/dist/**",
          "**/build/**",
          "**/coverage/**",
          "**/logs/**",
          "**/tmp/**",
          "**/temp/**",
    
          // Lock files and package management
          "package-lock.json",
          "yarn.lock",
          "pnpm-lock.yaml",
          "bun.lockb",
    
          // Config and cache files
          ".eslintcache",
          "tsconfig.tsbuildinfo",
          "nextconfig.mjs",
          "package.json",
          ".DS_Store",
          "Thumbs.db",
          "desktop.ini",
    
          // Database and migration files
          "prisma/**",
          "**/migrations/**",
          "**/*.sql",
    
          // Media files
          "**/*.png",
          "**/*.jpg",
          "**/*.jpeg",
          "**/*.gif",
          "**/*.bmp",
          "**/*.svg",
          "**/*.ico",
          "**/*.webp",
          "**/*.mp4",
          "**/*.mov",
          "**/*.avi",
          "**/*.mp3",
          "**/*.wav",
          "**/*.pdf",
    
          // Documentation and markdown (optional - remove if you want to include)
          "**/*.md",
          "**/README*",
          "**/CHANGELOG*",
          "**/LICENSE*",
          "**/CONTRIBUTING*",
    
          // Log files
          "*.log",
          "**/*.log",
    
          // Environment and config files
          "**/.env*",
          "**/.*rc",
          "**/.*rc.js",
          "**/.*rc.json",
          "**/.gitignore",
          "**/.gitattributes",
          "**/vercel.json",
          "**/netlify.toml",
    
          // Test files (optional - remove if you want to include tests)
          "**/*.test.*",
          "**/*.spec.*",
          "**/test/**",
          "**/tests/**",
          "**/__tests__/**",
    
          // Style files (optional - remove if you want to analyze CSS/styling)
          "**/*.css",
          "**/*.scss",
          "**/*.sass",
          "**/*.less",
    
          // Data files
          "**/*.json", // Remove this if you need to analyze JSON configs
          "**/*.xml",
          "**/*.csv",
          "**/*.xlsx",
          "**/*.xls",
    
          // Archive files
          "**/*.zip",
          "**/*.tar",
          "**/*.gz",
          "**/*.rar",
]

export default ignorePaths;