"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Camera, Plus, ShoppingCart, Trash2, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// サンプル商品データベース
const productDatabase = [
  { id: "1", code: "12345678901", name: "おーいお茶", price: 150 },
  { id: "2", code: "12345678902", name: "ソフラン", price: 300 },
  { id: "3", code: "12345678903", name: "福島産ほうれん草", price: 188 },
  { id: "4", code: "12345678904", name: "タイガー歯ブラシ青", price: 200 },
  { id: "5", code: "12345678905", name: "四ツ谷サイダー", price: 160 },
]

export default function POSApp() {
  const [scannedCode, setScannedCode] = useState("")
  const [currentProduct, setCurrentProduct] = useState(null)
  const [cart, setCart] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [manualCode, setManualCode] = useState("")

  // 商品検索
  const searchProduct = (code) => {
    const product = productDatabase.find((p) => p.code === code)
    if (product) {
      setCurrentProduct(product)
      setScannedCode(code)
    } else {
      setCurrentProduct(null)
      setScannedCode(code)
    }
  }

  // カートに商品追加
  const addToCart = () => {
    if (!currentProduct) return

    const existingItem = cart.find((item) => item.id === currentProduct.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === currentProduct.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
            : item,
        ),
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
  }

  // カートから商品削除
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  // 合計計算
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const tax = Math.floor(subtotal * 0.1)
  const total = subtotal + tax

  // カメラスキャンシミュレーション
  const simulateBarcodeScan = () => {
    setIsScanning(true)
    // ランダムな商品コードを生成（実際のアプリではカメラAPIを使用）
    setTimeout(() => {
      const randomProduct = productDatabase[Math.floor(Math.random() * productDatabase.length)]
      searchProduct(randomProduct.code)
      setIsScanning(false)
    }, 2000)
  }

  // 手動コード入力
  const handleManualSearch = () => {
    if (manualCode.trim()) {
      searchProduct(manualCode.trim())
    }
  }

  // 購入完了
  const completePurchase = () => {
    // 実際のアプリではここでデータベースに保存
    console.log("購入完了:", { cart, subtotal, tax, total })
    setCart([])
    setShowCheckout(false)
    alert("購入が完了しました！")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-blue-600">モバイルPOSアプリ</CardTitle>
          </CardHeader>
        </Card>

        {/* スキャンエリア */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Button
              onClick={simulateBarcodeScan}
              disabled={isScanning}
              className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600"
            >
              <Camera className="mr-2 h-6 w-6" />
              {isScanning ? "スキャン中..." : "スキャン（カメラ）"}
            </Button>

            {/* 手動入力 */}
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
              <div className="font-mono text-lg">{scannedCode || "バーコードをスキャンしてください"}</div>
            </div>

            {/* 商品情報表示 */}
            {currentProduct ? (
              <div className="space-y-2">
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="text-sm text-gray-600">名称表示エリア</div>
                  <div className="font-semibold text-lg">{currentProduct.name}</div>
                </div>
                <div className="bg-gray-100 p-3 rounded text-center">
                  <div className="text-sm text-gray-600">単価表示エリア</div>
                  <div className="font-semibold text-lg">{currentProduct.price}円</div>
                </div>
                <Button onClick={addToCart} className="w-full h-12 text-lg bg-green-500 hover:bg-green-600">
                  <Plus className="mr-2 h-5 w-5" />
                  追加
                </Button>
              </div>
            ) : scannedCode ? (
              <Alert>
                <AlertDescription>商品が見つかりませんでした。コードを確認してください。</AlertDescription>
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
              {cart.length > 0 && <Badge variant="secondary">{cart.length}件</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">商品がありません</div>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        x{item.quantity} {item.price}円 = {item.total}円
                      </div>
                    </div>
                    <Button onClick={() => removeFromCart(item.id)} variant="outline" size="sm">
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
              <Button className="w-full h-16 text-xl bg-red-500 hover:bg-red-600">購入</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>購入確認</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">合計金額</div>
                  <div className="text-3xl font-bold text-red-600">{total}円</div>
                  <div className="text-sm text-gray-600">(税込 {tax}円)</div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowCheckout(false)} variant="outline" className="flex-1">
                    キャンセル
                  </Button>
                  <Button onClick={completePurchase} className="flex-1 bg-green-500 hover:bg-green-600">
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
