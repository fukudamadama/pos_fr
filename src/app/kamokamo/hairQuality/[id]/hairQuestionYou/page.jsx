"use client"
import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronDown } from "lucide-react"

export default function HairQuestionYou() {
  const params = useParams()
  const hairQualityId = params?.id // Next.js App Router の場合
  const router = useRouter()
  const [form, setForm] = useState({
    nickname: "",
    age: "",
    gender: "",
    bloodtype: "",
    occupation: "",
    familyhage: "",
    eatinghabits: "",
    sleep: "",
    stress: "",
    undo: "",
    drink: "",
    smoke: "",
    usugemotivation: "",
    usugeexperience: "",
    futureaga: "",
    sindan: ""
  })
  
  const [isFormValid, setIsFormValid] = useState(false)

  // フォームの値が変更されるたびにバリデーションチェック
  useEffect(() => {
    const valid = Object.values(form).every((v) => v !== "")
    setIsFormValid(valid)
  }, [form])

  const handleChange = (field, value) => {
    console.log(`Updating field: ${field} with value: ${value}`)
    setForm(prevState => ({
      ...prevState,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!hairQualityId) {
        console.error("hairQualityIdが指定されていません");
        alert("hairQualityIdが設定されていません。");
        return;
      }
  
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}/kamokamo/hairQuality/${hairQualityId}/hairQuestionYou`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age: Number(form.age),
        }),
      });
  
      if (!response.ok) {
        console.error("サーバーエラー:", response.statusText);
        throw new Error("送信に失敗しました");
      }
  
      const result = await response.json();
      console.log("送信成功:", result);

      // hairQualityId付きで次のステップへ
      router.push(`/kamokamo/hairQuality/${hairQualityId}/hairQuestionYou/diagnostic-imaging`);
    } catch (err) {
      console.error("送信エラー:", err.message);
      alert(`送信に失敗しました: ${err.message}`);
    }
  }

  const steps = [
    { name: "髪の質感", active: true },
    { name: "かもかも問診", active: true },
    { name: "画像診断", active: false },
    { name: "AI診断", active: false },
  ]

  const selectFields = [
    { id: "age", label: "年齢", options: [...Array(53)].map((_, i) => i + 18) },
    { id: "gender", label: "性別", options: ["男性", "女性", "その他"] },
    { id: "bloodtype", label: "血液型", options: ["A型", "B型", "O型", "AB型", "その他", "わからない"] },
    { id: "occupation", label: "ご職業", options: ["会社員", "公務員", "自営業", "フリーランス", "学生", "主婦/主夫", "パート・アルバイト", "専門職（医師、弁護士、技術者など）", "農業・漁業", "教育関係者", "アーティスト／クリエイター", "無職"] },
    { id: "familyhage", label: "ご家族に薄毛の人はいますか？（二親等以内）", options: ["複数人いる", "一人いる", "いない"] },
    { id: "eatinghabits", label: "食生活", options: ["健康的でバランスの取れた食事を心がけている", "外食やテイクアウトが中心", "食事の時間や内容が不規則", "ファストフードや加工食品をよく食べる", "食事をあまり気にしていない"] },
    { id: "sleep", label: "睡眠習慣", options: ["毎晩規則的に寝ている（7〜8時間）", "規則的だが、睡眠時間が短い（5〜6時間）", "不規則だが十分な睡眠を取れている", "不規則で睡眠不足（5時間未満）", "昼夜逆転している", "眠れないことが多い（睡眠障害）", "よくわからない／意識していない"] },
    { id: "stress", label: "日常的なストレス", options: ["とてもある", "少しある", "あまりない", "まったくない", "わからない"] },
    { id: "undo", label: "日常的な運動習慣", options: ["週に4回以上", "週に2～3回程度", "週に1回以下", "まったくない"] },
    { id: "drink", label: "日常的な飲酒習慣", options: ["週に4回以上", "週に2～3回程度", "週に1回以下", "まったくない"] },
    { id: "smoke", label: "日常的な喫煙習慣", options: ["1日2箱以上", "1日1箱", "たまに吸う", "まったく吸わない"] },
    { id: "usugemotivation", label: "現在薄毛を気にしているか", options: ["すごく気にしている", "少し気にしている", "あまり気にしていない", "まったく気にしていない"] },
    { id: "usugeexperience", label: "薄毛対策のご経験", options: ["取り組んだことがある", "取り組んだことはない", "覚えていない"] },
    { id: "futureaga", label: "将来的にAGA治療を考えているか", options: ["真剣に考えている", "少し考えている", "あまり考えていない", "まったく考えていない"] },
    { id: "sindan", label: "診断結果をどのように伝えてほしいですか？", options: ["はっきりと伝えてほしい", "やわらかく伝えてほしい", "どちらでもよい"] }
  ]

  return (
    <div className="w-full max-w-[390px] mx-auto p-4 pb-8 min-h-[844px] flex flex-col bg-white">
      
      {/* ステッププログレスバー */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className={`h-0.5 flex-1 ${step.active ? "bg-blue-600" : "bg-gray-200"}`}></div>}
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step.active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span className="text-[10px] mt-1">{step.name}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          かもかも問診 <span className="ml-2">📝</span>
        </h1>
        <p className="text-sm text-gray-600">あなたの生活習慣などを教えてください</p>
      </div>

      {/* 入力フォーム */}
      <div className="space-y-4 flex-grow">
        {/* 名前入力 */}
        <div>
          <label htmlFor="nickname" className="block mb-1 text-gray-600 text-sm">お客様のお名前</label>
          <input
            type="text"
            id="nickname"
            className="w-full p-3 bg-gray-50 rounded-md border border-gray-200 text-sm"
            placeholder="お客様のお名前"
            value={form.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
          />
        </div>

        {/* プルダウン入力 */}
        {selectFields.map(({ id, label, options }) => (
          <div key={id}>
            <label htmlFor={id} className="block mb-1 text-gray-600 text-sm">{label}</label>
            <select
              id={id}
              className="w-full p-3 bg-gray-50 rounded-md border border-gray-200 text-sm"
              value={form[id]}
              onChange={(e) => handleChange(id, e.target.value)}
            >
              <option value="">未選択</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* 送信ボタン */}
      <div className="mt-auto pt-4">
        <button
          className={`w-full py-3 bg-blue-600 text-white rounded-md shadow-md text-sm ${
            !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          次へ
        </button>
      </div>
    </div>
  )
}