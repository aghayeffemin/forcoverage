const puppeteer = require('puppeteer-core');
const util = require('util');
const fs    = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox'],
    executablePath: "C:/Users/EminAg/Downloads/Win_x64_750058_chrome-win/chrome-win/chrome.exe"
  });
 const page = await browser.newPage();
 await page.coverage.startCSSCoverage();
 await page.goto('http://e-emdk.gov.az:30095/'); // Change this
 const css_coverage = await page.coverage.stopCSSCoverage();
 console.log(util.inspect(css_coverage, { showHidden: false, depth: null }));
 await browser.close();

let final_css_bytes = '';
let total_bytes = 0;
let used_bytes = 0;

for (const entry of css_coverage) {
  final_css_bytes = "";

  total_bytes += entry.text.length;
  for (const range of entry.ranges) {
    used_bytes += range.end - range.start - 1;
    final_css_bytes += entry.text.slice(range.start, range.end) + '\n';
  }

  filename = entry.url.split('/').pop();

  fs.writeFile('./coveragedFiles/'+filename, final_css_bytes, error => {
    if (error) {
      console.log('Error creating file:', error);
    } else {
      console.log('File saved');
    }
  });
}
})();