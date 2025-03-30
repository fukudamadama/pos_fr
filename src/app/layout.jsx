// app/layout.jsx
import { Inter } from 'next/font/google'
import './globals.css'
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "かもかも診断",
  description: "あなたの髪の毛の今と将来をAIで診断するアプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "1rem",
        }}
      >
        {/* ヘッダー */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          {/* タイトル部分をLinkで包む */}
          <Link
            href="/kamokamo"   // クリックで /kamokamo ページへ遷移
            style={{
              textDecoration: "none",  
              color: "inherit",        
              display: "flex",         
              alignItems: "center",
            }}
          >
            <h1 style={{ fontSize: "1.25rem", margin: 0, cursor: 'pointer' }}>
              かもかも診断
            </h1>
          </Link>
        </header>

        {/* 子ページのコンテンツ */}
        {children}
      </body>
    </html>
  );
}
