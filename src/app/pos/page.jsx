// ファイルパス: src/app/pos/page.jsx

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Camera, Plus, ShoppingCart, Trash2, Check, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// ZXing 関連インポート
import { BrowserMultiFormatReader } from "@zxing/browser"
import { NotFoundException } from "@zxing/library"

export default function POSApp() {
  /** ─────────────────────────────────────────────
   *  1. 画面状態（state）と参照（ref）を定義
   * ───────────────────────────────────────────── */
  const [scannedCode, setScannedCode] = useState("")        // 検出されたバーコード文字列
  const [currentProduct, setCurrentProduct] = useState(null) // バックエンドから取得した商品情報
  const [cart, setCart] = useState([])                      // カートに入れた商品の配列
  const [isScanning, setIsScanning] = useState(false)       // 「カメラ起動中かどうか」のフラグ
  const [showCheckout, setShowCheckout] = useState(false)   // 購入確認ダイアログ表示フラグ
  const [manualCode, setManualCode] = useState("")          // 手動入力バーコード用のテキスト
  const [errorMessage, setErrorMessage] = useState("")      // 画面上部のエラー表示用メッセージ

  // ZXing のリーダーインスタンスを保持する ref
  // ── “null” のときは「スキャン停止済み」あるいは「まだ起動していない」状態
  const codeReader = useRef(null)

  // <video> 要素の DOM を参照するための ref
  const videoRef = useRef(null)

  /** ─────────────────────────────────────────────
   *  2. バックエンドのベース URL（環境変数から取得）
   *     NEXT_PUBLIC_API_ENDPOINT 例: "https://localhost:8000"
   * ───────────────────────────────────────────── */
  const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || ""

  /** ─────────────────────────────────────────────
   *  3. バックエンドから商品を取得する関数
   *     GET /products/{code}
   * ───────────────────────────────────────────── */
  const fetchProduct = async (code) => {
    try {
      const res = await fetch(
        `${API_BASE}/products/${encodeURIComponent(code)}`
      )
      if (res.ok) {
        const data = await res.json()
        return {
          prd_id: data.prd_id,
          code: data.code,
          name: data.name,
          price: data.price,
        }
      } else if (res.status === 404) {
        return null
      } else {
        console.error("予期しないエラー:", res.status)
        return null
      }
    } catch (err) {
      console.error("バックエンド呼び出しエラー:", err)
      return null
    }
  }

  /** ─────────────────────────────────────────────
   *  4. 商品検索：fetchProduct を呼び currentProduct にセット
   * ───────────────────────────────────────────── */
  const searchProduct = async (code) => {
    if (!code.trim()) return
    setErrorMessage("")
    setCurrentProduct(null)
    setScannedCode(code)

    const product = await fetchProduct(code.trim())
    if (product) {
      setCurrentProduct(product)
    } else {
      setCurrentProduct(null)
      setErrorMessage("商品が見つかりませんでした。コードを確認してください。")
    }
  }

  /** ─────────────────────────────────────────────
   *  5. カートに商品を追加
   * ───────────────────────────────────────────── */
  const addToCart = () => {
    if (!currentProduct) return

    const existing = cart.find(
      (item) => item.prd_id === currentProduct.prd_id
    )
    if (existing) {
      setCart(
        cart.map((item) =>
          item.prd_id === currentProduct.prd_id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          ...currentProduct,
          quantity: 1,
          total: currentProduct.price,
        },
      ])
    }

    // リセット
    setCurrentProduct(null)
    setScannedCode("")
    setManualCode("")
    setErrorMessage("")
  }

  /** ─────────────────────────────────────────────
   *  6. カートから商品を削除
   * ───────────────────────────────────────────── */
  const removeFromCart = (prd_id) => {
    setCart(cart.filter((item) => item.prd_id !== prd_id))
  }

  /** ─────────────────────────────────────────────
   *  7. 合計金額の計算
   * ───────────────────────────────────────────── */
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + tax

  /** ─────────────────────────────────────────────
   *  8. 「スキャン（カメラ）」ボタンをクリックしたとき
   * ───────────────────────────────────────────── */
  const startScan = () => {
    console.log("【デバッグ】startScan() → setIsScanning(true)")

    // 前回の結果が残っていると見づらいのでクリアしておく
    setScannedCode("")
    setCurrentProduct(null)
    setErrorMessage("")

    setIsScanning(true)
  }

  /** ─────────────────────────────────────────────
   *  9. useEffect：isScanning が true のときに ZXing を起動
   * ───────────────────────────────────────────── */
  useEffect(() => {
    // ① isScanning が false（キャンセルされた／解析終了した）とき
    if (!isScanning) {
      console.log(
        "【デバッグ】isScanning が false → コールバック停止/リセット (useEffect cleanup 相当)"
      )
      if (
        codeReader.current &&
        typeof codeReader.current.reset === "function"
      ) {
        codeReader.current.reset()
      }
      codeReader.current = null
      return
    }

    // ② isScanning が true になったときの処理
    console.log("【デバッグ】isScanning が true → 500ms 待ってからカメラ起動")
    setErrorMessage("スキャンを開始しています…少しお待ちください。")

    const timerId = setTimeout(() => {
      if (videoRef.current) {
        console.log(
          "【デバッグ】videoRef.current が存在 → Camera (BrowserMultiFormatReader) 起動準備"
        )
        // ローカルの reader インスタンスを作成
        const reader = new BrowserMultiFormatReader()
        codeReader.current = reader

        // decodeFromVideoDevice を呼び出す
        reader
          .decodeFromVideoDevice(
            null, // null を渡すとブラウザがデフォルトカメラを自動選択
            videoRef.current,
            (result, err) => {
              // ── ここからコールバック処理 ──

              // 【重要】現在の codeReader.current と、このコールバックを発行している reader インスタンスを比較し、
              //       一致しなければ“古い読み取り”として無視する
              if (reader !== codeReader.current) {
                return
              }

              // result がある＝バーコード検出成功
              if (result) {
                const codeText = result.getText()
                console.log("【ZXing callback】バーコード検出 →", codeText)

                // (1) この reader をリセットしてスキャンを完全に停止
                if (
                  codeReader.current &&
                  typeof codeReader.current.reset === "function"
                ) {
                  codeReader.current.reset()
                }
                codeReader.current = null

                // (2) React 側の isScanning を false にする（video を非表示にするトリガー）
                setIsScanning(false)

                // (3) 検出コードをセットし、商品検索を実行
                setScannedCode(codeText)
                searchProduct(codeText)
                return
              }

              // NotFoundException はバーコード未検出なので無視するが、
              // それ以外の err（権限拒否や内部エラーなど）はここで通知してスキャン停止する
              if (err && !(err instanceof NotFoundException)) {
                console.error("解析中の予期せぬエラー：", err)
                setErrorMessage("解析中にエラーが発生しました。もう一度お試しください。")

                // エラーが起きたら reader をリセットしてスキャン停止
                if (
                  codeReader.current &&
                  typeof codeReader.current.reset === "function"
                ) {
                  codeReader.current.reset()
                }
                codeReader.current = null
                setIsScanning(false)
              }
              // ── ここまでコールバック処理 ──
            }
          )
          .catch((e) => {
            // getUserMedia / カメラ起動に失敗したとき
            console.error("カメラ起動エラー：", e)
            setErrorMessage(
              "カメラの初期化に失敗しました。権限設定やHTTPSを確認してください。"
            )
            setIsScanning(false)
          })
      } else {
        console.warn(
          "【デバッグ】videoRef.current が null（<video> がまだ描画されていない）"
        )
        setErrorMessage("カメラ映像を取得できませんでした。ページを再読み込みしてください。")
        setIsScanning(false)
      }
    }, 500) // 0.5秒待つ

    // クリーンアップ。isScanning が false になるか、コンポーネントがアンマウントされたとき
    return () => {
      clearTimeout(timerId)
      console.log("【デバッグ】useEffect のクリーンアップ → ZXing リセット")
      if (
        codeReader.current &&
        typeof codeReader.current.reset === "function"
      ) {
        codeReader.current.reset()
      }
      codeReader.current = null
    }
  }, [isScanning])

  /** ─────────────────────────────────────────────
   * 10. 手動入力から検索
   * ───────────────────────────────────────────── */
  const handleManualSearch = async () => {
    if (manualCode.trim()) {
      await searchProduct(manualCode.trim())
    }
  }

  /** ─────────────────────────────────────────────
   * 11. 購入完了：バックエンドにヘッダ→明細を登録する
   * ───────────────────────────────────────────── */
  const completePurchase = async () => {
    setErrorMessage("")

    try {
      // ―――――― 取引ヘッダを作成 (POST /transactions/) ――――――
      const headerPayload = {
        emp_cd: "E000000001",
        store_cd: "S001",
        pos_no: "001",
        total_amt: total,
        ttl_amt_ex_tax: subtotal,
      }
      console.log("【デバッグ】completePurchase → ヘッダ登録 payload:", headerPayload)

      const resHeader = await fetch(`${API_BASE}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headerPayload),
      })
      if (!resHeader.ok) {
        throw new Error(`取引ヘッダ作成エラー: ${resHeader.status}`)
      }
      const headerData = await resHeader.json()
      console.log("【デバッグ】ヘッダ登録完了 → 回答:", headerData)

      const trd_id = headerData.trd_id

      // ―――――― 明細を一件ずつ登録 (POST /transactions/{trd_id}/details/) ――――――
      for (const item of cart) {
        const detailPayload = {
          trd_id: trd_id,
          prd_id: item.prd_id,
          prd_code: item.code,
          prd_name: item.name,
          prd_price: item.price,
          tax_cd: "10",
        }
        console.log("【デバッグ】completePurchase → 明細登録 payload:", detailPayload)

        const resDetail = await fetch(
          `${API_BASE}/transactions/${trd_id}/details/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detailPayload),
          }
        )
        if (!resDetail.ok) {
          throw new Error(
            `明細登録エラー (prd_id: ${item.prd_id}): ${resDetail.status}`
          )
        }
      }

      console.log("【デバッグ】completePurchase → 登録完了")
      setCart([])
      setShowCheckout(false)
      alert(`購入が完了しました！\n合計 (税込): ${total}円\n税抜: ${subtotal}円`)
    } catch (err) {
      console.error("completePurchase 中のエラー:", err)
      setErrorMessage("購入処理中にエラーが発生しました。再度お試しください。")
      setShowCheckout(false)
    }
  }

  /** ─────────────────────────────────────────────
   * 12. JSX 部分：画面描画
   * ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-blue-600">
              モバイルPOSアプリ
            </CardTitle>
          </CardHeader>
        </Card>

        {/* 画面上部のエラー表示 */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* スキャンエリア */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* (8) カメラ起動ボタン */}
            <Button
              onClick={startScan}
              className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600"
              disabled={isScanning}
            >
              <Camera className="mr-2 h-6 w-6" />
              {isScanning ? "スキャン中..." : "スキャン（カメラ）"}
            </Button>

            {/* カメラ起動中のみ <video> を表示 */}
            {isScanning && (
              <div className="relative">
                <div className="border rounded overflow-hidden">
                  <video
                    ref={videoRef}
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      height: "auto",
                      backgroundColor: "#000", // カメラ映像が映らないときは黒い四角になる
                    }}
                    autoPlay
                    muted
                    playsInline
                  />
                </div>
                {/* スキャンキャンセルボタン */}
                <button
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white"
                  onClick={() => {
                    console.log(
                      "【デバッグ】キャンセルボタン → setIsScanning(false)"
                    )
                    setIsScanning(false)
                    setScannedCode("")
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* (10) 手動入力による検索 */}
            <div className="flex gap-2">
              <Input
                placeholder="バーコード番号を入力"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleManualSearch()}
              />
              <Button onClick={handleManualSearch} variant="outline">
                検索
              </Button>
            </div>

            {/* コード表示エリア */}
            <div className="bg-gray-100 p-3 rounded text-center">
              <div className="text-sm text-gray-600">コード表示エリア</div>
              <div className="font-mono text-lg">
                {scannedCode || "バーコードをスキャンしてください"}
              </div>
            </div>

            {/* 商品情報表示エリア */}
            {currentProduct ? (
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="text-sm text-gray-600">名称表示エリア</div>
                  <div className="font-semibold text-lg">
                    {currentProduct.name}
                  </div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="text-sm text-gray-600">単価表示エリア</div>
                  <div className="font-semibold text-lg">
                    {currentProduct.price}円
                  </div>
                </div>
                <Button
                  onClick={addToCart}
                  className="w-full h-12 text-lg bg-green-500 hover:bg-green-600"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  追加
                </Button>
              </div>
            ) : scannedCode && !isScanning ? (
              <Alert variant="warning">
                <AlertDescription>
                  商品が見つかりませんでした。コードを確認してください。
                </AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        {/* 購入リスト */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              購入リスト
              {cart.length > 0 && (
                <Badge variant="secondary">{cart.length}件</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                商品がありません
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.prd_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        x{item.quantity} {item.price}円 = {item.total}円
                      </div>
                    </div>
                    <Button
                      onClick={() => removeFromCart(item.prd_id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span>小計:</span>
                    <span>{subtotal}円</span>
                  </div>
                  <div className="flex justify-between">
                    <span>消費税(10%):</span>
                    <span>{tax}円</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>合計:</span>
                    <span>{total}円</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 購入ボタン */}
        {cart.length > 0 && (
          <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
            <DialogTrigger asChild>
              <Button className="w-full h-16 text-xl bg-red-500 hover:bg-red-600">
                購入
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>購入確認</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">合計金額</div>
                  <div className="text-3xl font-bold text-red-600">
                    {total}円
                  </div>
                  <div className="text-sm text-gray-600">(税込 {tax}円)</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowCheckout(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={completePurchase}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    OK
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
