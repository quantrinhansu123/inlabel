"use client";

import React, { useState } from "react";
import { X, Box, Plus, Sparkles, Check, AlertCircle } from "lucide-react";
import { Product, ProductCategory } from "@/types";

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (product: Product) => void;
}

const CATEGORIES: ProductCategory[] = [
  "Ấn phẩm quảng cáo",
  "Ấn phẩm văn phòng",
  "Bao bì & Hộp giấy",
  "Tem nhãn & Decal",
  "Ấn phẩm sự kiện",
];

const FINISHING_OPTIONS = [
  "Cán màng mờ",
  "Cán màng bóng",
  "Ép kim nhũ vàng/bạc",
  "Phủ UV định hình",
  "Bế khuôn dập nếp định hình",
  "Bấm ghim lồng giữa",
  "Đóng gáy keo nhiệt",
  "Gáy lò xo kép",
  "Bo 4 góc tròn",
  "Đục lỗ xỏ dây",
  "Khay định hình bồi nhung",
  "Băng keo dán sẵn nắp",
];

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onCreateProduct,
}) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Ấn phẩm quảng cáo");
  const [standardDimensions, setStandardDimensions] = useState("210 x 297 mm (A4)");
  const [defaultPaper, setDefaultPaper] = useState("Couche 300gsm cán màng mờ");
  const [printMethod, setPrintMethod] = useState<
    "In offset 4 màu" | "In nhanh kỹ thuật số" | "In offset hoặc KTS"
  >("In offset 4 màu");
  const [unit, setUnit] = useState("Cuốn");
  const [basePrice, setBasePrice] = useState(15000);
  const [minOrderQty, setMinOrderQty] = useState(100);
  const [productionLeadTime, setProductionLeadTime] = useState("2 - 3 ngày");
  const [selectedFinishings, setSelectedFinishings] = useState<string[]>([
    "Cán màng mờ",
  ]);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("Tiêu chuẩn, Mới");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleFinishing = (item: string) => {
    setSelectedFinishings((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Vui lòng nhập tên sản phẩm in ấn.");
      return;
    }
    const finalCode =
      code.trim() ||
      `SP-${category.substring(0, 3).toUpperCase()}-${Math.floor(
        100 + Math.random() * 900
      )}`;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newProduct: Product = {
      id: `PROD-${Date.now()}`,
      code: finalCode,
      name: name.trim(),
      category,
      standardDimensions: standardDimensions.trim(),
      defaultPaper: defaultPaper.trim(),
      printMethod,
      recommendedFinishing: selectedFinishings,
      unit: unit.trim() || "Cái",
      basePrice: Number(basePrice) || 0,
      minOrderQty: Number(minOrderQty) || 1,
      productionLeadTime: productionLeadTime.trim() || "2 - 3 ngày",
      status: "ACTIVE",
      description:
        description.trim() ||
        `Sản phẩm ${name} quy cách in tiêu chuẩn phục vụ nhu cầu doanh nghiệp.`,
      tags: tags.length > 0 ? tags : ["Mới tạo"],
      totalOrdersCount: 0,
      colorAccent: "from-indigo-500 to-violet-600",
    };

    onCreateProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">
                Thêm Sản Phẩm In Ấn Mới
              </h3>
              <p className="text-[11px] text-slate-300">
                Thiết lập thông số kỹ thuật tiêu chuẩn vào danh mục catalogue Fsolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Tên & Mã SP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="font-bold text-slate-700">
                Tên sản phẩm in ấn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="VD: Catalogue Bìa Cứng Cao Cấp Khổ A4..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Mã SKU (tự sinh nếu trống)</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: SP-CAT-02"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono text-slate-800 uppercase"
              />
            </div>
          </div>

          {/* Row 2: Danh mục & Công nghệ in */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Nhóm danh mục ấn phẩm</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Công nghệ in ấn đề xuất</label>
              <select
                value={printMethod}
                onChange={(e) =>
                  setPrintMethod(
                    e.target.value as
                      | "In offset 4 màu"
                      | "In nhanh kỹ thuật số"
                      | "In offset hoặc KTS"
                  )
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"
              >
                <option value="In offset 4 màu">In offset 4 màu (Số lượng lớn)</option>
                <option value="In nhanh kỹ thuật số">In nhanh kỹ thuật số (Lấy ngay)</option>
                <option value="In offset hoặc KTS">In offset hoặc KTS linh hoạt</option>
              </select>
            </div>
          </div>

          {/* Row 3: Kích thước & Loại giấy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Kích thước tiêu chuẩn</label>
              <input
                type="text"
                value={standardDimensions}
                onChange={(e) => setStandardDimensions(e.target.value)}
                placeholder="VD: 210 x 297 mm, 90 x 54 mm..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Chất liệu giấy mặc định</label>
              <input
                type="text"
                value={defaultPaper}
                onChange={(e) => setDefaultPaper(e.target.value)}
                placeholder="VD: Couche 300gsm cán màng mờ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Row 4: Đơn vị tính, Đơn giá cơ sở, MOQ, Thời gian sản xuất */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Đơn vị tính</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Cuốn, Cái, Hộp..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Đơn giá cơ sở (đ)</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                min={0}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">SL tối thiểu (MOQ)</label>
              <input
                type="number"
                value={minOrderQty}
                onChange={(e) => setMinOrderQty(Number(e.target.value))}
                min={1}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Thời gian giao</label>
              <input
                type="text"
                value={productionLeadTime}
                onChange={(e) => setProductionLeadTime(e.target.value)}
                placeholder="24h, 2-3 ngày..."
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Quy cách gia công hoàn thiện (Checkboxes) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Quy cách gia công sau in</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FINISHING_OPTIONS.map((f) => {
                const checked = selectedFinishings.includes(f);
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => toggleFinishing(f)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium text-left transition ${
                      checked
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                        checked
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="truncate">{f}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags & Mô tả */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Thẻ tag phân loại (ngăn cách bởi dấu phẩy)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Bán chạy, In nhanh 24h, Cao cấp..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Mô tả đặc điểm & ứng dụng ấn phẩm</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả công năng, lưu ý chế bản hoặc thiết kế cho khách hàng..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Lưu Vào Danh Mục</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
