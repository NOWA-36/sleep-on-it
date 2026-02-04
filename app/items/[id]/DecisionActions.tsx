'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DecisionActionsProps = {
  id: string;
};

export default function DecisionActions({ id }: DecisionActionsProps) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? '削除に失敗しました。');
      }

      router.push('/');
      router.refresh();
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : '削除に失敗しました。';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeep = async () => {
    setError(null);

    if (!reason.trim()) {
      setError('理由を入力してください。');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: reason.trim()
        })
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        throw new Error(data.message ?? '更新に失敗しました。');
      }

      router.push('/');
      router.refresh();
    } catch (keepError) {
      const message = keepError instanceof Error ? keepError.message : '更新に失敗しました。';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form">
      <div className="field">
        <label htmlFor="reason">まだ欲しい理由 *</label>
        <textarea
          id="reason"
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
      {error ? <p className="notice">{error}</p> : null}
      <div className="actions">
        <button className="btn" type="button" onClick={handleKeep} disabled={isSubmitting}>
          まだ欲しい（理由を保存）
        </button>
        <button className="btn secondary" type="button" onClick={handleDelete} disabled={isSubmitting}>
          いらない（即削除）
        </button>
        <button className="btn ghost" type="button" onClick={() => router.push('/')}> 
          戻る
        </button>
      </div>
    </div>
  );
}
