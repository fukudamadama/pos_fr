"use client";
export const dynamic = "force-dynamic";

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import {
  Baby,
  AlertCircle,
  ArrowLeft,
  Crown,
  Home,
  UserPlus,
  Scissors,
  ExternalLink
} from 'lucide-react';

// モックデータ
const hairQualityData = {
  hardness: 3,
  thickness: 4,
  volume: 2,
  damage: 3,
  curliness: 4,
};

const lifestyleRisks = [
  { label: '遺伝リスク', level: 'medium' },
  { label: 'ストレス', level: 'high' },
  { label: '生活習慣', level: 'low' },
];

function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawAnswer = searchParams.get("answer");
  let parsedAnswer = null;
  try {
    parsedAnswer = JSON.parse(JSON.parse(rawAnswer).answer); // 二重JSONを解凍
  } catch (e) {
    console.error("診断データの読み取りに失敗しました", e);
  }

  const diagnosisResult = parsedAnswer || {
    score: '-',
    feedback: '診断データを取得できませんでした。もう一度お試しください。',
  };

  console.log("受け取った診断データ:", parsedAnswer);

  const handleExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* <button className="text-gray-600 flex items-center gap-1">
              <ArrowLeft size={20} /> 戻る
            </button> */}
            <div className="flex items-center gap-2 w-full">
              <div className="bg-gray-200 h-2 rounded-full w-full">
                <div className="bg-[#A2D7DB] h-2 rounded-full w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">総合判定結果</h1>
          <p className="text-gray-600">今のあなたの現状と似合う髪型</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
    {/* キャラクター画像（横に配置） */}
            <img
              src="/images/kamo1.png"
              alt="かもかも"
              className="w-12 h-12 object-contain animate-bounce"
            />
    {/* スコアとラベル */}
            <div className="text-center">
            <p className="text-sm text-gray-600">ヘアスコア</p>
              <div className="w-24 h-24 rounded-full bg-[#A2D7DB] flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-white">{diagnosisResult.score}</span>
              </div>
            </div>
    {/* キャラクター画像（横に配置） */}
            <img
              src="/images/kamo2.png"
              alt="かもかも"
              className="w-12 h-12 object-contain animate-bounce"
            />
          </div>


          <div className="grid grid-cols-3 gap-4 mb-6">
            {lifestyleRisks.map((risk) => (
              <div key={risk.label} className="bg-gray-50 rounded-lg p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    risk.level === 'high'
                      ? 'bg-red-100 text-red-500'
                      : risk.level === 'medium'
                      ? 'bg-yellow-100 text-yellow-500'
                      : 'bg-green-100 text-green-500'
                  }`}
                >
                  <AlertCircle size={20} />
                </div>
                <p className="text-sm font-medium text-gray-700">{risk.label}</p>
                <p className="text-xs text-gray-500">
                  {risk.level === 'high'
                    ? '要注意'
                    : risk.level === 'medium'
                    ? '注意'
                    : '良好'}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
          <p className="leading-relaxed" style={{ color: '#24585C' }}>
            {diagnosisResult.feedback}
          </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Scissors className="text-[#A2D7DB]" /> 髪質分析
          </h2>
          <div className="space-y-4">
            {Object.entries(hairQualityData).map(([key, value]) => (
              <div key={key} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">
                  {key === 'hardness'
                    ? '髪の硬さ'
                    : key === 'thickness'
                    ? '髪の太さ'
                    : key === 'volume'
                    ? '毛量'
                    : key === 'damage'
                    ? 'ダメージ'
                    : 'くせの強さ'}
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#A2D7DB] rounded-full"
                      style={{ width: `${(value / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-right text-sm font-medium text-gray-700">{value}/5</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Baby className="text-[#A2D7DB]" /> おすすめの髪型
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* おすすめの髪型1 */}
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1637111628290-0c94c913fbd8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Recommended hairstyle 1"
                className="w-full h-full object-cover"
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                Photo by <a href="https://unsplash.com/@theexplorerdad" target="_blank" rel="noopener noreferrer" className="underline">the explorer dad</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
              </p>
            </div>

            {/* おすすめの髪型2 */}
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1720575791688-645c1fe5a53e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Recommended hairstyle 2"
                className="w-full h-full object-cover"
              />
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                Photo by <a href="https://unsplash.com/@alexbrylov" target="_blank" rel="noopener noreferrer" className="underline">Alex Brylov</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Crown className="text-[#A2D7DB]" /> おすすめ新商品
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* 商品1 */}
            <div className="flex flex-col items-center">
              <div className="aspect-square w-full rounded-lg overflow-hidden">
                <img
                  src="https://www.levata-official.jp/wp/wp-content/themes/mandom-levata/asset/images/products/img_product01.png"
                  alt="スカルプスパシャンプー"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-700 mt-2 text-center">スカルプスパシャンプー</p>
            </div>

            {/* 商品2 */}
            <div className="flex flex-col items-center">
              <div className="aspect-square w-full rounded-lg overflow-hidden">
                <img
                  src="https://www.levata-official.jp/wp/wp-content/themes/mandom-levata/asset/images/products/img_product03.png"
                  alt="スカルプスパブラシ"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-gray-700 mt-2 text-center">スカルプスパブラシ</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => handleExternalLink('https://oops-jp.com/hair/')}
            className="w-full bg-[#A2D7DB] border-2 border-[#A2D7DB] text-[#24585C] py-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#A2D7DB] hover:text-white transition-colors"
          >
            <ExternalLink size={20} />
            薄毛予防について詳しく知る
          </button>
          {/* <button className="flex-1 bg-[#A2D7DB] text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2">
          アカウント作成
          </button> */}
          <button
            onClick={() => router.push('/kamokamo')}
            className="flex-1 border-2 border-[#A2D7DB] text-[#24585C] py-4 rounded-lg font-medium flex items-center justify-center gap-2  hover:bg-[#A2D7DB] hover:text-white transition-colors"
          >
            診断TOPに戻る
          </button>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;