import { NextResponse } from 'next/server';
import https from 'https';

function requestNotionAPI(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
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
        req.end();
    });
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const page = await requestNotionAPI(`/v1/pages/${id}`);
        const blocks = await requestNotionAPI(`/v1/blocks/${id}/children`);
        
        return NextResponse.json({ page, blocks: blocks.results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
