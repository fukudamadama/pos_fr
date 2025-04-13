'use client';
export const dynamic = "force-dynamic";

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DiagnosticCheckPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 撮影済みかどうか
  const [isCaptured, setIsCaptured] = useState(false);
  // 撮影後のBase64画像
  const [imageData, setImageData] = useState(null);

  // カメラ起動（アウトカメラを優先して指定）
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('カメラの起動に失敗しました:', error);
      }
    };
    startCamera();
  }, []);

  // 「撮影」ボタン
  const handleCapture = () => {
    if (!canvasRef.current) {
      console.error('Canvas element not found.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    // Canvasサイズを映像サイズに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 撮影画像をBase64文字列に変換
    const captured = canvas.toDataURL('image/png');
    setImageData(captured);
    setIsCaptured(true); 
  };


  // 「診断開始」ボタン（修正ポイント）
  const handleDiagnose = async () => {
    if (!imageData) {
      alert('画像がありません。先に撮影してください。');
      return;
    }
    try {
      // === 1) まず /classify-hair/ に画像を送って髪の診断結果を取得 ===
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], 'scalp.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/classify-hair/`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const hairData = await res.json();
      console.log('髪の診断結果:', hairData);

      // === 2) 次に /diagnostic_kamo/ に、上で得た髪の診断結果を送る ===
      // ここでは例として「hairData.result」を question として送信している
      // 必要に応じて hairData 全体を渡してもOK
      const diagRes = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/diagnostic_kamo/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hageLevel: hairData.result })
      });
      if (!diagRes.ok) {
        throw new Error(`DiagnosticKamo error: ${diagRes.status}`);
      }

      const diagData = await diagRes.json();
      console.log('GPT診断コメント:', diagData);

      // === 3) ページ遷移し、診断データをクエリパラメータなどに乗せて渡す ===
      // 例: '/result' ページに answer を持たせて遷移
      // 注: データが大きい場合は状態管理やlocalStorage等を検討
      router.push(`/kamokamo/hairQuality/hairQuestionYou/diagnostic-imaging/result?answer=${encodeURIComponent(JSON.stringify(diagData))}`);

    } catch (error) {
      console.error('診断失敗:', error);
      alert('診断に失敗しました。');
    }
  };

  // 「再撮影」ボタン
  // カメラをもう一度起動するようにする
  const handleRetake = async () => {
    setIsCaptured(false);
    setImageData(null);

    // 再撮影時にもカメラを再度起動して videoRef にセット
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('再撮影時のカメラ起動に失敗しました:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>頭頂部撮影</h2>

      {/* 常にDOMにcanvasを配置しておく（撮影時に使用） */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* 撮影前: カメラ映像表示 */}
      {!isCaptured ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', maxWidth: 400, borderRadius: '10px' }}
          />
          <p>枠線内に収まるように撮影してください</p>
          
          {/* 撮影ボタン */}
          <button onClick={handleCapture} style={buttonStyle}>
            📸 撮影
          </button>
          
          {/* 撮影前は「診断開始」ボタンを押せないようにする */}
          <button onClick={handleDiagnose} style={buttonStyle} disabled>
            診断を開始する
          </button>
        </>
      ) : (
        <>
          {/* 撮影後: プレビュー表示 */}
          <img
            src={imageData}
            alt="Captured"
            style={{ width: '100%', maxWidth: 400, borderRadius: '10px' }}
          />
          
          <div style={{ marginTop: 20 }}>
            {/* 再撮影ボタン */}
            <button onClick={handleRetake} style={buttonStyle}>🔄 再撮影</button>
            
            {/* 診断開始ボタン（撮影後のみ有効） */}
            <button
              onClick={handleDiagnose}
              style={{ ...buttonStyle, backgroundColor: '#3366cc', color: '#fff' }}
            >
              診断を開始する
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '16px',
  borderRadius: '8px',
  backgroundColor: '#ddd',
  cursor: 'pointer',
  border: 'none'
};
