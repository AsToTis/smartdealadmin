const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\smartdeal';

const dirs = [
  'smart-deal-backend/scripts/migrations',
  'smart-deal-backend/scripts/seeds',
  'smart-deal-backend/tests',
  'smart-deal-backend/src',
  'smart-deal-backend/scripts/maintenance'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(targetDir, d), { recursive: true });
});

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.js') && fs.statSync(path.join(targetDir, f)).isFile());

const moves = [];

files.forEach(f => {
  let dest = null;
  if (/^(add_|alter_|update_|setup_)/.test(f) || /^setup-/.test(f)) {
    dest = 'smart-deal-backend/scripts/migrations';
  } else if (/^seed_/.test(f)) {
    dest = 'smart-deal-backend/scripts/seeds';
  } else if (/^test-/.test(f)) {
    dest = 'smart-deal-backend/tests';
  } else if (['server.js', 'db.js', 'read_server.js'].includes(f)) {
    dest = 'smart-deal-backend/src';
  } else if (/^(fix_|check_)/.test(f) || f === 'refresh-auctions.js' || f === 'kill_server.js' || /^fix\.js$/.test(f) || /^fix-sidebar\.js$/.test(f)) {
    dest = 'smart-deal-backend/scripts/maintenance';
  }

  if (dest) {
    moves.push({ src: f, dest: path.join(dest, f), destDir: dest });
  }
});

console.log('Planned moves:', moves.length);

const fileMap = new Map();
files.forEach(f => {
  const move = moves.find(m => m.src === f);
  if (move) {
    fileMap.set(f, move.dest);
    fileMap.set(f.replace(/\.js$/, ''), move.dest);
  } else {
    fileMap.set(f, f);
    fileMap.set(f.replace(/\.js$/, ''), f);
  }
});

moves.forEach(m => {
  const srcPath = path.join(targetDir, m.src);
  let content = fs.readFileSync(srcPath, 'utf8');
  let changed = false;

  content = content.replace(/require\(['"](\.[^'"]+)['"]\)/g, (match, reqPath) => {
    const reqBase = reqPath.replace(/^\.\//, '');
    if (fileMap.has(reqBase)) {
      const targetFullPath = fileMap.get(reqBase);
      const myFullPath = m.dest;
      
      let relPath = path.relative(path.dirname(myFullPath), targetFullPath);
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath;
      }
      
      if (!reqPath.endsWith('.js') && relPath.endsWith('.js')) {
        relPath = relPath.replace(/\.js$/, '');
      }
      relPath = relPath.replace(/\\/g, '/');
      
      console.log(`[${m.src}] Replacing ${reqPath} with ${relPath}`);
      changed = true;
      return `require('${relPath}')`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(srcPath, content, 'utf8');
  }
});

moves.forEach(m => {
  const srcPath = path.join(targetDir, m.src);
  const destPath = path.join(targetDir, m.dest);
  fs.renameSync(srcPath, destPath);
  console.log(`Moved ${m.src} to ${m.dest}`);
});

console.log('Done!');
