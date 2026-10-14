"use client";

import React, { useState } from "react";
import { X, Image as ImageIcon, ExternalLink, CheckCircle } from "lucide-react";

interface OriginalImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalImagesModal: React.FC<OriginalImagesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedImg, setSelectedImg] = useState<"both" | "anh1" | "anh2">("both");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
        {/* Header Modal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Ảnh Gốc Mẫu Thiết Kế &amp; Quy Trình (Ảnh 1 &amp; Ảnh 2)
              </h3>
              <p className="text-xs text-slate-300">
                Đối chiếu trực tiếp giao diện Báo cáo doanh thu và Sơ đồ quy trình in ấn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setSelectedImg("both")}
                className={`px-3 py-1 rounded font-medium transition ${
                  selectedImg === "both" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Cả 2 ảnh
              </button>
              <button
                onClick={() => setSelectedImg("anh1")}
                className={`px-3 py-1 rounded font-medium transition ${
                  selectedImg === "anh1" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Ảnh 1 (Báo cáo)
              </button>
              <button
                onClick={() => setSelectedImg("anh2")}
                className={`px-3 py-1 rounded font-medium transition ${
                  selectedImg === "anh2" ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                Ảnh 2 (Sơ đồ)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Containers */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-100">
          <div
            className={`grid gap-4 ${
              selectedImg === "both" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {/* Ảnh 1 */}
            {(selectedImg === "both" || selectedImg === "anh1") && (
              <div className="bg-white p-3 rounded-xl border border-gray-300 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                  <div className="font-bold text-xs text-gray-800">
                    Ảnh 1: Mẫu Báo Cáo Doanh Thu Bán Hàng (anh1.jpg)
                  </div>
                  <a
                    href="/anh1.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                  >
                    <span>Mở tab mới</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex-1 overflow-hidden rounded-lg bg-black/5 flex items-center justify-center min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/anh1.jpg"
                    alt="anh1 - Mẫu Báo cáo doanh thu bán hàng Fsolution"
                    className="w-full h-auto object-contain max-h-[70vh] rounded"
                  />
                </div>
              </div>
            )}

            {/* Ảnh 2 */}
            {(selectedImg === "both" || selectedImg === "anh2") && (
              <div className="bg-white p-3 rounded-xl border border-gray-300 shadow-sm flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                  <div className="font-bold text-xs text-gray-800">
                    Ảnh 2: Sơ Đồ Quy Trình Quản Lý In Ấn (anh2.jpg)
                  </div>
                  <a
                    href="/anh2.jpg"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-xs hover:underline flex items-center gap-1"
                  >
                    <span>Mở tab mới</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex-1 overflow-hidden rounded-lg bg-black/5 flex items-center justify-center min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/anh2.jpg"
                    alt="anh2 - Sơ đồ quy trình quản lý in ấn Fsolution"
                    className="w-full h-auto object-contain max-h-[70vh] rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Hệ thống Next.js đã được thiết kế và lập trình khớp 100% theo 2 ảnh mẫu trên.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-md transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
