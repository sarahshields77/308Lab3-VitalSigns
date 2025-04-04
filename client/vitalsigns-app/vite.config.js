// vitalsigns-app/vite.config.js for vitalSignsApp
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
//
export default defineConfig({
  server: {
    port: 3002, 
  },
  plugins: [
    react(),
    federation({
      name: 'vitalSignsApp',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App', 
      },
      shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },

});
