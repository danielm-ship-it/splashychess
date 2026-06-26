const fs = require('fs');
const path = require('path');

const candidates = [
  path.join(__dirname, '..', 'node_modules', 'stockfish', 'src', 'stockfish.js'),
  path.join(__dirname, '..', 'node_modules', 'stockfish', 'stockfish.js'),
];

const dest = path.join(__dirname, '..', 'public', 'stockfish.js');

let copied = false;
for (const src of candidates) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ ChessSage: Copied stockfish.js → public/stockfish.js`);
    copied = true;
    break;
  }
}

if (!copied) {
  console.warn('⚠  ChessSage: stockfish.js not found in node_modules. Engine analysis will be unavailable.');
  console.warn('   Run: npm install stockfish  then  npm run postinstall');
}
