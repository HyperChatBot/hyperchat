module.exports = {
    apps: [
      {
        name: 'hyperchat-website',
        script: 'node_modules/.bin/next start',
        watch: true,
        autorestart: true,
        max_memory_restart: '1G',
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production'
        }
      }
    ]
  }
  