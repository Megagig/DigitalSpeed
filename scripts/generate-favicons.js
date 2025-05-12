const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if ImageMagick is installed
try {
  execSync('convert -version', { stdio: 'ignore' });
} catch (error) {
  console.error('Error: ImageMagick is not installed. Please install it first.');
  console.error('On Ubuntu/Debian: sudo apt-get install imagemagick');
  console.error('On macOS: brew install imagemagick');
  process.exit(1);
}

const publicDir = path.join(__dirname, '..', 'public');

// Generate favicon.ico from favicon.svg
console.log('Generating favicon.ico...');
try {
  execSync(`convert -background none -density 256x256 ${path.join(publicDir, 'favicon.svg')} -define icon:auto-resize=16,32,48,64 ${path.join(publicDir, 'favicon.ico')}`);
  console.log('favicon.ico generated successfully.');
} catch (error) {
  console.error('Error generating favicon.ico:', error.message);
}

// Generate apple-icon.png from apple-icon.svg
console.log('Generating apple-icon.png...');
try {
  execSync(`convert -background none -density 180x180 ${path.join(publicDir, 'apple-icon.svg')} ${path.join(publicDir, 'apple-icon.png')}`);
  console.log('apple-icon.png generated successfully.');
} catch (error) {
  console.error('Error generating apple-icon.png:', error.message);
}

console.log('All favicons generated successfully.');
