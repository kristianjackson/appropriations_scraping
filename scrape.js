const puppeteer = require('puppeteer');
const fs = require('fs');

// Create 'scraped_data' directory if it doesn't exist
if (!fs.existsSync('scraped_data')) {
    fs.mkdirSync('scraped_data');
}

// List of URLs to scrape
const urls = [
    'https://www.congress.gov/bill/118th-congress/senate-bill/1600/text?format=txt&q=%7B%22search%22%3A%5B%221600%22%5D%7D&r=3&s=1',
    // Add more URLs here
];

(async () => {
    // Initialize a headless browser
    const browser = await puppeteer.launch();
  
    for (const url of urls) {
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle2'});
  
        // Extract data using XPath
        const [element] = await page.$x('//*[@id="billTextContainer"]');
        const data = await page.evaluate(el => el.textContent, element);
        
        // Generate a file name based on the URL
        const fileName = url.split('/').pop() + '.json';
        
        // Write data to JSON file
        fs.writeFileSync(`scraped_data/${fileName}`, JSON.stringify(data));
  
        console.log(`Data from ${url} has been saved.`);
    }
  
    await browser.close();
})();
