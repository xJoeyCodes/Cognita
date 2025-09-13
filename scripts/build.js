import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy assets from assets/ to public/ for Vite to serve them
const assetsDir = path.join(__dirname, '..', 'assets');
const publicDir = path.join(__dirname, '..', 'public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy all files from assets to public
function copyAssets() {
  const files = fs.readdirSync(assetsDir);
  
  files.forEach(file => {
    const srcPath = path.join(assetsDir, file);
    const destPath = path.join(publicDir, file);
    
    if (fs.statSync(srcPath).isFile()) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to public/`);
    }
  });
}

// Copy robots.txt if it exists
const robotsSrc = path.join(__dirname, '..', 'public', 'robots.txt');
if (fs.existsSync(robotsSrc)) {
  console.log('robots.txt already exists in public/');
}

console.log('Asset copying completed!');
copyAssets();
