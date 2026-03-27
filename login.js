const { spawn } = require('child_process');
const fs = require('fs');

if (fs.existsSync('token.txt')) fs.unlinkSync('token.txt');
if (fs.existsSync('token_used.txt')) fs.unlinkSync('token_used.txt');

const child = spawn('firebase.cmd', ['login', '--reauth', '--no-localhost', '--interactive'], { env: process.env, shell: true });

child.stdout.on('data', d => process.stdout.write(d));
child.stderr.on('data', d => process.stderr.write(d));

const checkInterval = setInterval(() => {
  if (fs.existsSync('token.txt')) {
    const token = fs.readFileSync('token.txt', 'utf8').trim();
    if (token) {
        console.log('\n[Auto-Script] Found token.txt! Submitting to Firebase...\n');
        child.stdin.write(token + '\n');
        fs.renameSync('token.txt', 'token_used.txt');
    }
  }
}, 1000);

child.on('close', code => {
    console.log(`\n[Auto-Script] Firebase process exited with code ${code}`);
    clearInterval(checkInterval);
});
