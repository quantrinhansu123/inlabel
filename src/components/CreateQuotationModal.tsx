"use client";

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Calculator,
  User,
  Phone,
  Building2,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { Quotation, PrintItem } from "@/types";

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuotation: (quotation: Quotation) => void;
}

export const CreateQuotationModal: React.FC<CreateQuotationModalProps> = ({
  isOpen,
  onClose,
  onCreateQuotation,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [salesRep, setSalesRep] = useState("Nguyễn Thành Khôi");
  const [validDays, setValidDays] = useState(10);
  const [discount, setDiscount] = useState(0);
  const [vatRate, setVatRate] = useState(0.08); // 8% VAT
  const [notes, setNotes] = useState("");

  // Danh sách sản phẩm in
  const [items, setItems] = useState<
    Array<{
      name: string;
      dimensions: string;
      paperType: string;
      printMethod: "In nhanh kỹ thuật số" | "In offset 4 màu";
      printSides: "1 mặt" | "2 mặt";
      finishing: string[];
      quantity: number;
      unit: string;
      unitPrice: number;
    }>
  >([
    {
      name: "Catalogue giới thiệu sản phẩm A4",
      dimensions: "210 x 297 mm",
      paperType: "Bìa C300 cán màng mờ, Ruột C150 16 trang",
      printMethod: "In offset 4 màu",
      printSides: "2 mặt",
      finishing: ["Cán màng mờ bìa", "Bấm ghim lồng"],
      quantity: 1000,
      unit: "Cuốn",
      unitPrice: 14500,
    },
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "Ấn phẩm in mới",
        dimensions: "A4 (210 x 297 mm)",
        paperType: "Couche 250gsm",
        printMethod: "In offset 4 màu",
        printSides: "2 mặt",
        finishing: ["Cán màng nhiệt mờ"],
        quantity: 1000,
        unit: "Cái",
        unitPrice: 2500,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Tính toán tiền
  const subTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const afterDiscount = Math.max(0, subTotal - (Number(discount) || 0));
  const vat = Math.round(afterDiscount * vatRate);
  const totalAmount = afterDiscount + vat;

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const handleSubmit = (status: "DRAFT" | "SENT") => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Vui lòng nhập tên khách hàng và số điện thoại!");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const validUntilDate = new Date();
    validUntilDate.setDate(today.getDate() + validDays);
    const validStr = `${validUntilDate.getDate()}/${validUntilDate.getMonth() + 1}/${validUntilDate.getFullYear()}`;

    const newQuotation: Quotation = {
      id: `BG-${Date.now().toString().slice(-4)}`,
      quotationNumber: `BG2510-${Math.floor(100 + Math.random() * 900)}`,
      date: dateStr,
      validUntil: validStr,
      customerName,
      customerPhone,
      customerCompany,
      salesRep,
      status: status,
      items: items.map((it, idx) => ({
        id: `BG-ITM-${idx}-${Date.now()}`,
        code: `SP-${idx + 1}`,
        name: it.name,
        dimensions: it.dimensions,
        paperType: it.paperType,
        printMethod: it.printMethod,
        printSides: it.printSides,
        finishing: it.finishing,
        quantity: Number(it.quantity) || 1,
        unit: it.unit,
        unitPrice: Number(it.unitPrice) || 0,
        totalPrice: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        fileApproved: false,
      })),
      subTotal,
      discount: Number(discount) || 0,
      vat,
      totalAmount,
      notes,
    };

    onCreateQuotation(newQuotation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Khởi Tạo Báo Giá In Ấn Mới
              </h3>
              <p className="text-[11px] text-slate-500">
                Bước khởi đầu quy trình (START): Tính giá chi phí &amp; gửi duyệt cho khách hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* 1. THÔNG TIN KHÁCH HÀNG */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
              <User className="w-3.5 h-3.5" />
              1. Thông tin khách hàng &amp; Người liên hệ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tên khách hàng / Người nhận *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Anh Hoàng Tuấn"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Số điện thoại liên hệ *
                </label>
                <input
                  type="text"
                  placeholder="0912 xxx xxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tên công ty / Đơn vị
                </label>
                <input
                  type="text"
                  placeholder="Tập đoàn Vingroup..."
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nhân viên kinh doanh phụ trách
                </label>
                <input
                  type="text"
                  value={salesRep}
                  onChange={(e) => setSalesRep(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Thời hạn hiệu lực báo giá (Số ngày)
                </label>
                <input
                  type="number"
                  value={validDays}
                  onChange={(e) => setValidDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* 2. CHI TIẾT SẢN PHẨM & TÍNH GIÁ IN ẤN */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                <Layers className="w-3.5 h-3.5" />
                2. Quy cách in ấn &amp; Bảng tính đơn giá
              </h4>
              <button
                type="button"
                onClick={addItem}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm sản phẩm in
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      Sản phẩm #{index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Tên sản phẩm in
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Kích thước (Dài x Rộng)
                      </label>
                      <input
                        type="text"
                        value={item.dimensions}
                        onChange={(e) => updateItem(index, "dimensions", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Chất liệu giấy
                      </label>
                      <input
                        type="text"
                        value={item.paperType}
                        onChange={(e) => updateItem(index, "paperType", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Công nghệ in
                      </label>
                      <select
                        value={item.printMethod}
                        onChange={(e) => updateItem(index, "printMethod", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      >
                        <option value="In offset 4 màu">In offset 4 màu (Số lượng lớn)</option>
                        <option value="In nhanh kỹ thuật số">In nhanh kỹ thuật số (Lấy gấp)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Số mặt in
                      </label>
                      <select
                        value={item.printSides}
                        onChange={(e) => updateItem(index, "printSides", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      >
                        <option value="2 mặt">In 2 mặt</option>
                        <option value="1 mặt">In 1 mặt</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 items-end">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Số lượng in
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Đơn vị tính
                      </label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(index, "unit", e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-0.5">
                        Đơn giá (đ/{item.unit})
                      </label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-indigo-600"
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500">Thành tiền</div>
                      <div className="font-bold text-indigo-600 text-xs mt-1">
                        {formatVND((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. TỔNG CỘNG & ĐIỀU KHOẢN */}
          <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Ghi chú / Điều khoản giao hàng
              </label>
              <textarea
                rows={3}
                placeholder="Ví dụ: Giao hàng miễn phí nội thành, tạm ứng 50% khi duyệt mẫu in test..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-bold text-slate-900">{formatVND(subTotal)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Chiết khấu giảm giá:</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-28 text-right px-2 py-1 bg-white border border-slate-200 rounded-md font-semibold text-emerald-600 text-xs"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Thuế GTGT (VAT):</span>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold"
                >
                  <option value={0}>0%</option>
                  <option value={0.08}>8%</option>
                  <option value={0.1}>10%</option>
                </select>
              </div>

              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                <span>Tổng cộng thanh toán:</span>
                <span className="text-indigo-600 text-base">{formatVND(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Hủy bỏ
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit("DRAFT")}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Lưu bản nháp
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("SENT")}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              Lưu &amp; Gửi Báo Giá Cho Khách
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
