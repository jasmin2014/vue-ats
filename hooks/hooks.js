const fs = require('fs');
const path = require('path');

const bashDir = './hooks/bash';
// 判断是否已经存在 .git/hooks/
if (!fs.existsSync('.git/hooks/')) {
  fs.mkdirSync('.git/hooks/');
}

fs.readdir(bashDir, (err, files) => {
  files.forEach(sh => {
    const src = path.join(bashDir, sh);
    const dst = path.join('.git/hooks/', sh);
    fs.stat(src, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        let readable = fs.createReadStream(src);
        let writable = fs.createWriteStream(dst, {
          encoding: 'utf8',
          mode: 0o777
        });
        readable.pipe(writable);
      }
    })
  })
})
