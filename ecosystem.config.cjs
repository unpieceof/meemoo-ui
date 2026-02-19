module.exports = {
  apps: [{
    name: 'meemoo-ui',
    script: 'build/index.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
