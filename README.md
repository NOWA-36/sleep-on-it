# sleep-on-it

衝動買いを抑えるために、欲しい物を7日間寝かせて判断するミニアプリです。

## セットアップ

```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

## 起動

```bash
npm run dev
```

`http://localhost:3000` を開くと一覧画面が表示されます。

## 簡単な動作確認

1. `/new` でタイトル必須の欲しい物を登録する。
2. 一覧の「寝かせ中」に表示されることを確認する。
3. DBの `createdAt` を7日以上前に変更するか、時間経過を待つ。
4. 「判断待ち」に移動し、「判断へ」から `/items/[id]` で判断できることを確認する。
5. 「いらない」は即削除、「まだ欲しい」は理由必須で保存されることを確認する。
