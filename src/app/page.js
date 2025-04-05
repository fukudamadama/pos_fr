// export default function Home() {
//   return <h1>Hello World</h1>
// }

// 20250405これ以降が追記部分
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#e0f7ff] via-[#e9fff8] to-[#e0ffee] relative overflow-hidden">
      {/* 装飾的な波線 - 上部 */}
      <div className="absolute top-0 left-0 w-full h-40 opacity-20 pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-full">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#a2d9ff"
            className="opacity-30"
          ></path>
        </svg>
      </div>

      {/* 装飾的な波線 - 下部 */}
      <div className="absolute bottom-0 left-0 w-full h-40 opacity-20 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full rotate-180"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#a2d9ff"
            className="opacity-30"
          ></path>
        </svg>
      </div>

      {/* 装飾的な円形 */}
      <div className="absolute top-1/4 right-0 w-40 h-40 rounded-full bg-[#a2ffdb] opacity-20 blur-xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-32 h-32 rounded-full bg-[#a2d9ff] opacity-20 blur-xl pointer-events-none"></div>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-between px-6 pt-10 pb-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold mb-2">
            あなたの髪の毛の今と将来を
            <br />
            AIで診断するアプリ
          </h1>

          <h2 className="text-4xl font-bold mt-8 mb-6">かもかも診断</h2>

          {/* かものキャラクターを横並びに表示 */}
          <div className="flex justify-center items-center gap-1 my-6 w-full">
            <div className="relative w-32 h-40">
              <img src="/kamo1.png" alt="かもキャラクター1" width={120} height={150} className="object-contain" />
            </div>
            <div className="relative w-32 h-40">
              <img src="/kamo2.png" alt="かもキャラクター2" width={120} height={150} className="object-contain" />
            </div>
          </div>
        </div>

        {/* ボタンとログインリンク */}
        <div className="w-full flex flex-col items-center gap-8">
          <button className="w-full bg-black text-white py-4 px-6 rounded-full text-xl font-medium hover:bg-gray-800 transition-colors">
            はじめる
          </button>

          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-700">アカウントをお持ちの方はこちら</span>
            <Link href="/login" className="text-sm font-medium">
              ログイン
            </Link>
          </div>

          <Link href="/admin" className="text-sm text-blue-600">
            管理者ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  )
}

