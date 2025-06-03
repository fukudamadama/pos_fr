"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Plus, ShoppingCart, Trash2, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function POSApp() {
  const [scannedCode, setScannedCode] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // バックエンドのベース URL (環境変数から取得)
  const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT || "";

  // ─── 1) バックエンドから商品を取得する関数 ───
  const fetchProduct = async (code) => {
    try {
      const res = await fetch(`${API_BASE}/products/${encodeURIComponent(code)}`);
      if (res.ok) {
        const data = await res.json();
        return {
          prd_id: data.prd_id,
          code: data.code,
          name: data.name,
          price: data.price,
        };
      } else if (res.status === 404) {
        return null;
      } else {
        console.error("予期しないエラー:", res.status);
        return null;
      }
    } catch (err) {
      console.error("バックエンド呼び出しエラー:", err);
      return null;
    }
  };

  // ─── 2) 商品検索 ───
  const searchProduct = async (code) => {
    if (!code.trim()) return;
    setErrorMessage("");
    setCurrentProduct(null);
    setScannedCode(code);

    const product = await fetchProduct(code.trim());
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct(null);
      setErrorMessage("商品が見つかりませんでした。コードを確認してください。");
    }
  };

  // ─── 3) カートに商品追加 ───
  const addToCart = () => {
    if (!currentProduct) return;

    const existingItem = cart.find((item) => item.prd_id === currentProduct.prd_id);

    if (existingItem) {
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
      );
    } else {
      setCart([
        ...cart,
        {
          ...currentProduct,
          quantity: 1,
          total: currentProduct.price,
        },
      ]);
    }

    // リセット
    setCurrentProduct(null);
    setScannedCode("");
    setManualCode("");
    setErrorMessage("");
  };

  // ─── 4) カートから商品削除 ───
  const removeFromCart = (prd_id) => {
    setCart(cart.filter((item) => item.prd_id !== prd_id));
  };

  // ─── 5) 合計計算 ───
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = Math.floor(subtotal * 0.1);
  const total = subtotal + tax;

  // ─── 6) カメラスキャンシミュレーション ───
  const simulateBarcodeScan = () => {
    setIsScanning(true);
    setErrorMessage("");
    // ランダムな商品コードを生成（実際のアプリではカメラAPIを使用）
    setTimeout(async () => {
      // ここだけは既知のダミーデータを使う／もしくは user が事前に productDatabase をダウンロードしておく
      // 本番ではカメラから読み取ったバーコードを code にセットする
      const dummyCodes = ["4901681562916", "4901681562923", "4901681562930"];
      const randomCode = dummyCodes[Math.floor(Math.random() * dummyCodes.length)];
      await searchProduct(randomCode);
      setIsScanning(false);
    }, 1500);
  };

  // ─── 7) 手動コード入力 ───
  const handleManualSearch = async () => {
    if (manualCode.trim()) {
      await searchProduct(manualCode.trim());
    }
  };

  // ─── 8) 購入完了時：バックエンドに保存 ───
  const completePurchase = async () => {
    setErrorMessage("");

    // まずは取引ヘッダを作成する
    try {
      const headerPayload = {
        emp_cd: "E000000001",     // 固定値 or ログインユーザーの社員コード
        store_cd: "S001",         // 固定または選択された店舗コード
        pos_no: "001",            // 固定 or 選択されたPOS機番
        total_amt: total,
        ttl_amt_ex_tax: subtotal,
      };
      const resHeader = await fetch(`${API_BASE}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headerPayload),
      });
      if (!resHeader.ok) {
        throw new Error(`取引ヘッダ作成エラー: ${resHeader.status}`);
      }
      const headerData = await resHeader.json();
      const trd_id = headerData.trd_id;

      // つぎに、カート内の各商品を明細テーブルに登録する
      for (const item of cart) {
        const detailPayload = {
          trd_id: trd_id,
          prd_id: item.prd_id,
          prd_code: item.code,
          prd_name: item.name,
          prd_price: item.price,
          tax_cd: "10", // 固定で10%とする例
        };
        const resDetail = await fetch(`${API_BASE}/transactions/${trd_id}/details/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(detailPayload),
        });
        if (!resDetail.ok) {
          throw new Error(`明細登録エラー (prd_id: ${item.prd_id}): ${resDetail.status}`);
        }
      }

      // 最終的に購入完了ポップアップを表示
      setCart([]);
      setShowCheckout(false);
      alert(`購入が完了しました！\n合計 (税込): ${total}円\n税抜: ${subtotal}円`);
    } catch (err) {
      console.error(err);
      setErrorMessage("購入処理中にエラーが発生しました。再度お試しください。");
      setShowCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold text-blue-600">モバイルPOSアプリ</CardTitle>
          </CardHeader>
        </Card>

        {/* エラー表示 */}
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

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
            ) : scannedCode && !isScanning ? (
              <Alert variant="warning">
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
                  <div key={item.prd_id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        x{item.quantity} {item.price}円 = {item.total}円
                      </div>
                    </div>
                    <Button onClick={() => removeFromCart(item.prd_id)} variant="outline" size="sm">
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
  );
}
