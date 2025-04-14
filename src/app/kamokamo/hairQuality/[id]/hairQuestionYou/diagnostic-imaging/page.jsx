'use client';
export const dynamic = 'force-dynamic';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Camera } from 'lucide-react';

export default function DiagnosticImaging() {
  const router = useRouter();
  const params = useParams();

  // useParams()でURLの[id]部分などを取得
  const hairQualityId = params?.id;

  // カメラ映像を表示するためのvideo要素
  const videoRef = useRef(null);
  // 画像を撮影するためのcanvas要素
  const canvasRef = useRef(null);

  // 撮影済みかどうか
  const [isCaptured, setIsCaptured] = useState(false);
  // 撮影後のBase64画像
  const [imageData, setImageData] = useState(null);

  // カメラ起動（アウトカメラを優先指定）
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

    if (!ctx || !video) {
      console.error('Context or video element not found.');
      return;
    }

    // Canvasサイズを映像サイズに合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 撮影画像をBase64文字列に変換
    const captured = canvas.toDataURL('image/png');
    setImageData(captured);
    setIsCaptured(true);
  };

  // 「診断開始」ボタン
  const handleDiagnose = async () => {
    if (!imageData) {
      alert('画像がありません。先に撮影してください。');
      return;
    }
    if (!hairQualityId) {
      alert('hairQualityIdが取得できませんでした。');
      return;
    }

    try {
      // 1) classify-hair に画像を送って髪の診断結果を取得
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], 'scalp.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/classify-hair/`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const hairData = await res.json();
      console.log('髪の診断結果:', hairData);

      // 2) diagnostic_kamo に、取得した髪の診断結果を送る
      const diagRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/diagnostic_kamo/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hageLevel: hairData.result }),
        }
      );
      if (!diagRes.ok) {
        throw new Error(`DiagnosticKamo error: ${diagRes.status}`);
      }
      const diagData = await diagRes.json();
      console.log('GPT診断コメント:', diagData);

      // 3) ページ遷移し、診断データをクエリパラメータに乗せて渡す
      router.push(
        `/kamokamo/hairQuality/${hairQualityId}/hairQuestionYou/diagnostic-imaging/result?answer=${encodeURIComponent(
          JSON.stringify(diagData)
        )}`
      );
    } catch (error) {
      console.error('診断失敗:', error);
      alert('診断に失敗しました。');
    }
  };

  // 「再撮影」ボタン
  const handleRetake = async () => {
    setIsCaptured(false);
    setImageData(null);

    // 再撮影時にもカメラを再度起動して videoRef にセット
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('カメラの再起動に失敗しました:', error);
      }
    }, 300);
  };

  // 撮影ガイド表示用のスタイル (型注釈なしで JS オブジェクトとして定義)
  const frameStyle = {
    width: '100%',
    maxWidth: 400,
    aspectRatio: '1',
    objectFit: 'cover',
    borderRadius: '20px',
  };

  // ボタンのスタイル
  const buttonStyle = {
    padding: '12px 24px',
    margin: '10px',
    fontSize: '16px',
    borderRadius: '12px',
    backgroundColor: '#e5e7eb',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease-in-out',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '24px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Camera size={24} color="#A2D7DB" />
        頭頂部撮影
      </h2>

      {/* 常にDOMにcanvasを配置しておく（撮影時に使用） */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* 撮影前: カメラ映像表示 */}
      {!isCaptured ? (
        <>
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 400,
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <video ref={videoRef} autoPlay playsInline style={frameStyle} />

            {/* 撮影ガイド（円形） */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 240,
                  height: 240,
                  border: '4px dashed #fff',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite',
                }}
              />
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '16px' }}>
            枠線内に収まるように撮影してください
          </p>

          <div style={{ marginTop: 24 }}>
            <button onClick={handleCapture} style={buttonStyle}>
              撮影
            </button>
            {/* 撮影前は「診断開始」ボタンを押せないようにする */}
            <button onClick={handleDiagnose} style={buttonStyle} disabled>
              診断を開始する
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 撮影後: プレビュー表示 */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <img src={imageData || ''} alt="Captured" style={frameStyle} />
          </div>

          <p style={{ fontSize: '14px', color: '#4b5563', marginTop: '16px' }}>
            こちらの写真を診断します
          </p>

          <div style={{ marginTop: 24 }}>
            <button onClick={handleRetake} style={buttonStyle}>
              再撮影
            </button>
            <button
              onClick={handleDiagnose}
              style={{
                ...buttonStyle,
                backgroundColor: '#2563eb',
                color: '#fff',
              }}
            >
              診断を開始する
            </button>
          </div>
        </>
      )}

      {/* アニメーション keyframe */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}