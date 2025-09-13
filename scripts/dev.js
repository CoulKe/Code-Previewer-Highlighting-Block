#!/usr/bin/env node

require('dotenv').config();

const { spawn } = require('child_process');

const wordpressUrl = process.env.WORDPRESS_URL;

if (!wordpressUrl) {
  console.error('❌ Error: WORDPRESS_URL environment variable is missing!');
  console.error('📝 Please create a .env file with `WORDPRESS_URL` environment variable e.g. `WORDPRESS_URL=http://example.local`');
  process.exit(1);
}

console.log(`🚀 Starting development server...`);
console.log(`📡 WordPress URL: ${wordpressUrl}`);
console.log(`🔄 Auto-refresh enabled`);

// Start WordPress Scripts
const wpScripts = spawn('npx', ['wp-scripts', 'start', '--blocks-manifest'], {
  stdio: 'inherit',
  shell: true
});

// Start BrowserSync
const browserSync = spawn('npx', [
  'browser-sync',
  'start',
  '--proxy',
  wordpressUrl,
  '--files',
  'build/**/*',
  '--no-open',
  '--no-notify'
], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  wpScripts.kill('SIGINT');
  browserSync.kill('SIGINT');
  process.exit(0);
});

wpScripts.on('error', (err) => {
  console.error('❌ WordPress Scripts error:', err);
});

browserSync.on('error', (err) => {
  console.error('❌ BrowserSync error:', err);
});
