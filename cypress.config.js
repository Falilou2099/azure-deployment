const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // L'URL de base est configurable via variable d'environnement
    // En CI local : http://localhost:3000
    // Sur la VM   : http://20.19.83.158:3000
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    // Pas de navigateur nécessaire pour les tests API
    video: false,
    screenshotOnRunFailure: false,
  },
});
