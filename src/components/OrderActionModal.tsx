"use client";

import React, { useState } from "react";
import {
  SalesOrder,
  OrderStep,
  ReceiptVoucher,
  ExportVoucher,
  DesignTemplate,
} from "@/types";
import { STEP_CONFIG } from "./OrdersWorkflowView";
import { resolveDesignPreview } from "@/utils/drive";
import {
  X,
  FileText,
  DollarSign,
  Truck,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Paperclip,
  Check,
  Plus,
  Printer,
  Clock,
  ArrowRight,
  Image as ImageIcon,
  ExternalLink,
  Palette,
} from "lucide-react";

interface OrderActionModalProps {
  order: SalesOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: SalesOrder) => void;
  designTemplates?: DesignTemplate[];
}

export const OrderActionModal: React.FC<OrderActionModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  designTemplates = [],
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "production" | "finance" | "export">("overview");
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // Form tạo phiếu thu
  const [receiptAmount, setReceiptAmount] = useState<number>(0);
  const [receiptMethod, setReceiptMethod] = useState<"Chuyển khoản" | "Tiền mặt">("Chuyển khoản");
  const [receiptNote, setReceiptNote] = useState<string>("");

  // Form tạo phiếu xuất kho
  const [exportQty, setExportQty] = useState<number>(0);
  const [exportReceiver, setExportReceiver] = useState<string>("");
  const [exportAddress, setExportAddress] = useState<string>("");

  if (!isOpen || !order) return null;

  const formatVND = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val) + " đ";
  };

  const currentCfg = STEP_CONFIG[order.step];

  // Chuyển bước tiếp theo
  const handleNextStep = () => {
    const steps: OrderStep[] = [
      "DRAFT",
      "WAITING_PSX",
      "PSX_ACCEPTED",
      "LSX_CREATED",
      "IN_PRODUCTION",
      "PRODUCED",
      "SHIPPED",
      "COMPLETED",
    ];
    const currentIndex = steps.indexOf(order.step);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];

      // Nếu chuẩn bị chuyển sang COMPLETED, kiểm tra điều kiện Ảnh 2
      if (nextStep === "COMPLETED") {
        if (order.debtAmount > 0) {
          alert(
            `⚠️ Không thể hoàn thành!\nTheo quy trình Ảnh 2: Đơn hàng vẫn còn công nợ ${formatVND(
              order.debtAmount
            )}.\nVui lòng thu đủ tiền trước khi kết thúc đơn hàng.`
          );
          return;
        }
        if (order.remainingQty > 0) {
          alert(
            `⚠️ Không thể hoàn thành!\nCòn ${order.remainingQty} sản phẩm chưa xuất giao.`
          );
          return;
        }
      }

      const updated: SalesOrder = { ...order, step: nextStep };

      // Khởi tạo LSX tự động nếu bước là LSX_CREATED
      if (nextStep === "LSX_CREATED" && !updated.productionOrder) {
        updated.productionOrder = {
          lsxCode: `LSX2510-${Math.floor(100 + Math.random() * 900)}`,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          machine: "Máy in Offset Komori Lithrone 4 màu",
          psxLead: updated.psxAssignedTo || "KTV Trần Văn Toàn",
          bomItems: [
            { materialName: "Giấy Couche 250gsm (79x109)", plannedQty: 3, unit: "Ram", status: "Đã xuất kho NVL" },
            { materialName: "Bản kẽm CTP nhiệt", plannedQty: 4, unit: "Tấm", status: "Đã xuất kho NVL" },
            { materialName: "Mực in Offset bốn màu", plannedQty: 2, unit: "Kg", status: "Đã xuất kho NVL" },
          ],
          steps: [
            { name: "Chế bản CTP", status: "done", assignee: "KTV Nguyễn Hữu" },
            { name: "In ấn kỹ thuật", status: "in_progress", assignee: "Thợ in Trần Văn Toàn" },
            { name: "Gia công thành phẩm", status: "pending", assignee: "Tổ gia công sau in" },
          ],
        };
      }

      onUpdateOrder(updated);
    }
  };

  // Tạo phiếu thu tiền (Nhánh A)
  const handleAddReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (receiptAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ!");
      return;
    }
    const newReceipt: ReceiptVoucher = {
      id: `REC-${Date.now()}`,
      code: `PT2510-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("vi-VN"),
      amount: receiptAmount,
      method: receiptMethod,
      recorded: true,
      note: receiptNote || `Thu tiền cho đơn hàng ${order.salesBillNumber}`,
    };

    const newPaid = order.paidAmount + receiptAmount;
    const newDebt = Math.max(0, order.totalAmount - newPaid);

    let nextStep = order.step;
    // Kiểm tra điều kiện tự động hoàn thành nếu đã xuất đủ và vừa thu đủ
    if (newDebt === 0 && order.remainingQty === 0 && order.step === "SHIPPED") {
      nextStep = "COMPLETED";
    }

    const updated: SalesOrder = {
      ...order,
      step: nextStep,
      receipts: [...order.receipts, newReceipt],
      paidAmount: newPaid,
      debtAmount: newDebt,
    };

    onUpdateOrder(updated);
    setReceiptAmount(0);
    setReceiptNote("");
    alert(`✓ Đã tạo thành công Phiếu thu ${newReceipt.code}!`);
  };

  // Tạo phiếu xuất kho (Nhánh B)
  const handleAddExport = (e: React.FormEvent) => {
    e.preventDefault();
    if (exportQty <= 0) {
      alert("Vui lòng nhập số lượng xuất hợp lệ!");
      return;
    }
    if (exportQty > order.remainingQty) {
      alert(`Số lượng xuất không được vượt quá số lượng còn lại (${order.remainingQty})!`);
      return;
    }

    const newExport: ExportVoucher = {
      id: `EXP-${Date.now()}`,
      code: `PXK2510-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString("vi-VN"),
      exportedQty: exportQty,
      receiver: exportReceiver || order.customer.name,
      address: exportAddress || order.customer.address,
      status: "Đã xuất hàng",
    };

    const newExportedQty = order.totalQtyExported + exportQty;
    const newRemaining = Math.max(0, order.totalQtyOrdered - newExportedQty);

    let nextStep = order.step;
    if (order.step === "PRODUCED") {
      nextStep = "SHIPPED";
    }
    // Nếu vừa xuất hết và công nợ đã bằng 0 -> Chuyển sang Hoàn thành
    if (newRemaining === 0 && order.debtAmount === 0 && (order.step === "PRODUCED" || order.step === "SHIPPED")) {
      nextStep = "COMPLETED";
    }

    const updated: SalesOrder = {
      ...order,
      step: nextStep,
      exports: [...order.exports, newExport],
      totalQtyExported: newExportedQty,
      remainingQty: newRemaining,
    };

    onUpdateOrder(updated);
    setExportQty(0);
    alert(`✓ Đã tạo thành công Phiếu xuất kho ${newExport.code}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 font-mono">
                  {order.salesBillNumber}
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${currentCfg.badgeBg} ${currentCfg.text}`}
                >
                  {currentCfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Khách hàng: <strong className="text-gray-800">{order.customer.name}</strong> • NV bán hàng: {order.salesRep}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.step !== "COMPLETED" && (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs transition"
              >
                <span>Chuyển bước kế tiếp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-5 py-3 bg-gray-100/70 border-b border-gray-200 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] text-xs">
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
              const steps: OrderStep[] = [
                "DRAFT",
                "WAITING_PSX",
                "PSX_ACCEPTED",
                "LSX_CREATED",
                "IN_PRODUCTION",
                "PRODUCED",
                "SHIPPED",
                "COMPLETED",
              ];
              const isPast = steps.indexOf(order.step) >= idx;
              const isCurrent = order.step === st;

              return (
                <div key={st} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCurrent
                          ? "bg-blue-600 text-white ring-2 ring-blue-300"
                          : isPast
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isPast && !isCurrent ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                        isCurrent
                          ? "text-blue-700 font-bold"
                          : isPast
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {idx < 7 && (
                    <div
                      className={`h-0.5 w-6 sm:w-8 -mt-3.5 ${
                        steps.indexOf(order.step) > idx ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-gray-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Tổng quan &amp; Sản phẩm in
          </button>
          <button
            onClick={() => setActiveTab("production")}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === "production"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Lệnh sản xuất &amp; BOM</span>
          </button>
          <button
            onClick={() => setActiveTab("finance")}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === "finance"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Thu tiền / Phiếu thu (Nhánh A)</span>
          </button>
          <button
            onClick={() => setActiveTab("export")}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1 ${
              activeTab === "export"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Xuất kho / Giao hàng (Nhánh B)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs">
              {/* Thẻ thông tin khách hàng & ngày giao */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <div className="font-semibold text-gray-700 mb-1">Thông tin khách hàng:</div>
                  <div className="text-gray-900 font-bold text-sm">{order.customer.name}</div>
                  <div className="text-gray-600 mt-0.5">SĐT: {order.customer.phone}</div>
                  <div className="text-gray-600">Địa chỉ: {order.customer.address}</div>
                  <div className="text-gray-500 text-[11px] mt-1">Nhóm: {order.customer.group}</div>

                  {/* Ảnh mẫu thiết kế của khách hàng */}
                  {(() => {
                    const matched = designTemplates.filter((t) =>
                      t.customerId
                        ? t.customerId === order.customer.id
                        : t.customerName === order.customer.name
                    );
                    if (matched.length === 0) {
                      return (
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-400">
                          <Palette className="w-3.5 h-3.5" />
                          <span>Chưa có mẫu thiết kế — thêm ở tab Mẫu thiết kế</span>
                        </div>
                      );
                    }
                    return (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 text-[11px] font-bold text-violet-700 mb-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span>Mẫu thiết kế của khách ({matched.length}):</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {matched.slice(0, 4).map((t) => {
                            const src =
                              t.previewUrl ||
                              resolveDesignPreview({
                                driveLink: t.driveLink,
                                uploadedImageUrl: t.uploadedImageUrl,
                              });
                            return (
                              <button
                                key={t.id}
                                onClick={() => src && setPreviewTemplateId(t.id)}
                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-violet-200 bg-violet-50 hover:border-violet-500 hover:shadow-md transition cursor-pointer group/thumb"
                                title={`${t.name} — bấm để xem lớn`}
                              >
                                {src ? (
                                  <img
                                    src={src}
                                    alt={t.name}
                                    className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <span className="w-full h-full flex items-center justify-center text-violet-300">
                                    <ImageIcon className="w-5 h-5" />
                                  </span>
                                )}
                              </button>
                            );
                          })}
                          {matched.length > 4 && (
                            <span className="w-16 h-16 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold flex items-center justify-center">
                              +{matched.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div>
                  <div className="font-semibold text-gray-700 mb-1">Thông tin đơn hàng:</div>
                  <div className="text-gray-600">Số phiếu bán: <strong>{order.salesBillNumber}</strong></div>
                  <div className="text-gray-600">Ngày đặt hàng: {order.orderDate}</div>
                  <div className="text-gray-600">Ngày hẹn giao: <strong className="text-blue-700">{order.deliveryDate}</strong></div>
                  <div className="text-gray-600">Nhân viên bán hàng: {order.salesRep}</div>
                  <div className="text-gray-600">Phụ trách PSX: <strong>{order.psxAssignedTo || "Chưa gán"}</strong></div>
                </div>
              </div>

              {/* Bảng chi tiết sản phẩm in */}
              <div>
                <div className="font-bold text-gray-800 text-sm mb-2">
                  Danh sách sản phẩm in ấn (Quy cách kỹ thuật)
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Mã SP</th>
                        <th className="p-2.5">Tên sản phẩm &amp; Quy cách</th>
                        <th className="p-2.5">Kích thước</th>
                        <th className="p-2.5">Phương pháp in</th>
                        <th className="p-2.5 text-right">SL</th>
                        <th className="p-2.5 text-right">Đơn giá</th>
                        <th className="p-2.5 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-2.5 font-mono font-medium text-blue-600">{item.code}</td>
                          <td className="p-2.5">
                            <div className="font-bold text-gray-900">{item.name}</div>
                            <div className="text-gray-500 text-[11px]">
                              {item.paperType} • {item.printSides}
                            </div>
                            {item.finishing.length > 0 && (
                              <div className="text-amber-700 text-[10px] mt-0.5">
                                Gia công: {item.finishing.join(", ")}
                              </div>
                            )}
                            {item.fileAttached && (
                              <div className="flex items-center gap-1 text-emerald-700 text-[11px] mt-1 font-medium">
                                <Paperclip className="w-3 h-3 text-emerald-600" />
                                <span>{item.fileAttached}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-2.5 text-gray-700">{item.dimensions}</td>
                          <td className="p-2.5 text-gray-700">{item.printMethod}</td>
                          <td className="p-2.5 text-right font-bold text-gray-900">
                            {item.quantity.toLocaleString("vi-VN")} {item.unit}
                          </td>
                          <td className="p-2.5 text-right text-gray-700">{formatVND(item.unitPrice)}</td>
                          <td className="p-2.5 text-right font-bold text-gray-900">{formatVND(item.totalPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tóm tắt thanh toán */}
              <div className="flex justify-end">
                <div className="w-72 bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng tiền:</span>
                    <span>{formatVND(order.subTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giảm giá:</span>
                    <span>{formatVND(order.discount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (10%):</span>
                    <span>{formatVND(order.vat)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-200 text-sm">
                    <span>Thành tiền:</span>
                    <span className="text-blue-700">{formatVND(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700 pt-1">
                    <span>Đã thu:</span>
                    <span>{formatVND(order.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-red-600">
                    <span>Còn nợ:</span>
                    <span>{formatVND(order.debtAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LỆNH SẢN XUẤT & BOM */}
          {activeTab === "production" && (
            <div className="space-y-4 text-xs">
              {order.productionOrder ? (
                <>
                  <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sky-900 text-sm">
                        Lệnh Sản Xuất: {order.productionOrder.lsxCode}
                      </div>
                      <div className="text-sky-700 mt-0.5">
                        Máy in chỉ định: <strong>{order.productionOrder.machine}</strong> • Phụ trách: {order.productionOrder.psxLead}
                      </div>
                    </div>
                    <span className="bg-sky-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                      Đã duyệt LSX
                    </span>
                  </div>

                  {/* Bảng BOM Định mức NVL */}
                  <div>
                    <div className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-violet-600" />
                      <span>Định mức Nguyên vật liệu (BOM)</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                          <tr>
                            <th className="p-2.5">Tên vật tư / Quy cách</th>
                            <th className="p-2.5 text-right">Số lượng định mức</th>
                            <th className="p-2.5">Đơn vị</th>
                            <th className="p-2.5">Trạng thái cấp phát</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {order.productionOrder.bomItems.map((bom, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2.5 font-medium text-gray-900">{bom.materialName}</td>
                              <td className="p-2.5 text-right font-bold text-gray-800">{bom.plannedQty}</td>
                              <td className="p-2.5 text-gray-600">{bom.unit}</td>
                              <td className="p-2.5">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                                  {bom.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tiến độ công đoạn */}
                  <div>
                    <div className="font-bold text-gray-800 text-sm mb-2">
                      Tiến độ thực hiện công đoạn
                    </div>
                    <div className="space-y-2">
                      {order.productionOrder.steps.map((st, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                st.status === "done"
                                  ? "bg-emerald-500"
                                  : st.status === "in_progress"
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span className="font-semibold text-gray-800">{st.name}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-500">{st.assignee}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              st.status === "done"
                                ? "bg-emerald-100 text-emerald-800"
                                : st.status === "in_progress"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {st.status === "done"
                              ? "Hoàn tất"
                              : st.status === "in_progress"
                              ? "Đang chạy máy"
                              : "Chờ đến lượt"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <Cpu className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">Đơn hàng chưa phát sinh Lệnh Sản Xuất.</p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Cần chuyển trạng thái đơn hàng sang &quot;PSX đã tiếp nhận&quot; và bấm sinh LSX.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THU TIỀN / PHIẾU THU (Nhánh A trong Ảnh 2) */}
          {activeTab === "finance" && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-emerald-900 text-sm">
                    Nhánh A: Quản lý Thu tiền &amp; Công nợ
                  </div>
                  <div className="text-emerald-700 text-[11px] mt-0.5">
                    Ghi nhận phiếu thu đã ghi số, tự động cập nhật &quot;Đã thu&quot; và &quot;Công nợ&quot;.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-[11px]">Còn nợ đơn này:</div>
                  <div className="text-base font-bold text-red-600">
                    {formatVND(order.debtAmount)}
                  </div>
                </div>
              </div>

              {/* Form tạo phiếu thu mới nếu còn nợ */}
              {order.debtAmount > 0 && (
                <form
                  onSubmit={handleAddReceipt}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="font-bold text-gray-800">Tạo Phiếu Thu Mới (Ghi sổ)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Số tiền thu (VNĐ):</label>
                      <input
                        type="number"
                        value={receiptAmount || ""}
                        onChange={(e) => setReceiptAmount(Number(e.target.value))}
                        placeholder={order.debtAmount.toString()}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Hình thức:</label>
                      <select
                        value={receiptMethod}
                        onChange={(e) => setReceiptMethod(e.target.value as any)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      >
                        <option value="Chuyển khoản">Chuyển khoản</option>
                        <option value="Tiền mặt">Tiền mặt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Ghi chú phiếu thu:</label>
                      <input
                        type="text"
                        value={receiptNote}
                        onChange={(e) => setReceiptNote(e.target.value)}
                        placeholder="VD: Thu cọc 50%, Thu thanh toán hết..."
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-2xs transition"
                    >
                      + Ghi nhận phiếu thu
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách phiếu thu đã ghi sổ */}
              <div>
                <div className="font-bold text-gray-800 mb-2">Các phiếu thu đã ghi sổ</div>
                {order.receipts.length === 0 ? (
                  <p className="text-gray-400 italic">Chưa có phiếu thu nào được ghi sổ cho đơn này.</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="p-2.5">Số phiếu thu</th>
                          <th className="p-2.5">Ngày thu</th>
                          <th className="p-2.5">Hình thức</th>
                          <th className="p-2.5 text-right">Số tiền</th>
                          <th className="p-2.5">Ghi chú</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.receipts.map((r) => (
                          <tr key={r.id} className="hover:bg-gray-50">
                            <td className="p-2.5 font-mono font-bold text-emerald-700">{r.code}</td>
                            <td className="p-2.5 text-gray-600">{r.date}</td>
                            <td className="p-2.5 text-gray-700">{r.method}</td>
                            <td className="p-2.5 text-right font-bold text-gray-900">{formatVND(r.amount)}</td>
                            <td className="p-2.5 text-gray-600">{r.note || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: XUẤT KHO / GIAO HÀNG (Nhánh B trong Ảnh 2) */}
          {activeTab === "export" && (
            <div className="space-y-4 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-blue-900 text-sm">
                    Nhánh B: Quản lý Xuất kho &amp; Giao hàng
                  </div>
                  <div className="text-blue-700 text-[11px] mt-0.5">
                    Tạo phiếu xuất kho, cập nhật Đã xuất vs Còn lại trong kho.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-[11px]">Còn lại chưa xuất:</div>
                  <div className="text-base font-bold text-amber-700">
                    {order.remainingQty} sản phẩm
                  </div>
                </div>
              </div>

              {/* Form tạo phiếu xuất mới nếu còn hàng trong kho */}
              {order.remainingQty > 0 && (
                <form
                  onSubmit={handleAddExport}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3"
                >
                  <div className="font-bold text-gray-800">Tạo Phiếu Xuất Kho Mới</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Số lượng xuất:</label>
                      <input
                        type="number"
                        value={exportQty || ""}
                        onChange={(e) => setExportQty(Number(e.target.value))}
                        placeholder={`Tối đa: ${order.remainingQty}`}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Người nhận hàng:</label>
                      <input
                        type="text"
                        value={exportReceiver}
                        onChange={(e) => setExportReceiver(e.target.value)}
                        placeholder={order.customer.name}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Địa chỉ giao hàng:</label>
                      <input
                        type="text"
                        value={exportAddress}
                        onChange={(e) => setExportAddress(e.target.value)}
                        placeholder={order.customer.address}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md shadow-2xs transition"
                    >
                      + Tạo Phiếu Xuất Kho
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách phiếu xuất kho */}
              <div>
                <div className="font-bold text-gray-800 mb-2">Các phiếu xuất kho đã lập</div>
                {order.exports.length === 0 ? (
                  <p className="text-gray-400 italic">Chưa có phiếu xuất kho nào cho đơn hàng này.</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                        <tr>
                          <th className="p-2.5">Mã phiếu xuất</th>
                          <th className="p-2.5">Ngày xuất</th>
                          <th className="p-2.5 text-right">SL xuất</th>
                          <th className="p-2.5">Người nhận</th>
                          <th className="p-2.5">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {order.exports.map((exp) => (
                          <tr key={exp.id} className="hover:bg-gray-50">
                            <td className="p-2.5 font-mono font-bold text-blue-700">{exp.code}</td>
                            <td className="p-2.5 text-gray-600">{exp.date}</td>
                            <td className="p-2.5 text-right font-bold text-gray-900">{exp.exportedQty}</td>
                            <td className="p-2.5 text-gray-700">{exp.receiver}</td>
                            <td className="p-2.5">
                              <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                                {exp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Trạng thái hiện tại: <strong>{currentCfg.label}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs rounded-lg transition"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Lightbox: ảnh mẫu thiết kế của khách */}
      {previewTemplateId &&
        (() => {
          const t = designTemplates.find((x) => x.id === previewTemplateId);
          if (!t) return null;
          const src =
            t.previewUrl ||
            resolveDesignPreview({
              driveLink: t.driveLink,
              uploadedImageUrl: t.uploadedImageUrl,
            });
          return (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
              onClick={() => setPreviewTemplateId(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{t.name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {t.customerName || "Mẫu chung"} • {t.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.driveLink && (
                      <a
                        href={t.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Mở Drive gốc
                      </a>
                    )}
                    <button
                      onClick={() => setPreviewTemplateId(null)}
                      className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-auto">
                  {src ? (
                    <img
                      src={src}
                      alt={t.name}
                      className="max-w-full max-h-[70vh] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <p className="text-slate-400 text-sm p-10">Không có ảnh preview cho mẫu này.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
