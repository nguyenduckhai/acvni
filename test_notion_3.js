require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_SECRET });

async function test() {
    try {
        const response = await notion.dataSources.query({
            data_source_id: process.env.NOTION_PORTFOLIO_DATABASE_ID,
            page_size: 1
        });
        console.log(JSON.stringify(response.results[0].properties, null, 2));
    } catch (e) {
        console.error("dataSources error:", e.message);
        try {
            const resp2 = await notion.search({
                filter: { value: 'database', property: 'object' }
            });
            console.log("Search results:", resp2);
        } catch (e2) {
             console.log("Search error:", e2.message);
        }
    }
}
test();
