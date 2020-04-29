const Apify = require('apify');

const sourceUrl = 'https://www.worldometers.info/coronavirus/?utm_campaign=homeAdvegas1?';
const LATEST = 'LATEST';
let check = false;

Apify.main(async () => {

    console.log('Launching Puppeteer...');
    const browser = await Apify.launchPuppeteer();

    const page = await browser.newPage();
    await Apify.utils.puppeteer.injectJQuery(page);

    console.log('Going to the main website...');
    await page.goto(sourceUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    console.log('Getting data...');
    const result = await page.evaluate(() => {
        const infected = $('#main_table_countries_today > tbody:nth-child(2) > tr:nth-child(4) > td.sorting_1').text();

        const regionsTableRows = Array.from(document.querySelectorAll("#main_table_countries_today > tbody > tr"));
        const regionData = [];

        for (const row of regionsTableRows) {
            const cells = Array.from(row.querySelectorAll("td")).map(td => td.textContent);
            regionData.push({country: cells[0], 
                // totalCases: cells[1], newCases: cells[2],totalDeaths: cells[3], newDeaths: cells[4],totalRecovered: cells[5], activeCases: cells[6], seriousCritical: cells[7], casesPerMil: cells[8], deathsPerMil: cells[9], totalTests: cells[10], testsPerMil: cells[11]
            });
        }


        const data = {
            infected: infected,
            regionData: regionData
        };
        return data;
    });
    console.log(result)
});
