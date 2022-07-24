const { Cluster } = require('puppeteer-cluster');

(async () => {
    // Create a cluster with 2 workers
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    // Define a task (in this case: screenshot of page)
    await cluster.task(async ({ page, data: url }) => {
        
        // page.setExtraHTTPHeaders({ referer: "https://www.google.com/search?client=chrome-b-1-d&q=search+term" })
        
        await page.goto(url);
        
        // await page.waitForTimeout(5000);
        
        let path = url.replace(/^http[s]?\:\/\//g, '_');
        path = "screenshots/" + path.replace(/[^a-zA-Z]/g, '_') + '.png';

        await page.screenshot({ path, fullPage: true });
        console.log(`Screenshot of ${url} saved: ${path}`);
    });

    // Add some pages to queue
    cluster.queue('https://www.npmjs.com/package/puppeteer-extra-plugin-stealth');
    // cluster.queue('https://www.wikipedia.org');
    // cluster.queue('https://github.com/');

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();