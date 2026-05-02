import { NextResponse } from 'next/server';
import https from 'https';

function requestNotionAPI(databaseId: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            sorts: [{ property: 'Published Date', direction: 'descending' }]
        });

        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: `/v1/databases/${databaseId}/query`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
                } else {
                    reject(new Error(`Notion API error: ${res.statusCode} ${body}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

export async function GET() {
    try {
        const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;
        if (!databaseId) {
            return NextResponse.json({ error: "NOTION_PORTFOLIO_DATABASE_ID is missing" }, { status: 500 });
        }
        const data = await requestNotionAPI(databaseId);
        return NextResponse.json(data.results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
