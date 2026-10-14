"use client";

import React from "react";
import {
  X,
  FileText,
  FileCheck2,
  Users,
  Cpu,
  Factory,
  PackageCheck,
  DollarSign,
  Truck,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Printer,
} from "lucide-react";

interface InteractiveDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStepFilter?: (stepKey: string) => void;
}

export const InteractiveDiagramModal: React.FC<InteractiveDiagramModalProps> = ({
  isOpen,
  onClose,
  onStepFilter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[1480px] w-[97vw] border border-gray-300 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-red-600 font-black text-xl flex items-center justify-center shadow-md">
              SV
            </div>
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-amber-200">
                FSOLUTION
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                SƠ ĐỒ QUY TRÌNH QUẢN LÝ IN ẤN
              </h2>
              <div className="text-xs text-white/90 font-medium">
                Chức năng Đơn đặt hàng - In ấn | Hệ thống Fsolution
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right text-[11px] text-amber-100">
              <span className="font-semibold text-white">Công ty TNHH Fsolution</span>
              <span className="flex items-center justify-end gap-1">
                <Globe className="w-3 h-3" /> fsolution.vn • <Phone className="w-3 h-3" /> 0965310233
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sơ Đồ Quy Trình Tương Tác */}
        <div className="p-4 sm:p-6 bg-slate-50/60 overflow-x-auto space-y-6">
          {/* PHẦN 1: 6 BƯỚC SẢN XUẤT CHÍNH */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Giai đoạn 1: Tiếp nhận và Chế bản - Sản xuất
              </span>
              <span className="text-xs text-gray-400 italic">
                * Click vào từng khối để áp dụng bộ lọc đơn hàng
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 items-stretch md:min-w-[1280px]">
              {/* START */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-2xs hover:border-blue-400 transition">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
                  START
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-gray-800 leading-snug">
                  Báo giá hoặc tạo trực tiếp
                </div>
              </div>

              {/* BƯỚC 1: Tiếp nhận đơn hàng */}
              <div
                onClick={() => {
                  onStepFilter?.("DRAFT");
                  onClose();
                }}
                className="bg-white border-2 border-orange-200 hover:border-orange-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 whitespace-nowrap">
                      Tiếp nhận đơn hàng
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Tạo Đơn đặt hàng in ấn</li>
                    <li>Nhập khách hàng, ngày giao, thanh toán</li>
                    <li>Khai báo sản phẩm, file đính kèm</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-orange-100 flex flex-wrap gap-1">
                  <span className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.5 rounded">
                    Lưu nháp
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded">
                    Chờ PSX
                  </span>
                </div>
              </div>

              {/* BƯỚC 2: Kiểm tra dữ liệu sản phẩm */}
              <div
                onClick={() => {
                  onStepFilter?.("WAITING_PSX");
                  onClose();
                }}
                className="bg-white border-2 border-rose-200 hover:border-rose-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-rose-600 whitespace-nowrap">
                      Kiểm tra dữ liệu
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Kiểm tra mã SP, SL, quy cách</li>
                    <li>Sản phẩm cũ: bắt buộc có mã SP</li>
                    <li>Chuẩn bị dữ liệu chuyển sản xuất</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-rose-100">
                  <span className="bg-rose-50 text-rose-700 font-semibold text-[10px] px-1.5 py-0.5 rounded">
                    RIP file &amp; Khổ giấy
                  </span>
                </div>
              </div>

              {/* BƯỚC 3: PSX tiếp nhận */}
              <div
                onClick={() => {
                  onStepFilter?.("PSX_ACCEPTED");
                  onClose();
                }}
                className="bg-white border-2 border-teal-200 hover:border-teal-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      3
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-teal-600 whitespace-nowrap">
                      PSX tiếp nhận
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Gán nhân viên phòng sản xuất</li>
                    <li>Xác nhận tiếp nhận đơn</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-teal-100">
                  <span className="bg-teal-100 text-teal-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                    PSX đã tiếp nhận
                  </span>
                </div>
              </div>

              {/* BƯỚC 4: Tạo Lệnh Sản Xuất */}
              <div
                onClick={() => {
                  onStepFilter?.("LSX_CREATED");
                  onClose();
                }}
                className="bg-white border-2 border-sky-200 hover:border-sky-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      4
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-sky-600 whitespace-nowrap">
                      Tạo Lệnh SX (LSX)
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Sinh LSX từ đơn hàng</li>
                    <li>Xạo BTP theo từng dòng sản phẩm</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-sky-100">
                  <span className="bg-sky-100 text-sky-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                    Đã tạo LSX
                  </span>
                </div>
              </div>

              {/* BƯỚC 5: Triển khai sản xuất */}
              <div
                onClick={() => {
                  onStepFilter?.("IN_PRODUCTION");
                  onClose();
                }}
                className="bg-white border-2 border-indigo-200 hover:border-indigo-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      5
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 whitespace-nowrap">
                      Triển khai SX
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Duyệt LSX, BOM, công đoạn, NVL</li>
                    <li>Theo dõi tiến độ thực hiện</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-indigo-100">
                  <span className="bg-indigo-100 text-indigo-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                    Đang sản xuất
                  </span>
                </div>
              </div>

              {/* BƯỚC 6: Sản xuất xong */}
              <div
                onClick={() => {
                  onStepFilter?.("PRODUCED");
                  onClose();
                }}
                className="bg-white border-2 border-purple-200 hover:border-purple-500 rounded-xl p-3 shadow-2xs flex flex-col justify-between cursor-pointer transition group"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      6
                    </span>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-purple-600 whitespace-nowrap">
                      Sản xuất xong
                    </h3>
                  </div>
                  <ul className="text-[11px] text-gray-600 space-y-1 list-disc list-inside">
                    <li>Hoàn tất gia công / thành phẩm</li>
                    <li>Sẵn sàng giao hàng</li>
                  </ul>
                </div>
                <div className="mt-2 pt-2 border-t border-purple-100">
                  <span className="bg-purple-100 text-purple-800 font-semibold text-[10px] px-2 py-0.5 rounded">
                    Sản xuất xong
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 2: PHÂN NHÁNH A (THU TIỀN) & NHÁNH B (XUẤT KHO) */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Giai đoạn 2: Phân nhánh Tài chính (Phiếu thu) &amp; Kho vận (Phiếu xuất)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NHÁNH A: Thu tiền / Phiếu thu */}
              <div className="border-2 border-emerald-300 bg-emerald-50/40 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-emerald-900">
                      Thu tiền / Phiếu thu
                    </h4>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <ul className="text-xs text-gray-700 mt-1.5 space-y-1 list-disc list-inside">
                    <li>Ghi nhận phiếu thu đã ghi sổ</li>
                    <li>Cập nhật Đã thu / Công nợ theo từng đợt</li>
                  </ul>
                </div>
              </div>

              {/* NHÁNH B: Xuất kho / Giao hàng */}
              <div className="border-2 border-blue-300 bg-blue-50/40 rounded-xl p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                  B
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-blue-900">
                      Xuất kho / Giao hàng
                    </h4>
                    <Truck className="w-4 h-4 text-blue-600" />
                  </div>
                  <ul className="text-xs text-gray-700 mt-1.5 space-y-1 list-disc list-inside">
                    <li>Tạo phiếu xuất kho</li>
                    <li>Cập nhật Đã xuất / Còn lại trong kho</li>
                    <li>Trạng thái: &quot;Đã xuất hàng&quot;</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* KHỐI ĐIỀU KIỆN QUYẾT ĐỊNH (Decision Diamond) */}
            <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-6 pt-4 border-t border-gray-200">
              {/* Hình thoi quyết định */}
              <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-md text-center">
                <div className="text-[10px] text-amber-200 uppercase tracking-widest">
                  ĐIỀU KIỆN KIỂM TRA
                </div>
                <div className="text-sm">Đã thu đủ + Xuất đủ?</div>
              </div>

              {/* Rẽ nhánh YES */}
              <div className="flex items-center gap-2 bg-emerald-50 border-2 border-emerald-500 p-3 rounded-xl text-emerald-900">
                <span className="font-black text-emerald-700 text-xs px-2 py-0.5 bg-emerald-200 rounded">
                  YES
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-black text-xs text-emerald-800 uppercase whitespace-nowrap">
                    HOÀN THÀNH
                  </div>
                  <div className="text-[11px] text-emerald-700 whitespace-nowrap">Đơn hàng kết thúc</div>
                </div>
              </div>

              {/* Rẽ nhánh NO */}
              <div className="flex items-center gap-2 bg-red-50 border-2 border-red-400 p-3 rounded-xl text-red-900">
                <span className="font-black text-red-700 text-xs px-2 py-0.5 bg-red-200 rounded">
                  NO
                </span>
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <div>
                  <div className="font-black text-xs text-red-800 uppercase whitespace-nowrap">
                    Theo dõi công nợ / xuất hàng tiếp
                  </div>
                  <div className="text-[11px] text-red-700 whitespace-nowrap">Tiếp tục xử lý cho đến khi đủ điều kiện</div>
                </div>
              </div>
            </div>
          </div>

          {/* PHẦN 3: DÒNG TRẠNG THÁI TIẾN TRÌNH & LIÊN KẾT DỮ LIỆU */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Dòng trạng thái đơn hàng (Timeline)
              </div>
              <div className="flex flex-nowrap items-center gap-1.5 text-xs font-medium overflow-x-auto pb-1">
                <span className="px-2.5 py-1 bg-gray-100 rounded-md text-gray-700 whitespace-nowrap shrink-0">Lưu nháp</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-amber-100 rounded-md text-amber-800 whitespace-nowrap shrink-0">Chờ PSX tiếp nhận</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-teal-100 rounded-md text-teal-800 whitespace-nowrap shrink-0">PSX đã tiếp nhận</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-sky-100 rounded-md text-sky-800 whitespace-nowrap shrink-0">Đã tạo LSX</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-indigo-100 rounded-md text-indigo-800 whitespace-nowrap shrink-0">Đang sản xuất</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-purple-100 rounded-md text-purple-800 whitespace-nowrap shrink-0">Sản xuất xong</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-blue-100 rounded-md text-blue-800 whitespace-nowrap shrink-0">Đã xuất hàng</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-md font-bold whitespace-nowrap shrink-0">Hoàn thành</span>
              </div>
            </div>

            {/* Khung Liên kết dữ liệu chính */}
            <div className="bg-emerald-900 text-white p-4 rounded-xl shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                Liên kết dữ liệu chính
              </div>
              <div className="space-y-1.5 text-xs text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Báo giá</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Lệnh sản xuất</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Phiếu thu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Phiếu xuất kho</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-600">
            Sơ đồ chuẩn nghiệp vụ theo thiết kế đồ họa của Fsolution (Ảnh 2).
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg transition"
          >
            Đóng sơ đồ
          </button>
        </div>
      </div>
    </div>
  );
};
