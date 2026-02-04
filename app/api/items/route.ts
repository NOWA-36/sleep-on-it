import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string; memo?: string | null };
  const title = body.title?.trim();
  const memo = body.memo?.trim() ?? null;

  if (!title) {
    return NextResponse.json(
      { message: 'タイトルを入力してください。' },
      { status: 400 }
    );
  }

  const item = await prisma.item.create({
    data: {
      title,
      memo: memo && memo.length > 0 ? memo : null
    }
  });

  return NextResponse.json({ item }, { status: 201 });
}
