const figlet = require('figlet');
const lolcat = require('@darkobits/lolcatjs');

function printBanner() {
  try {
    const asciiArt = figlet.textSync('Iceberg CLI', { font: 'Slant' });
    console.log(lolcat.fromString(asciiArt));
  } catch (error) {
    console.log('Iceberg CLI');
    console.warn('无法渲染彩色 Banner：', error.message);
  }
}

module.exports = { printBanner };
