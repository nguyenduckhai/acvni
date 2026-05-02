import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const page = await notion.pages.retrieve({ page_id: id });
        const blocks = await notion.blocks.children.list({ block_id: id });
        
        return NextResponse.json({ page, blocks: blocks.results });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
