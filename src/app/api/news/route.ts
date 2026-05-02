import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET });
const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;

export async function GET() {
    try {
        if (!databaseId) {
            return NextResponse.json({ error: "NOTION_PORTFOLIO_DATABASE_ID is missing" }, { status: 500 });
        }

        const response = await (notion.databases as any).query({
            database_id: databaseId,
            sorts: [
                {
                    property: 'Published Date',
                    direction: 'descending',
                },
            ],
        });

        return NextResponse.json(response.results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
