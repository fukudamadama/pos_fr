// export default function Home() {
//   return <h1>Hello World</h1>
// }

// 20250405これ以降が追記部分
import Image from "next/image"
import Link from "next/link"
import styles from "./page.module.css"

export default function WelcomePage() {
  return (
    <div className={styles.container}>
      {/* 背景デザイン */}
      <div className={styles.backgroundDesign}>
        <div className={styles.topLeftBubble}></div>
        <div className={styles.bottomRightBubble}></div>
        <div className={styles.smallBubble1}></div>
        <div className={styles.smallBubble2}></div>
        <div className={styles.smallBubble3}></div>
      </div>

      {/* メインコンテンツ */}
      <div className={styles.mainContent}>
        <h1 className={styles.title}>
          あなたの髪の毛の今と将来を
          <br />
          AIで診断するアプリ
        </h1>

        <h2 className={styles.appName}>かもかも診断</h2>

        <div className={styles.charactersContainer}>
          <div className={styles.characterImage}>
            <Image src="/images/kamo1.png" alt="緑色のかも" width={144} height={144} />
          </div>
          <div className={styles.characterImage}>
            <Image src="/images/kamo2.png" alt="灰色のかも" width={144} height={144} />
          </div>
        </div>
      </div>

      {/* ボタンとリンク */}
      <div className={styles.buttonsContainer}>
        <Link href="https://app-002-step3-2-node-oshima2.azurewebsites.net/kamokamo/hairQuality" className={styles.startButton}>
          はじめる
        </Link>

        <div className={styles.loginContainer}>
          <span className={styles.loginText}>アカウントをお持ちの方はこちら</span>
          <Link href="#" className={styles.loginLink}>
            ログイン
          </Link>
        </div>

        <Link href="#" className={styles.adminLink}>
          管理者ログインはこちら
        </Link>
      </div>
    </div>
  )
}

