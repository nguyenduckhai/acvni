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

// API endpoint to get total count of news
app.get('/api/news/count', async (req, res) => {
    try {
        if (!databaseId) throw new Error("NOTION_PORTFOLIO_DATABASE_ID missing in .env");

        let hasMore = true;
        let nextCursor = undefined;
        let count = 0;

        while (hasMore) {
            const queryArgs = {
                database_id: databaseId,
                page_size: 100,
            };
            if (nextCursor) queryArgs.start_cursor = nextCursor;

            const response = await notion.databases.query(queryArgs);
            count += response.results.length;
            hasMore = response.has_more;
            nextCursor = response.next_cursor;
        }

        res.json({ count });
    } catch (error) {
        console.error('Error fetching count:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get news from Notion with cursor-based skip
app.get('/api/news', async (req, res) => {
    try {
        if (!databaseId) {
            throw new Error("NOTION_PORTFOLIO_DATABASE_ID is missing in .env");
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;

        let nextCursor = undefined;
        let itemsToSkip = (page - 1) * limit;

        // Skip pages to reach the desired offset
        while (itemsToSkip > 0) {
            const skipFetch = Math.min(itemsToSkip, 100);
            const queryArgs = {
                database_id: databaseId,
                page_size: skipFetch,
                sorts: [{ property: 'Published Date', direction: 'descending' }]
            };
            if (nextCursor) queryArgs.start_cursor = nextCursor;

            const skipResponse = await notion.databases.query(queryArgs);
            nextCursor = skipResponse.next_cursor;
            itemsToSkip -= skipFetch;

            if (!skipResponse.has_more) break;
        }

        // Fetch the actual requested page items
        const finalArgs = {
            database_id: databaseId,
            page_size: limit,
            sorts: [{ property: 'Published Date', direction: 'descending' }]
        };
        if (nextCursor) finalArgs.start_cursor = nextCursor;

        const response = await notion.databases.query(finalArgs);

        res.json({
            data: response.results,
            has_more: response.has_more,
            next_cursor: response.next_cursor
        });
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
