import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function canReview(createdAt: Date) {
  const ageDays = Math.floor((Date.now() - createdAt.getTime()) / MS_PER_DAY);
  return ageDays >= 7;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const item = await prisma.item.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  }

  return NextResponse.json({ item });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const item = await prisma.item.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  }

  if (!canReview(item.createdAt)) {
    return NextResponse.json(
      { message: '7日経過していないため判断できません。' },
      { status: 400 }
    );
  }

  const body = (await request.json()) as { reason?: string };
  const reason = body.reason?.trim();

  if (!reason) {
    return NextResponse.json({ message: '理由を入力してください。' }, { status: 400 });
  }

  const updated = await prisma.item.update({
    where: { id: params.id },
    data: {
      status: 'KEPT',
      reason,
      decidedAt: new Date()
    }
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const item = await prisma.item.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  }

  if (!canReview(item.createdAt)) {
    return NextResponse.json(
      { message: '7日経過していないため判断できません。' },
      { status: 400 }
    );
  }

  await prisma.item.delete({
    where: { id: params.id }
  });

  return NextResponse.json({ ok: true });
}
