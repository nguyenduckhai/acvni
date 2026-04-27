require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./')); // Serve static files from the current directory

// Initialize Notion Client
const notion = new Client({ auth: process.env.NOTION_SECRET });
const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;

// API endpoint to get news from Notion
app.get('/api/news', async (req, res) => {
    try {
        if (!databaseId) {
            throw new Error("NOTION_PORTFOLIO_DATABASE_ID is missing in .env");
        }

        const response = await notion.databases.query({
            database_id: databaseId,
            // You can add sorts here, e.g., sort by date descending
            sorts: [
                {
                    property: 'Published Date', // Actual property name
                    direction: 'descending',
                },
            ],
        });

        res.json(response.results);
    } catch (error) {
        console.error('Error fetching from Notion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get a single news article by ID
app.get('/api/news/:id', async (req, res) => {
    try {
        const pageId = req.params.id;
        const page = await notion.pages.retrieve({ page_id: pageId });
        const blocks = await notion.blocks.children.list({ block_id: pageId });
        
        res.json({ page, blocks: blocks.results });
    } catch (error) {
        console.error('Error fetching page from Notion:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
