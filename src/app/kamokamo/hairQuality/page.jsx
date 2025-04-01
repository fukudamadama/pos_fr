"use client";
import React, { useState } from "react";
import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/label";
import { Checkbox } from "@/app/components/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/components/radio-group";
import Link from "next/link";

export default function HairTextureForm() {
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
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    setForm((prev) => {
      const updated = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: updated };
    });
  };

  const isFormValid =
    form.nickname &&
    form.age &&
    form.gender &&
    form.density &&
    form.hair_loss &&
    form.scalp.length > 0 &&
    form.thickness &&
    form.texture.length > 0 &&
    form.firmness;

    const handleSubmit = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hairQuality`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            age: Number(form.age),
          }),
        });
  
        if (!response.ok) throw new Error("送信失敗");
  
        const result = await response.json();
        console.log("送信成功:", result);
        alert("送信が完了しました！");
      } catch (err) {
        console.error("送信エラー:", err);
        alert("送信に失敗しました");
      }
    };
  
  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">髪の質感診断</h1>
      <p className="text-gray-600">美容師さんからみたお客様の髪の質感</p>

      <div className="space-y-4">
        <Label htmlFor="nickname" className="block mb-1">お客様のお名前</Label>
        <Input id="nickname" placeholder="お客様のお名前" value={form.nickname} onChange={(e) => handleChange("nickname", e.target.value)} />
      </div>

      <div className="space-y-4">
        <Label htmlFor="age" className="block mb-1">年齢</Label>
        <select id="age" className="w-full border rounded px-3 py-2" onChange={(e) => handleChange("age", e.target.value)} value={form.age}>
          <option value="">年齢を選択</option>
          {[...Array(53)].map((_, i) => (
            <option key={i} value={i + 18}>{i + 18}歳</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
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

      <div className="space-y-4">
        <Label htmlFor="density" className="block mb-1">髪の密度</Label>
        <select id="density" className="w-full border rounded px-3 py-2" onChange={(e) => handleChange("density", e.target.value)} value={form.density}>
          <option value="">密度を選択</option>
          {['とても多い','多い','普通','少ない','部分的に少ない','とても少ない'].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <Label className="block mb-1">抜け毛の状態</Label>
        <RadioGroup 
          value={form.hair_loss}
          onValueChange={(value) => handleChange("hair_loss", value)}
          className="flex gap-4"
          >
          {['とてもある','少しある','ない'].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`hair_loss-${option}`} />
              <Label htmlFor={`hair_loss-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label htmlFor="scalp" className="block mb-1">頭皮の状態</Label>
        <div className="flex flex-wrap gap-2">
          {["健康","赤み","脂っぽい","乾燥","硬い"].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={option} checked={form.scalp.includes(option)} onCheckedChange={() => handleCheckboxChange("scalp", option)} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="block mb-1">髪の太さ</Label>
        <RadioGroup 
          value={form.thickness}
          onValueChange={(value) => handleChange("thickness", value)}
          className="flex gap-4"
          >
          {['太い','普通','細い'].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`thickness-${option}`} />
              <Label htmlFor={`thickness-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label htmlFor="texture" className="block mb-1">髪質</Label>
        <div className="flex flex-wrap gap-2">
          {["剛毛","直毛","猫っけ","捻転毛", "うねり"].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={option} checked={form.texture.includes(option)} onCheckedChange={() => handleCheckboxChange("texture", option)} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="block mb-1">髪のハリ・コシ</Label>
        <RadioGroup 
          value={form.firmness}
          onValueChange={(value) => handleChange("firmness", value)}
          className="flex gap-4"
          >
          {['とてもある','少しある','ない'].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`firmness-${option}`} />
              <Label htmlFor={`firmness-${option}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button className="w-full" disabled={!isFormValid} onClick={handleSubmit}>
        次へ
      </Button>
    </div>
  );
}