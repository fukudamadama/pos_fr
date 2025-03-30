"use client"; // App Routerでクライアントコンポーネントを使う場合

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  // ボタンクリック時にページ遷移する
  const handleHairCheck = () => {
    router.push('/hairQuality');  // ふくちゃんページへ遷移
  };

  const handleAiCheck = () => {
    router.push('/aiKamokamo');    // aiチェックページへ遷移
  };

  return (
    <>
      <Head>
        <title>かもかも診断</title>
        <meta
          name="description"
          content="あなたの髪の毛の今と将来をAIで診断するアプリ"
        />
      </Head>

      {/* 全体をラップするコンテナ */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '1rem',
        }}
      >
        {/* ヘッダー部分 */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          {/* 
            <Link href="/">
              <Image
                src="/icons/home.svg"
                alt="home icon"
                width={32}
                height={32}
                style={{ marginRight: '8px', cursor: 'pointer' }}
              />
            </Link> 
          */}
          <h1 style={{ fontSize: '1.25rem', margin: 0 }}>かもかも診断</h1>
        </header>

        {/* メイン内容 */}
        <main>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            あなたの髪の毛の今と将来をAIで診断するアプリ
          </p>

          {/* キャラクター画像＋キャッチコピー */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'inline-block', marginRight: '16px' }}>
              <Image
                src="/images/kamo1.png"
                alt="かも(緑)"
                width={80}
                height={80}
              />
            </div>
            <div style={{ display: 'inline-block' }}>
              <Image
                src="/images/kamo2.png"
                alt="かも(灰)"
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* 髪の質感診断ボタン */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              美容師さんの目視診断
            </p>
            <button
              onClick={handleHairCheck} // クリック時にページ遷移
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              髪の質感診断
            </button>
          </div>

          {/* 画像AI診断ボタン */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
              問診と画像で診断
            </p>
            <button
              onClick={handleAiCheck} // クリック時にページ遷移
              style={{
                display: 'inline-block',
                width: '100%',
                padding: '1rem',
                backgroundColor: '#cfefff',
                border: '1px solid #9fe0ff',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              画像AI診断
            </button>
          </div>

          {/* ログインリンク */}
          <div style={{ marginBottom: '1rem' }}>
            アカウントをお持ちの方はこちら{' '}
            <Link
              href="/login"
              style={{
                color: '#0070f3',
                textDecoration: 'underline',
              }}
            >
              ログイン
            </Link>
          </div>

          {/* 管理者ログインリンク */}
          <div>
            <Link
              href="/admin"
              style={{
                color: '#0070f3',
                textDecoration: 'underline',
              }}
            >
              管理者ログインはこちら
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

