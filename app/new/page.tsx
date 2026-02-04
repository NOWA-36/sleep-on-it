'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewItemPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('タイトルを入力してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title.trim(),
          memo: memo.trim() ? memo.trim() : null
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? '保存に失敗しました。');
      }

      router.push('/');
      router.refresh();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : '保存に失敗しました。';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h1>欲しい物を追加</h1>
      <p className="helper">タイトルは必須です。メモは任意です。</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">タイトル *</label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="memo">メモ</label>
          <textarea
            id="memo"
            name="memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
        {error ? <p className="notice">{error}</p> : null}
        <div className="actions">
          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '保存中...' : '保存する'}
          </button>
          <button className="btn ghost" type="button" onClick={() => router.push('/')}>
            戻る
          </button>
        </div>
      </form>
    </div>
  );
}
