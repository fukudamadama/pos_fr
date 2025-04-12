// "use client";
// import React, { useState } from "react";
// import { Button } from "@/app/components/button";
// import { Input } from "@/app/components/input";
// import { Label } from "@/app/components/label";
// import { Checkbox } from "@/app/components/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/app/components/radio-group";
// import Link from "next/link";

// export default function HairTextureForm() {
//   const [form, setForm] = useState({
//     nickname: "",
//     age: "",
//     gender: "",
//     density: "",
//     hair_loss: "",
//     scalp: [],
//     thickness: "",
//     texture: [],
//     firmness: "",
//   });

//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleCheckboxChange = (field, value) => {
//     setForm((prev) => {
//       const updated = prev[field].includes(value)
//         ? prev[field].filter((v) => v !== value)
//         : [...prev[field], value];
//       return { ...prev, [field]: updated };
//     });
//   };

//   const isFormValid =
//     form.nickname &&
//     form.age &&
//     form.gender &&
//     form.density &&
//     form.hair_loss &&
//     form.scalp.length > 0 &&
//     form.thickness &&
//     form.texture.length > 0 &&
//     form.firmness;

//     const handleSubmit = async () => {
//       try {
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hairQuality`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             ...form,
//             age: Number(form.age),
//           }),
//         });
  
//         if (!response.ok) throw new Error("送信失敗");
  
//         const result = await response.json();
//         console.log("送信成功:", result);
//         alert("送信が完了しました！");
//       } catch (err) {
//         console.error("送信エラー:", err);
//         alert("送信に失敗しました");
//       }
//     };
  
//   return (
//     <div className="max-w-md mx-auto p-4 space-y-6">
//       <h1 className="text-2xl font-bold">髪の質感診断</h1>
//       <p className="text-gray-600">美容師さんからみたお客様の髪の質感</p>

//       <div className="space-y-4">
//         <Label htmlFor="nickname" className="block mb-1">お客様のお名前</Label>
//         <Input id="nickname" placeholder="お客様のお名前" value={form.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
//       </div>

//       <div className="space-y-4">
//         <Label htmlFor="age" className="block mb-1">年齢</Label>
//         <select id="age" className="w-full border rounded px-3 py-2" onChange={(e) => handleChange("age", e.target.value)} value={form.age}>
//           <option value="">年齢を選択</option>
//           {[...Array(53)].map((_, i) => (
//             <option key={i} value={i + 18}>{i + 18}歳</option>
//           ))}
//         </select>
//       </div>

//       <div className="space-y-4">
//         <Label className="block mb-1">性別</Label>
//         <RadioGroup 
//           value={form.gender}
//           onValueChange={(value) => handleChange("gender", value)}
//           className="flex gap-4"
//           >
//           {['男性','女性'].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <RadioGroupItem value={option} id={`gender-${option}`} />
//               <Label htmlFor={`gender-${option}`}>{option}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       <div className="space-y-4">
//         <Label htmlFor="density" className="block mb-1">髪の密度</Label>
//         <select id="density" className="w-full border rounded px-3 py-2" onChange={(e) => handleChange("density", e.target.value)} value={form.density}>
//           <option value="">密度を選択</option>
//           {['とても多い','多い','普通','少ない','部分的に少ない','とても少ない'].map(option => (
//             <option key={option} value={option}>{option}</option>
//           ))}
//         </select>
//       </div>

//       <div className="space-y-4">
//         <Label className="block mb-1">抜け毛の状態</Label>
//         <RadioGroup 
//           value={form.hair_loss}
//           onValueChange={(value) => handleChange("hair_loss", value)}
//           className="flex gap-4"
//           >
//           {['とてもある','少しある','ない'].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <RadioGroupItem value={option} id={`hair_loss-${option}`} />
//               <Label htmlFor={`hair_loss-${option}`}>{option}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       <div className="space-y-4">
//         <Label htmlFor="scalp" className="block mb-1">頭皮の状態</Label>
//         <div className="flex flex-wrap gap-2">
//           {["健康","赤み","脂っぽい","乾燥","硬い"].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <Checkbox id={option} checked={form.scalp.includes(option)} onCheckedChange={() => handleCheckboxChange("scalp", option)} />
//               <Label htmlFor={option}>{option}</Label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Label className="block mb-1">髪の太さ</Label>
//         <RadioGroup 
//           value={form.thickness}
//           onValueChange={(value) => handleChange("thickness", value)}
//           className="flex gap-4"
//           >
//           {['太い','普通','細い'].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <RadioGroupItem value={option} id={`thickness-${option}`} />
//               <Label htmlFor={`thickness-${option}`}>{option}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       <div className="space-y-4">
//         <Label htmlFor="texture" className="block mb-1">髪質</Label>
//         <div className="flex flex-wrap gap-2">
//           {["剛毛","直毛","猫っけ","捻転毛", "うねり"].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <Checkbox id={option} checked={form.texture.includes(option)} onCheckedChange={() => handleCheckboxChange("texture", option)} />
//               <Label htmlFor={option}>{option}</Label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="space-y-4">
//         <Label className="block mb-1">髪のハリ・コシ</Label>
//         <RadioGroup 
//           value={form.firmness}
//           onValueChange={(value) => handleChange("firmness", value)}
//           className="flex gap-4"
//           >
//           {['とてもある','少しある','ない'].map(option => (
//             <div key={option} className="flex items-center space-x-2">
//               <RadioGroupItem value={option} id={`firmness-${option}`} />
//               <Label htmlFor={`firmness-${option}`}>{option}</Label>
//             </div>
//           ))}
//         </RadioGroup>
//       </div>

//       <Button className="w-full" disabled={!isFormValid} onClick={handleSubmit}>
//         次へ
//       </Button>
//     </div>
//   );
// }

// 20250411デザイン追加
"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Label } from "../../components/label"; //backend直したら消す
import { Input } from "../../components/input"; //backend直したら消す
import { RadioGroup, RadioGroupItem } from "../../components/radio-group"; //backend直したら消す


export default function HairQuality() {
  const [form, setForm] = useState({
    nickname: "",
    age: "",
    gender: "",
    density: "",
    hair_loss: "",
    scalp: [],
    thickness: "",
    texture: [],
    firmness: "",
  })

  const [openDropdown, setOpenDropdown] = useState("")

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value })
    setOpenDropdown("")
  }

  const handleCheckboxChange = (field, value) => {
    setForm((prev) => {
      const updated = prev[field].includes(value) ? prev[field].filter((v) => v !== value) : [...prev[field], value]
      return { ...prev, [field]: updated }
    })
  }

  const toggleDropdown = (field) => {
    setOpenDropdown(openDropdown === field ? "" : field)
  }

  const isFormValid =
    form.nickname &&
    form.age &&
    form.gender &&
    form.density &&
    form.hair_loss &&
    form.scalp.length > 0 &&
    form.thickness &&
    form.texture.length > 0 &&
    form.firmness

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hairQuality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
        }),
      })

      if (!response.ok) throw new Error("送信失敗")

      const result = await response.json()
      console.log("送信成功:", result)
      // 送信成功後、指定されたURLに遷移
      window.location.href =
        "https://app-002-step3-2-node-oshima2.azurewebsites.net/kamokamo/hairQuality/hairQuestionYou"
    } catch (err) {
      console.error("送信エラー:", err)
      alert("送信に失敗しました")
    }
  }

  // 各フィールドのオプション
  const options = {
    density: ["とても多い", "多い", "普通", "少ない", "部分的に少ない", "とても少ない"],
    hair_loss: ["とてもある", "少しある", "ない"],
    scalp: ["健康", "赤み", "脂っぽい", "乾燥", "硬い"],
    thickness: ["太い", "普通", "細い"],
    texture: ["剛毛", "直毛", "猫っけ", "捻転毛", "うねり"],
    firmness: ["とてもある", "少しある", "ない"],
  }

  // ステッププログレスバー
  const steps = [
    { name: "髪の質感", active: true },
    { name: "かもかも問診", active: false },
    { name: "画像診断", active: false },
    { name: "AI診断", active: false },
    { name: "アカウント登録", active: false },
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
          髪の質感診断 <span className="ml-2">✂️</span>
        </h1>
        <p className="text-sm text-gray-600">美容師さんから見たお客様の髪の質感</p>
      </div>

      {/* フォーム - フレックスグロウで下部にボタンを固定 */}
      <div className="space-y-4 flex-grow">
        {/* backend直したらここから消す */}
        <div>
        <Label htmlFor="nickname" className="block mb-1">お客様のお名前</Label>
         <Input id="nickname" placeholder="お客様のお名前" value={form.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
         </div>

         <div>
         <Label htmlFor="age" className="block mb-1">年齢</Label>
         <select id="age" className="w-full border rounded px-3 py-2" onChange={(e) => handleChange("age", e.target.value)} value={form.age}>
           <option value="">年齢を選択</option>
            {[...Array(53)].map((_, i) => (
             <option key={i} value={i + 18}>{i + 18}歳</option>
           ))}
         </select>
         </div>


         <div>
         <Label className="block mb-1">性別</Label>
         <RadioGroup 
           value={form.gender}
           onValueChange={(value) => handleChange("gender", value)}
           className="flex gap-4"
           >
           {['男性','女性'].map(option => (
             <div key={option} className="flex items-center space-x-2">
               <RadioGroupItem value={option} id={`gender-${option}`} />
               <Label htmlFor={`gender-${option}`}>{option}</Label>
             </div>
           ))}
         </RadioGroup>
         </div>
         {/* backend直したらここまで消す */}

        {/* 髪の密度 */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">髪の密度</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("density")}
            >
              <span className={`${form.density ? "text-black" : "text-gray-400"} text-sm`}>
                {form.density || "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "density" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {options.density.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleChange("density", option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 抜け毛の状態 */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">抜け毛の状態</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("hair_loss")}
            >
              <span className={`${form.hair_loss ? "text-black" : "text-gray-400"} text-sm`}>
                {form.hair_loss || "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "hair_loss" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {options.hair_loss.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleChange("hair_loss", option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 頭皮の状態 */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">頭皮の状態</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("scalp")}
            >
              <span className={`${form.scalp.length > 0 ? "text-black" : "text-gray-400"} text-sm`}>
                {form.scalp.length > 0 ? form.scalp.join(", ") : "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "scalp" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-2">
                {options.scalp.map((option) => (
                  <div key={option} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`scalp-${option}`}
                      checked={form.scalp.includes(option)}
                      onChange={() => handleCheckboxChange("scalp", option)}
                      className="h-3.5 w-3.5"
                    />
                    <label htmlFor={`scalp-${option}`} className="ml-2 cursor-pointer text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 髪の太さ */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">髪の太さ</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("thickness")}
            >
              <span className={`${form.thickness ? "text-black" : "text-gray-400"} text-sm`}>
                {form.thickness || "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "thickness" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {options.thickness.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleChange("thickness", option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 髪のハリ・コシ */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">髪のハリ・コシ</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("firmness")}
            >
              <span className={`${form.firmness ? "text-black" : "text-gray-400"} text-sm`}>
                {form.firmness || "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "firmness" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                {options.firmness.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleChange("firmness", option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 髪質 */}
        <div>
          <label className="block mb-1 text-gray-600 text-sm">髪質</label>
          <div className="relative">
            <div
              className="w-full p-3 bg-gray-50 rounded-md flex justify-between items-center cursor-pointer border border-gray-200"
              onClick={() => toggleDropdown("texture")}
            >
              <span className={`${form.texture.length > 0 ? "text-black" : "text-gray-400"} text-sm`}>
                {form.texture.length > 0 ? form.texture.join(", ") : "選択してください"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {openDropdown === "texture" && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-2">
                {options.texture.map((option) => (
                  <div key={option} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      id={`texture-${option}`}
                      checked={form.texture.includes(option)}
                      onChange={() => handleCheckboxChange("texture", option)}
                      className="h-3.5 w-3.5"
                    />
                    <label htmlFor={`texture-${option}`} className="ml-2 cursor-pointer text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 送信ボタン - 下部に固定 */}
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
