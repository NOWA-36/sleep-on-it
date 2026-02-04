import Link from 'next/link';
import { notFound } from 'next/navigation';

import DecisionActions from './DecisionActions';
import { prisma } from '@/lib/prisma';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysAgo(date: Date, now: Date) {
  return Math.floor((now.getTime() - date.getTime()) / MS_PER_DAY);
}

export default async function DecisionPage({
  params
}: {
  params: { id: string };
}) {
  const item = await prisma.item.findUnique({
    where: { id: params.id }
  });

  if (!item) {
    notFound();
  }

  const now = new Date();
  const ageDays = daysAgo(item.createdAt, now);
  const canReview = ageDays >= 7 && item.status !== 'KEPT';

  return (
    <div className="card">
      <h1>判断</h1>
      <p className="helper">7日経ったので判断できます。</p>

      <div className="item">
        <div className="item-title">{item.title}</div>
        <div className="item-meta">登録日: {ageDays}日前</div>
        {item.memo ? <div className="item-meta">メモ: {item.memo}</div> : null}
      </div>

      {!canReview ? (
        <div className="notice">
          <p>まだ7日経っていないため判断できません。</p>
          <div className="actions">
            <Link className="btn ghost" href="/">
              戻る
            </Link>
          </div>
        </div>
      ) : (
        <DecisionActions id={item.id} />
      )}
    </div>
  );
}
