"use client";

import React, { useState } from "react";
import {
  SalesOrder,
  OrderStep,
  ReceiptVoucher,
  ExportVoucher,
} from "@/types";
import {
  FileText,
  Clock,
  UserCheck,
  Cpu,
  Layers,
  PackageCheck,
  Truck,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldAlert,
  Info,
  Calendar,
  User,
  Paperclip,
  Check,
  ChevronRight,
  Workflow,
  ExternalLink,
  Sparkles,
  CreditCard,
  Building2,
} from "lucide-react";

interface OrdersWorkflowViewProps {
  orders: SalesOrder[];
  onSelectOrder: (order: SalesOrder) => void;
  onUpdateOrder: (updatedOrder: SalesOrder) => void;
  onOpenCreateOrder: () => void;
  onOpenDiagram: () => void;
}

export const STEP_CONFIG: Record<
  OrderStep,
  { label: string; number: string; color: string; badgeBg: string; text: string }
> = {
  DRAFT: {
    label: "Lưu nháp",
    number: "1",
    color: "bg-slate-400",
    badgeBg: "bg-slate-100 border-slate-300",
    text: "text-slate-700",
  },
  WAITING_PSX: {
    label: "Chờ PSX tiếp nhận",
    number: "2",
    color: "bg-amber-500",
    badgeBg: "bg-amber-50 border-amber-300",
    text: "text-amber-800",
  },
  PSX_ACCEPTED: {
    label: "PSX đã tiếp nhận",
    number: "3",
    color: "bg-teal-500",
    badgeBg: "bg-teal-50 border-teal-300",
    text: "text-teal-800",
  },
  LSX_CREATED: {
    label: "Đã tạo LSX",
    number: "4",
    color: "bg-sky-600",
    badgeBg: "bg-sky-50 border-sky-300",
    text: "text-sky-800",
  },
  IN_PRODUCTION: {
    label: "Đang sản xuất",
    number: "5",
    color: "bg-indigo-600",
    badgeBg: "bg-indigo-50 border-indigo-300",
    text: "text-indigo-800",
  },
  PRODUCED: {
    label: "Sản xuất xong",
    number: "6",
    color: "bg-purple-600",
    badgeBg: "bg-purple-50 border-purple-300",
    text: "text-purple-800",
  },
  SHIPPED: {
    label: "Đã xuất hàng",
    number: "B",
    color: "bg-blue-600",
    badgeBg: "bg-blue-50 border-blue-300",
    text: "text-blue-800",
  },
  COMPLETED: {
    label: "Hoàn tất",
    number: "✓",
    color: "bg-emerald-600",
    badgeBg: "bg-emerald-50 border-emerald-300",
    text: "text-emerald-800",
  },
};

export const OrdersWorkflowView: React.FC<OrdersWorkflowViewProps> = ({
  orders,
  onSelectOrder,
  onUpdateOrder,
  onOpenCreateOrder,
  onOpenDiagram,
}) => {
  const [activeTabFilter, setActiveTabFilter] = useState<string>("ALL");

  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val) + " đ";
  };

  // Quick Action to move order to next state according to image 2 logic
  const handleQuickAdvance = (order: SalesOrder, e: React.MouseEvent) => {
    e.stopPropagation();

    let nextStep: OrderStep = order.step;
    const updated = { ...order };

    if (order.step === "DRAFT") {
      nextStep = "WAITING_PSX";
    } else if (order.step === "WAITING_PSX") {
      nextStep = "PSX_ACCEPTED";
      updated.psxAssignedTo = "KTV Trưởng Trần Văn Toàn";
    } else if (order.step === "PSX_ACCEPTED") {
      nextStep = "LSX_CREATED";
      updated.productionOrder = {
        lsxCode: `LSX2510-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toLocaleDateString("vi-VN"),
        machine: "Heidelberg Speedmaster SM 74",
        psxLead: updated.psxAssignedTo || "Trần Văn Toàn",
        bomItems: [
          { materialName: "Giấy in tiêu chuẩn", plannedQty: 5, unit: "Ram", status: "Đã xuất kho NVL" },
          { materialName: "Mực in Process CMYK", plannedQty: 4, unit: "Kg", status: "Đã xuất kho NVL" },
        ],
        steps: [
          { name: "Chế bản CTP", status: "done", assignee: "KTV Chế bản" },
          { name: "In ấn kỹ thuật", status: "in_progress", assignee: "Thợ in chính" },
          { name: "Gia công KCS", status: "pending", assignee: "Tổ hoàn thiện" },
        ],
      };
    } else if (order.step === "LSX_CREATED") {
      nextStep = "IN_PRODUCTION";
    } else if (order.step === "IN_PRODUCTION") {
      nextStep = "PRODUCED";
    } else if (order.step === "PRODUCED") {
      nextStep = "SHIPPED";
      if (updated.exports.length === 0) {
        const expVoucher: ExportVoucher = {
          id: `EXP-${Date.now()}`,
          code: `PXK2510-${Math.floor(100 + Math.random() * 900)}`,
          date: new Date().toLocaleDateString("vi-VN"),
          exportedQty: updated.totalQtyOrdered,
          receiver: updated.customer.name,
          address: updated.customer.address,
          status: "Đã xuất hàng",
        };
        updated.exports = [expVoucher];
        updated.totalQtyExported = updated.totalQtyOrdered;
        updated.remainingQty = 0;
      }
    } else if (order.step === "SHIPPED") {
      if (updated.debtAmount > 0) {
        alert(
          `⚠️ Chưa đủ điều kiện hoàn thành!\n\nTheo quy trình Ảnh 2: Đơn hàng còn công nợ: ${formatVND(
            updated.debtAmount
          )}.\nHệ thống tiếp tục: "Theo dõi công nợ / xuất hàng tiếp".\n\nVui lòng thu đủ tiền bằng nút "Ghi nhận phiếu thu" để hoàn tất đơn hàng!`
        );
        return;
      }
      if (updated.remainingQty > 0) {
        alert(
          `⚠️ Chưa xuất đủ hàng!\nCòn lại: ${updated.remainingQty} sản phẩm chưa xuất kho.`
        );
        return;
      }
      nextStep = "COMPLETED";
    }

    updated.step = nextStep;
    onUpdateOrder(updated);
  };

  // Quick action: Ghi nhận thu đủ tiền
  const handlePayFull = (order: SalesOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (order.debtAmount <= 0) {
      alert("Đơn hàng này đã thanh toán đủ 100%!");
      return;
    }
    const receipt: ReceiptVoucher = {
      id: `REC-${Date.now()}`,
      code: `PT2510-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("vi-VN"),
      amount: order.debtAmount,
      method: "Chuyển khoản",
      recorded: true,
      note: `Ghi nhận thu tiền thanh toán còn lại cho ${order.salesBillNumber}`,
    };
    const updated: SalesOrder = {
      ...order,
      paidAmount: order.totalAmount,
      debtAmount: 0,
      receipts: [...order.receipts, receipt],
    };
    if (updated.step === "SHIPPED" && updated.remainingQty === 0) {
      updated.step = "COMPLETED";
    }
    onUpdateOrder(updated);
    alert(
      `✓ Đã tạo Phiếu thu ${receipt.code} số tiền ${formatVND(
        receipt.amount
      )}.\nCông nợ đơn hàng đã về 0 đ!`
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTabFilter === "ALL") return true;
    return o.step === activeTabFilter;
  });

  const NEXT_LABEL: Record<OrderStep, string> = {
    DRAFT: "Chuyển tiếp nhận PSX",
    WAITING_PSX: "PSX Xác nhận tiếp nhận",
    PSX_ACCEPTED: "Sinh Lệnh Sản Xuất (LSX)",
    LSX_CREATED: "Triển khai sản xuất",
    IN_PRODUCTION: "Hoàn thành sản xuất",
    PRODUCED: "Tạo phiếu xuất kho & Giao",
    SHIPPED: "Kiểm tra điều kiện Hoàn thành",
    COMPLETED: "Đã hoàn thành",
  };

  // Card gọn cho 1 ô Kanban
  const renderKanbanCard = (order: SalesOrder) => {
    const hasDebt = order.debtAmount > 0;
    const payPercent =
      order.totalAmount > 0
        ? Math.min(100, Math.round((order.paidAmount / order.totalAmount) * 100))
        : 100;
    const isFinished = order.step === "COMPLETED";
    return (
      <div
        key={order.id}
        onClick={() => onSelectOrder(order)}
        className="kanban-card bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all p-3 cursor-pointer group"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-bold text-indigo-700">
            {order.salesBillNumber}
          </span>
          <span className="text-[10px] text-slate-400 whitespace-nowrap">
            {order.orderDate}
          </span>
        </div>

        <div className="text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-indigo-600 transition">
          {order.customer.name}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 truncate" title={order.items.map((i) => i.name).join("; ")}>
          {order.items[0]?.name}
          {order.items.length > 1 && ` +${order.items.length - 1} SP`} •{" "}
          {order.totalQtyOrdered.toLocaleString("vi-VN")} {order.items[0]?.unit}
        </div>

        <div className="flex items-center justify-between mt-2 text-[11px] gap-2">
          <span className="font-extrabold text-slate-900">
            {formatVND(order.totalAmount)}
          </span>
          {hasDebt ? (
            <span className="font-bold text-rose-600 whitespace-nowrap">
              Nợ {formatVND(order.debtAmount)}
            </span>
          ) : (
            <span className="font-semibold text-emerald-600 whitespace-nowrap">
              ✓ Đủ tiền
            </span>
          )}
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all"
            style={{ width: `${payPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-indigo-600" />
            {order.totalQtyExported}/{order.totalQtyOrdered}
            {order.remainingQty > 0 ? (
              <span className="text-amber-600 font-semibold">(Còn {order.remainingQty})</span>
            ) : (
              <span className="text-emerald-600 font-semibold">(100%)</span>
            )}
          </span>
          {order.productionOrder ? (
            <span className="font-mono font-bold text-sky-700">
              {order.productionOrder.lsxCode}
            </span>
          ) : (
            <span className="italic">Chưa có LSX</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          {!isFinished ? (
            <button
              onClick={(e) => handleQuickAdvance(order, e)}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              <span className="truncate">{NEXT_LABEL[order.step]}</span>
              <ArrowRight className="w-3 h-3 shrink-0" />
            </button>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1 text-emerald-800 bg-emerald-50 text-[11px] font-bold px-2 py-1.5 rounded-lg border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hoàn thành</span>
            </span>
          )}
          {hasDebt && (
            <button
              onClick={(e) => handlePayFull(order, e)}
              className="flex items-center gap-0.5 px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 transition cursor-pointer shrink-0"
              title="Ghi nhận phiếu thu (Nhánh A)"
            >
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Thu</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const kanbanSteps = (Object.keys(STEP_CONFIG) as OrderStep[]).filter(
    (st) => activeTabFilter === "ALL" || activeTabFilter === st
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header Banner - Dark SaaS Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3 h-3" /> Chuẩn Ảnh 2 Poster
              </span>
              <span className="text-xs font-medium text-indigo-300">
                Pipeline Quản lý Đơn hàng &amp; Xưởng In
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
              Quy Trình Quản Lý In Ấn Khép Kín
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Theo dõi vòng đời từ <strong>Tiếp nhận đơn</strong> → <strong>KCS RIP file</strong> → <strong>PSX duyệt</strong> → <strong>Phát hành LSX</strong> → <strong>In ấn máy offset/kỹ thuật số</strong> → <strong>Gia công BTP</strong> → <strong>Tách 2 nhánh: Phiếu thu &amp; Xuất kho</strong> → <strong>Đóng hoàn thành</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenDiagram}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Workflow className="w-4 h-4 text-slate-900" />
              <span>Xem Sơ Đồ Đồ Họa</span>
            </button>

            <button
              onClick={onOpenCreateOrder}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Đơn Hàng Mới</span>
            </button>
          </div>
        </div>

        {/* Timeline Stepper Pipeline 8 Bước */}
        <div className="relative z-10 mt-6 pt-5 border-t border-indigo-900/60">
          <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Tiến trình 8 bước theo Sơ đồ Ảnh 2</span>
            <span className="text-[10px] text-slate-400">Bấm vào bước để lọc đơn</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {(
              [
                "DRAFT",
                "WAITING_PSX",
                "PSX_ACCEPTED",
                "LSX_CREATED",
                "IN_PRODUCTION",
                "PRODUCED",
                "SHIPPED",
                "COMPLETED",
              ] as OrderStep[]
            ).map((st, idx) => {
              const cfg = STEP_CONFIG[st];
              const count = orders.filter((o) => o.step === st).length;
              const isActive = activeTabFilter === st;

              return (
                <button
                  key={st}
                  onClick={() => setActiveTabFilter(isActive ? "ALL" : st)}
                  className={`text-left p-2.5 rounded-xl border transition-all relative text-xs cursor-pointer ${
                    isActive
                      ? "bg-white text-slate-900 border-amber-400 shadow-lg ring-2 ring-amber-400/80 scale-[1.02]"
                      : "bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-extrabold ${
                        isActive
                          ? "bg-amber-500 text-white"
                          : "bg-indigo-950 text-indigo-300 border border-indigo-800"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        count > 0
                          ? isActive
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                  <div className="font-bold text-[11px] truncate">
                    {cfg.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTabFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTabFilter === "ALL"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            onClick={() => setActiveTabFilter("WAITING_PSX")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTabFilter === "WAITING_PSX"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Chờ PSX tiếp nhận ({orders.filter((o) => o.step === "WAITING_PSX").length})
          </button>
          <button
            onClick={() => setActiveTabFilter("IN_PRODUCTION")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTabFilter === "IN_PRODUCTION"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            Đang sản xuất ({orders.filter((o) => o.step === "IN_PRODUCTION").length})
          </button>
          <button
            onClick={() => setActiveTabFilter("SHIPPED")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTabFilter === "SHIPPED"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200"
            }`}
          >
            Theo dõi công nợ ({orders.filter((o) => o.step === "SHIPPED" && o.debtAmount > 0).length})
          </button>
          <button
            onClick={() => setActiveTabFilter("COMPLETED")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTabFilter === "COMPLETED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Đã hoàn tất ({orders.filter((o) => o.step === "COMPLETED").length})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Hiển thị <strong>{filteredOrders.length}</strong> / {orders.length} đơn hàng
        </div>
      </div>

      {/* 3. Kanban Board theo trạng thái */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <Workflow className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">Chưa có đơn hàng nào</p>
          <p className="text-xs text-slate-400 mt-1">Nhấn &quot;Tạo Đơn Hàng Mới&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-3 items-start">
          {kanbanSteps.map((st) => {
            const cfg = STEP_CONFIG[st];
            const colOrders = orders.filter((o) => o.step === st);
            const colValue = colOrders.reduce((s, o) => s + o.totalAmount, 0);
            const colDebt = colOrders.reduce((s, o) => s + o.debtAmount, 0);
            return (
              <div
                key={st}
                className="kanban-col w-[300px] shrink-0 rounded-xl border border-slate-200 flex flex-col max-h-[74vh]"
              >
                <div className={`h-1 rounded-t-xl ${cfg.color}`}></div>
                <div className="p-3 bg-white border-b border-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap">
                      {cfg.label}
                    </span>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                      {colOrders.length}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Giá trị: <strong className="text-slate-800">{formatVND(colValue)}</strong>
                    {colDebt > 0 && (
                      <>
                        {" "}• Nợ: <strong className="text-rose-600">{formatVND(colDebt)}</strong>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-2 space-y-2.5 overflow-y-auto">
                  {colOrders.length === 0 ? (
                    <div className="text-center text-[11px] text-slate-400 py-6 border border-dashed border-slate-300 rounded-lg">
                      Trống — kéo đơn sang hoặc chuyển trạng thái
                    </div>
                  ) : (
                    colOrders.map((order) => renderKanbanCard(order))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
