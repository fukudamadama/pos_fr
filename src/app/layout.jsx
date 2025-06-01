'use client';

import './globals.css';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  // const isKamokamo = pathname === '/kamokamo'; // ← /kamokamo だけheaderなし

  return (
    <html lang="ja">
      <body
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          // padding: isKamokamo ? "0" : "1rem", // ← /kamokamo だけ余白なし
        }}
      >
        {children}
      </body>
    </html>
  );
}
