const fs = require('fs');

const msgDir = process.argv[2];

const message = fs.readFileSync(msgDir, 'utf-8');

const msgBox = ['feat', 'fix', 'docs', 'style', 'refactor', 'pref', 'test', 'chore'];

const result = msgBox.some(keyword => {
  const reg = new RegExp(`^${keyword}(\(.+\))*: .+`, 'i');
  return reg.test(message);
})

if (result) {
  process.exit(0);
} else {
  console.log('Commit message 不符合要求，请查看 README.md 更正格式');
  process.exit(1);
}

process.exit(0);
