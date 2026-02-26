const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, '../public/version.json');
const swFile = path.join(__dirname, '../public/sw.js');

const version = {
  version: Date.now().toString(),
  timestamp: new Date().toISOString(),
  build: process.env.VERCEL_GIT_COMMIT_SHA || 'local'
};

fs.writeFileSync(versionFile, JSON.stringify(version, null, 2));
console.log('✅ Version updated:', version.version);

let swContent = fs.readFileSync(swFile, 'utf8');
swContent = swContent.replace(/const CACHE_NAME = 'locana-v[^']*'/, `const CACHE_NAME = 'locana-v${version.version}'`);
fs.writeFileSync(swFile, swContent);
console.log('✅ Service worker cache updated');
