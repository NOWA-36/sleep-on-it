import Link from 'next/link';

import { prisma } from '@/lib/prisma';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysAgo(date: Date, now: Date) {
  return Math.floor((now.getTime() - date.getTime()) / MS_PER_DAY);
}

function formatDaysAgo(days: number) {
  return `${days}日前`;
}

export default async function HomePage() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: 'desc' }
  });
  const now = new Date();

  const grouped = items.reduce(
    (acc, item) => {
      const ageDays = daysAgo(item.createdAt, now);
      const canReview = ageDays >= 7 && item.status !== 'KEPT';
      const section = item.status === 'KEPT' ? 'kept' : canReview ? 'review' : 'sleeping';

      acc[section].push({
        ...item,
        ageDays,
        canReview
      });

      return acc;
    },
    {
      sleeping: [] as Array<typeof items[number] & { ageDays: number; canReview: boolean }>,
      review: [] as Array<typeof items[number] & { ageDays: number; canReview: boolean }>,
      kept: [] as Array<typeof items[number] & { ageDays: number; canReview: boolean }>
    }
  );

  const renderList = (
    sectionItems: Array<typeof items[number] & { ageDays: number; canReview: boolean }>,
    emptyMessage: string
  ) => {
    if (sectionItems.length === 0) {
      return <p className="notice">{emptyMessage}</p>;
    }

    return (
      <div className="list">
        {sectionItems.map((item) => (
          <div key={item.id} className="item">
            <div className="item-title">{item.title}</div>
            <div className="item-meta">
              登録日: {formatDaysAgo(item.ageDays)} / メモ: {item.memo ? 'あり' : 'なし'}
            </div>
            {item.canReview ? (
              <div className="actions">
                <Link className="btn" href={`/items/${item.id}`}>
                  判断へ
                </Link>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <header>
        <div>
          <h1>欲しい物寝かせ</h1>
          <p className="helper">7日間寝かせてから判断します。</p>
        </div>
        <Link className="btn" href="/new">
          追加する
        </Link>
      </header>

      <section className="section">
        <h2>寝かせ中</h2>
        {renderList(grouped.sleeping, 'いま寝かせ中のアイテムはありません。')}
      </section>

      <section className="section">
        <h2>判断待ち</h2>
        {renderList(grouped.review, '判断待ちのアイテムはありません。')}
      </section>

      <section className="section">
        <h2>継続</h2>
        {renderList(grouped.kept, '継続中のアイテムはありません。')}
      </section>
    </>
  );
}
