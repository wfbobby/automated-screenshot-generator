# automated-screenshot-generator

## Node.js puppeteer script to saves screenshots of all the pages listed in parallel

npm install

node generate-screenshots.js


### Concurrency implementations

https://github.com/thomasdondorf/puppeteer-cluster#concurrency-implementations


### Malware Tracking Settings

add referer to track down tricky malware that only shows for certian referers

page.setExtraHTTPHeaders({ referer: "https://www.google.com/search?client=firefox-b-1-d&q=search+term" })