require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_SECRET });

async function test() {
    try {
        const response = await notion.databases.query({
            database_id: process.env.NOTION_PORTFOLIO_DATABASE_ID,
            page_size: 1
        });
        console.log(JSON.stringify(response.results[0].properties, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}
test();
