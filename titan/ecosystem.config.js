module.exports = {
  apps: [
    {
      name: "titan-was",
      script: "dist/src/main.js",
      instances: "4",
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      },
    }
  ]
};