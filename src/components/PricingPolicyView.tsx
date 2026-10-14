"use client";

import React, { useState, useMemo } from "react";
import {
  Tag,
  Search,
  Filter,
  Plus,
  Calculator,
  Printer,
  Sparkles,
  Layers,
  Scissors,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info,
} from "lucide-react";
import { PricingCategoryItem } from "@/types";

interface PricingPolicyViewProps {
  pricingItems: PricingCategoryItem[];
  onOpenCreateQuotation?: () => void;
}

export const PricingPolicyView: React.FC<PricingPolicyViewProps> = ({
  pricingItems,
  onOpenCreateQuotation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    "ALL" | "In nhanh KTS" | "In Offset" | "Giấy in ấn" | "Gia công sau in"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const categories = [
    { id: "ALL", label: "Tất cả chính sách", icon: <Tag className="w-4 h-4" /> },
    { id: "In nhanh KTS", label: "In Nhanh KTS", icon: <Sparkles className="w-4 h-4" /> },
    { id: "In Offset", label: "In Offset Công Nghiệp", icon: <Printer className="w-4 h-4" /> },
    { id: "Giấy in ấn", label: "Giấy & Phôi Liệu", icon: <Layers className="w-4 h-4" /> },
    { id: "Gia công sau in", label: "Gia Công Sau In", icon: <Scissors className="w-4 h-4" /> },
  ] as const;

  const filteredItems = useMemo(() => {
    return pricingItems.filter((item) => {
      const matchCat =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [pricingItems, selectedCategory, searchQuery]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Chính Sách &amp; Bảng Giá Dịch Vụ In Ấn
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bảng giá chuẩn hóa theo bậc số lượng (Tiers) dùng cho phòng Kinh doanh lập báo giá nhanh và tự động tính giá trong hệ thống
          </p>
        </div>

        {onOpenCreateQuotation && (
          <button
            onClick={onOpenCreateQuotation}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            Áp Dụng Tính Báo Giá Mới
          </button>
        )}
      </div>

      {/* Tabs Phân Loại Dịch Vụ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              selectedCategory === cat.id
                ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {cat.id === "ALL"
                ? pricingItems.length
                : pricingItems.filter((i) => i.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Thanh Tìm Kiếm */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên dịch vụ in ấn, công nghệ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>Giá trên chưa bao gồm 8% hoặc 10% thuế GTGT (VAT)</span>
        </div>
      </div>

      {/* Bảng Dữ Liệu Bảng Giá */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Dịch vụ / Hạng mục in</th>
              <th>Phân nhóm</th>
              <th>ĐVT</th>
              <th className="text-right">Bậc 1 (SL Ít)</th>
              <th className="text-right">Bậc 2 (SL Vừa)</th>
              <th className="text-right text-emerald-700">Bậc 3 (SL Lớn)</th>
              <th>Quy cách &amp; Ghi chú áp dụng</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  Không tìm thấy dịch vụ nào phù hợp
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td>
                    <div className="font-bold text-slate-900 text-xs">{item.serviceName}</div>
                  </td>
                  <td>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600 font-medium">{item.unit}</td>
                  <td className="text-right font-mono text-slate-700 text-xs">
                    {formatVND(item.tier1)}
                  </td>
                  <td className="text-right font-mono text-indigo-700 font-semibold text-xs">
                    {formatVND(item.tier2)}
                  </td>
                  <td className="text-right font-mono text-emerald-700 font-bold text-xs bg-emerald-50/40">
                    {formatVND(item.tier3)}
                  </td>
                  <td>
                    <div className="text-[11px] text-slate-500 max-w-xs">{item.notes}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tip Box Chính Sách */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 flex items-start gap-3 text-xs text-indigo-900">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-indigo-950">Chính sách ưu đãi theo cấp bậc khách hàng</div>
          <p className="mt-0.5 text-indigo-800/90 leading-relaxed">
            - Khách hàng doanh nghiệp thân thiết (Top 5 khách hàng VIP) được tự động áp dụng <strong>Bậc 3 (SL Lớn)</strong> bất kể số lượng đặt.
            <br />
            - Đơn hàng xuất kẽm CTP từ 10 bộ trở lên được chiết khấu thêm 5% trực tiếp trên tổng hóa đơn bán hàng.
          </p>
        </div>
      </div>
    </div>
  );
};
