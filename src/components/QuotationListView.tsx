"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  Eye,
  Send,
  XCircle,
  Building2,
  Phone,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Quotation, QuotationStatus, SalesOrder } from "@/types";

interface QuotationListViewProps {
  quotations: Quotation[];
  onOpenCreateQuotation: () => void;
  onConvertQuotationToOrder: (quotation: Quotation) => void;
  onViewQuotationDetail?: (quotation: Quotation) => void;
}

const STATUS_CONFIG: Record<
  QuotationStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  DRAFT: {
    label: "Bản dự thảo",
    color: "text-slate-700",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  SENT: {
    label: "Đã gửi khách",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <Send className="w-3.5 h-3.5" />,
  },
  APPROVED: {
    label: "Khách đã duyệt",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  CONVERTED: {
    label: "Đã tạo đơn hàng",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  REJECTED: {
    label: "Khách từ chối",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

export const QuotationListView: React.FC<QuotationListViewProps> = ({
  quotations,
  onOpenCreateQuotation,
  onConvertQuotationToOrder,
  onViewQuotationDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuotationStatus | "ALL">("ALL");
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const filteredQuotations = useMemo(() => {
    return quotations.filter((q) => {
      const matchSearch =
        searchQuery === "" ||
        q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.customerPhone.includes(searchQuery) ||
        (q.customerCompany && q.customerCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === "ALL" || q.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [quotations, searchQuery, statusFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = quotations.length;
    const approved = quotations.filter((q) => q.status === "APPROVED").length;
    const converted = quotations.filter((q) => q.status === "CONVERTED").length;
    const sent = quotations.filter((q) => q.status === "SENT").length;
    const totalPotential = quotations
      .filter((q) => q.status === "APPROVED" || q.status === "SENT")
      .reduce((sum, q) => sum + q.totalAmount, 0);

    return { total, approved, converted, sent, totalPotential };
  }, [quotations]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header & Thanh hành động */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Quản Lý Báo Giá In Ấn
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bước khởi đầu trong Sơ đồ quy trình (Ảnh 2): Lập bảng tính giá in ấn, gửi duyệt và chuyển đổi thành Phiếu bán hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateQuotation}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tạo Báo Giá Mới
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI Báo Giá */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="stat-card blue">
          <div className="text-xs text-slate-500 font-semibold">Tổng số báo giá</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Khởi tạo trong tháng</div>
        </div>

        <div className="stat-card emerald">
          <div className="text-xs text-slate-500 font-semibold">Khách đã duyệt (Sẵn sàng tạo đơn)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Tỷ lệ chốt cao</div>
        </div>

        <div className="stat-card violet">
          <div className="text-xs text-slate-500 font-semibold">Đã chuyển thành Đơn hàng</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{stats.converted}</div>
          <div className="text-[11px] text-purple-600/80 mt-0.5">Đã sinh Phiếu bán hàng</div>
        </div>

        <div className="stat-card amber">
          <div className="text-xs text-slate-500 font-semibold">Giá trị tiềm năng đang đàm phán</div>
          <div className="text-xl font-bold text-amber-700 mt-1">
            {formatVND(stats.totalPotential)}
          </div>
          <div className="text-[11px] text-amber-600 mt-0.5">{stats.sent} báo giá đang gửi</div>
        </div>
      </div>

      {/* Thanh Tìm kiếm & Lọc trạng thái */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã BG, tên khách hàng, SĐT, sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 transition-all"
          />
        </div>

        {/* Tab lọc Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({quotations.length})
          </button>
          {(Object.keys(STATUS_CONFIG) as QuotationStatus[]).map((st) => {
            const count = quotations.filter((q) => q.status === st).length;
            const cfg = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{cfg.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === st ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng Danh Sách Báo Giá */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="saas-table">
          <thead>
            <tr>
              <th>Mã báo giá</th>
              <th>Ngày lập &amp; Hạn</th>
              <th>Khách hàng</th>
              <th>Hạng mục in ấn</th>
              <th className="text-right">Tổng thành tiền</th>
              <th>Trạng thái</th>
              <th>Người phụ trách</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  Không tìm thấy báo giá nào phù hợp với bộ lọc
                </td>
              </tr>
            ) : (
              filteredQuotations.map((q) => {
                const statusCfg = STATUS_CONFIG[q.status];
                return (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td>
                      <button
                        onClick={() => setPreviewQuotation(q)}
                        className="font-mono font-bold text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {q.quotationNumber}
                      </button>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 font-medium">{q.date}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hạn: {q.validUntil}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900 text-xs">{q.customerName}</div>
                      <div className="text-[11px] text-slate-500">{q.customerPhone}</div>
                      {q.customerCompany && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {q.customerCompany}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="space-y-1">
                        {q.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-slate-800">
                            <span className="font-medium text-slate-900">{item.name}</span>
                            <span className="text-slate-400 text-[11px] ml-1.5">
                              ({item.quantity.toLocaleString("vi-VN")} {item.unit})
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="font-bold text-slate-900 text-xs">
                        {formatVND(q.totalAmount)}
                      </div>
                      {q.discount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-medium">
                          CK: -{formatVND(q.discount)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold border ${statusCfg.bgColor} ${statusCfg.color} ${statusCfg.borderColor}`}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="text-xs text-slate-600">{q.salesRep}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Xem trước */}
                        <button
                          onClick={() => setPreviewQuotation(q)}
                          title="Xem chi tiết & In báo giá"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Nút Chuyển thành Đơn hàng (Khách đã duyệt) */}
                        {q.status === "APPROVED" && (
                          <button
                            onClick={() => onConvertQuotationToOrder(q)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Tạo đơn hàng</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {/* Đã liên kết */}
                        {q.status === "CONVERTED" && (
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                            Đã chốt đơn
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL XEM CHI TIẾT & IN BÁO GIÁ */}
      {previewQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Chi Tiết Báo Giá: {previewQuotation.quotationNumber}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Khách hàng: {previewQuotation.customerName} - {previewQuotation.customerPhone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewQuotation(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - Giả lập Phiếu Báo Giá A4 chuyên nghiệp */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
              {/* Tiêu đề in ấn */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="font-black text-indigo-700 text-base">FSOLUTION</div>
                  <div className="text-[11px] text-slate-500">Hệ thống Xưởng In Ấn &amp; Bao Bì Tiêu Chuẩn</div>
                  <div className="text-[11px] text-slate-500">Hotline: 0965310233 | Email: sales@fsolution.vn</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {previewQuotation.quotationNumber}
                  </div>
                  <div className="text-[11px] text-slate-500">Ngày lập: {previewQuotation.date}</div>
                  <div className="text-[11px] text-rose-500 font-semibold">
                    Hiệu lực đến: {previewQuotation.validUntil}
                  </div>
                </div>
              </div>

              {/* Thông tin khách hàng */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400">Khách hàng: </span>
                  <strong className="text-slate-900">{previewQuotation.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Điện thoại: </span>
                  <strong className="text-slate-900">{previewQuotation.customerPhone}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Công ty: </span>
                  <span className="text-slate-800">{previewQuotation.customerCompany || "Cá nhân"}</span>
                </div>
                <div>
                  <span className="text-slate-400">Kinh doanh phụ trách: </span>
                  <span className="text-indigo-600 font-semibold">{previewQuotation.salesRep}</span>
                </div>
              </div>

              {/* Bảng hạng mục in */}
              <table className="w-full border-collapse border border-slate-200 text-left">
                <thead>
                  <tr className="bg-slate-100/80 text-[11px] text-slate-700 font-bold">
                    <th className="p-2 border border-slate-200">#</th>
                    <th className="p-2 border border-slate-200">Sản phẩm &amp; Quy cách in ấn</th>
                    <th className="p-2 border border-slate-200 text-right">SL</th>
                    <th className="p-2 border border-slate-200">ĐVT</th>
                    <th className="p-2 border border-slate-200 text-right">Đơn giá</th>
                    <th className="p-2 border border-slate-200 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {previewQuotation.items.map((it, idx) => (
                    <tr key={it.id}>
                      <td className="p-2 border border-slate-200 text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border border-slate-200">
                        <div className="font-bold text-slate-900">{it.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {it.dimensions} • {it.paperType} • {it.printMethod} ({it.printSides})
                        </div>
                        {it.finishing.length > 0 && (
                          <div className="text-[10px] text-indigo-600 mt-0.5">
                            Gia công: {it.finishing.join(" • ")}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border border-slate-200 text-right font-bold">
                        {it.quantity.toLocaleString("vi-VN")}
                      </td>
                      <td className="p-2 border border-slate-200 text-slate-600">{it.unit}</td>
                      <td className="p-2 border border-slate-200 text-right font-mono">
                        {formatVND(it.unitPrice)}
                      </td>
                      <td className="p-2 border border-slate-200 text-right font-bold text-slate-900 font-mono">
                        {formatVND(it.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tổng cộng */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Tổng tiền hàng:</span>
                    <span className="font-mono">{formatVND(previewQuotation.subTotal)}</span>
                  </div>
                  {previewQuotation.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Chiết khấu:</span>
                      <span className="font-mono">-{formatVND(previewQuotation.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>VAT (8% / 10%):</span>
                    <span className="font-mono">{formatVND(previewQuotation.vat)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Tổng thanh toán:</span>
                    <span className="text-indigo-600 font-mono">
                      {formatVND(previewQuotation.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {previewQuotation.notes && (
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
                  <strong>Ghi chú:</strong> {previewQuotation.notes}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                In Phiếu Báo Giá
              </button>

              <div className="flex items-center gap-2">
                {previewQuotation.status === "APPROVED" && (
                  <button
                    onClick={() => {
                      onConvertQuotationToOrder(previewQuotation);
                      setPreviewQuotation(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Chuyển thành Đơn hàng (Phiếu bán hàng)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setPreviewQuotation(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
