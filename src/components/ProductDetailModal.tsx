"use client";

import React from "react";
import {
  X,
  Box,
  Layers,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Ruler,
  FileText,
  DollarSign,
  ShoppingCart,
  Send,
  Info,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";
import { Product } from "@/types";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickOrder?: (product: Product) => void;
  onQuickQuotation?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onQuickOrder,
  onQuickQuotation,
}) => {
  if (!isOpen || !product) return null;

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Banner Header */}
        <div className={`p-6 bg-gradient-to-r ${product.colorAccent || "from-indigo-600 to-violet-700"} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs border border-white/20">
              {product.code}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs">
              {product.category}
            </span>
            {product.status === "ACTIVE" ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Đang nhận đơn
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-400/20 text-slate-200">
                Tạm ngưng
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {product.name}
          </h2>
          <p className="text-xs text-white/80 mt-1 max-w-xl">
            {product.description}
          </p>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold bg-white/15 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* 4 Block Highlight KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                Đơn giá cơ sở
              </div>
              <div className="text-base font-extrabold text-indigo-600">
                {formatVND(product.basePrice)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">/ 1 {product.unit}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <Box className="w-3.5 h-3.5 text-emerald-600" />
                Đặt tối thiểu (MOQ)
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {product.minOrderQty.toLocaleString("vi-VN")} {product.unit}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Mức tối ưu chi phí</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Thời gian sản xuất
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {product.productionLeadTime}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Từ lúc duyệt file in</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 mb-1">
                <ShoppingCart className="w-3.5 h-3.5 text-purple-600" />
                Lượt đơn đã in
              </div>
              <div className="text-base font-extrabold text-purple-700">
                {product.totalOrdersCount} đơn
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Đánh giá 4.9/5 ★</div>
            </div>
          </div>

          {/* Chi tiết Quy cách kỹ thuật in ấn */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Thông Số Kỹ Thuật Tiêu Chuẩn
            </h3>

            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-slate-400" />
                  Kích thước thành phẩm:
                </span>
                <span className="sm:col-span-2 font-bold text-slate-900">
                  {product.standardDimensions}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Chất liệu giấy mặc định:
                </span>
                <span className="sm:col-span-2 font-semibold text-slate-800">
                  {product.defaultPaper}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  Công nghệ in:
                </span>
                <span className="sm:col-span-2 font-bold text-indigo-700">
                  {product.printMethod}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 p-3 text-xs">
                <span className="font-semibold text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  Gia công hoàn thiện:
                </span>
                <div className="sm:col-span-2 flex flex-wrap gap-1.5">
                  {product.recommendedFinishing.map((fin) => (
                    <span
                      key={fin}
                      className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-[11px]"
                    >
                      {fin}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bảng giá tham khảo theo số lượng */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Thang Giá Tham Khảo Theo Số Lượng (In Càng Nhiều Càng Rẻ)
            </h3>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Mức số lượng</th>
                    <th className="p-3 text-right">Đơn giá / {product.unit}</th>
                    <th className="p-3 text-right">Tổng chi phí dự tính</th>
                    <th className="p-3 text-center">Tiết kiệm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800">
                      {product.minOrderQty.toLocaleString("vi-VN")} {product.unit} (Mức cơ sở)
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      {formatVND(product.basePrice)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-800">
                      {formatVND(product.basePrice * product.minOrderQty)}
                    </td>
                    <td className="p-3 text-center text-slate-400">—</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 font-semibold text-slate-800">
                      {(product.minOrderQty * 2.5).toLocaleString("vi-VN")} {product.unit}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      {formatVND(Math.round(product.basePrice * 0.85))}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-800">
                      {formatVND(Math.round(product.basePrice * 0.85 * product.minOrderQty * 2.5))}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        -15%
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-indigo-50/30">
                    <td className="p-3 font-semibold text-slate-800">
                      {(product.minOrderQty * 5).toLocaleString("vi-VN")} {product.unit} (Khuyên dùng)
                    </td>
                    <td className="p-3 text-right font-bold text-indigo-700">
                      {formatVND(Math.round(product.basePrice * 0.72))}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-indigo-800">
                      {formatVND(Math.round(product.basePrice * 0.72 * product.minOrderQty * 5))}
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        -28%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Lưu ý Chế bản & Thiết kế */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold">Lưu ý chuẩn file in cho xưởng chế bản Fsolution:</div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Hệ màu in ấn bắt buộc <strong>CMYK</strong>, độ phân giải tối thiểu <strong>300 DPI</strong>. Tràn lề cắt xén (Bleed) tối thiểu <strong>2mm mỗi cạnh</strong>. Chuyển đổi font chữ (Convert / Create Outlines) trước khi xuất file PDF/AI/TIFF để tránh lỗi font khi rọi kẽm CTP.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Đóng cửa sổ
          </button>

          <div className="flex items-center gap-2.5">
            {onQuickQuotation && (
              <button
                onClick={() => {
                  onClose();
                  onQuickQuotation(product);
                }}
                className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Lập Báo Giá</span>
              </button>
            )}

            {onQuickOrder && (
              <button
                onClick={() => {
                  onClose();
                  onQuickOrder(product);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Tạo Đơn Hàng Từ Sản Phẩm Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
