const { Cluster } = require('puppeteer-cluster');

(async () => {
    // Create a cluster with 2 workers
    // https://github.com/thomasdondorf/puppeteer-cluster#concurrency-implementations
    // CONCURRENCY_PAGE, CONCURRENCY_CONTEXT, CONCURRENCY_BROWSER
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
    });

    // Define a task (in this case: screenshot of page)
    await cluster.task(async ({ page, data: item }) => {
        
        const url = item.url;
        
        if (item.referer) {
            page.setExtraHTTPHeaders({ referer: item.referer });
            // console.log('Adding referer: ' + item.referer);
        }
        
        await page.goto(url);
        
        // await page.waitForTimeout(5000);
        
        let path = url.replace(/^http[s]?\:\/\//g, '');
        path = "screenshots/" + path.replace(/[^a-zA-Z]/g, '_') + '.png';

        await page.screenshot({ path, fullPage: true });
        console.log(`Screenshot of ${url} saved: ${path}`);
    });

    // Add some pages to queue
    cluster.queue({ url: 'https://www.npmjs.com/package/puppeteer-extra-plugin-stealth' });
    // cluster.queue({ url: 'https://x5tbs.imtt.qq.com/website/caniuse/others/TestPage/What%20is%20my%20Referer.html', referer: 'https://www.google.com/search?q=whats+is+my+referrer&sourceid=chrome&ie=UTF-8' });
    cluster.queue({ url: 'https://x5tbs.imtt.qq.com/website/caniuse/others/TestPage/What%20is%20my%20Referer.html', referer: 'https://github.com/search' });
    // cluster.queue('https://github.com/');

    // Shutdown after everything is done
    await cluster.idle();
    await cluster.close();
})();