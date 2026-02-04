import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sleep On It',
  description: '衝動買いを寝かせるためのミニアプリ'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
