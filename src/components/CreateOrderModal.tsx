"use client";

import React, { useState } from "react";
import { SalesOrder, PrintItem, Customer } from "@/types";
import { X, Plus, Trash2, Upload, Printer, CheckCircle } from "lucide-react";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (newOrder: SalesOrder) => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onCreateOrder,
}) => {
  // Customer info
  const [customerName, setCustomerName] = useState("");
  const [customerGroup, setCustomerGroup] = useState("Nhóm khách hàng vãng lai");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [salesRep, setSalesRep] = useState("Nguyễn Thành Khôi");
  const [deliveryDate, setDeliveryDate] = useState("");

  // Product item specs
  const [productCode, setProductCode] = useState("SP-IN-850");
  const [productName, setProductName] = useState("");
  const [dimensions, setDimensions] = useState("210 x 297 mm (A4)");
  const [paperType, setPaperType] = useState("Giấy Couche 300gsm");
  const [printMethod, setPrintMethod] = useState<"In nhanh kỹ thuật số" | "In offset 4 màu">("In offset 4 màu");
  const [printSides, setPrintSides] = useState<"1 mặt" | "2 mặt">("2 mặt");
  const [finishing, setFinishing] = useState("Cán màng mờ, Bế Demi");
  const [quantity, setQuantity] = useState<number>(1000);
  const [unit, setUnit] = useState("Cuốn");
  const [unitPrice, setUnitPrice] = useState<number>(1500);
  const [fileName, setFileName] = useState("thiet_ke_in_an_final.pdf");

  // Initial step: Lưu nháp hoặc Chờ PSX tiếp nhận
  const [initialStep, setInitialStep] = useState<"DRAFT" | "WAITING_PSX">("WAITING_PSX");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !productName.trim() || quantity <= 0 || unitPrice <= 0) {
      alert("Vui lòng điền đầy đủ thông tin khách hàng, tên sản phẩm, số lượng và đơn giá!");
      return;
    }

    const subTotal = quantity * unitPrice;
    const vat = Math.round(subTotal * 0.1);
    const totalAmount = subTotal + vat;

    const newPrintItem: PrintItem = {
      id: `ITEM-${Date.now()}`,
      code: productCode,
      name: productName,
      dimensions,
      paperType,
      printMethod,
      printSides,
      finishing: finishing ? finishing.split(",").map((s) => s.trim()) : [],
      quantity,
      unit,
      unitPrice,
      totalPrice: subTotal,
      fileAttached: fileName,
      fileApproved: true,
    };

    const newCustomer: Customer = {
      id: `KH-${Date.now()}`,
      name: customerName,
      group: customerGroup,
      phone: customerPhone || "0900 000 000",
      address: customerAddress || "Hà Nội",
    };

    const billNumber = `BH2510${String(new Date().getDate()).padStart(2, "0")}-${String(
      Math.floor(10 + Math.random() * 90)
    )}`;

    const newOrder: SalesOrder = {
      id: `DH-${Date.now()}`,
      salesBillNumber: billNumber,
      orderDate: new Date().toLocaleDateString("vi-VN"),
      deliveryDate: deliveryDate || new Date(Date.now() + 5 * 86400000).toLocaleDateString("vi-VN"),
      customer: newCustomer,
      salesRep,
      step: initialStep,
      items: [newPrintItem],
      subTotal,
      discount: 0,
      vat,
      totalAmount,
      receipts: [],
      exports: [],
      paidAmount: 0,
      debtAmount: totalAmount,
      totalQtyOrdered: quantity,
      totalQtyExported: 0,
      remainingQty: quantity,
    };

    onCreateOrder(newOrder);
    onClose();
    alert(`✓ Đã tạo thành công Đơn đặt hàng in ấn số ${newOrder.salesBillNumber}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-gray-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-blue-200" />
            <div>
              <h3 className="text-base font-bold text-white">
                Bước 1 &amp; 2: Tiếp nhận &amp; Khai báo Đơn đặt hàng in ấn
              </h3>
              <p className="text-xs text-blue-100">
                Theo đúng sơ đồ quy trình chuyên sâu từ Ảnh 2
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* PHẦN 1: THÔNG TIN KHÁCH HÀNG & BÁN HÀNG */}
          <div>
            <div className="font-bold text-gray-800 text-sm mb-2 pb-1 border-b border-gray-200 flex items-center justify-between">
              <span>1. Thông tin khách hàng &amp; Giao dịch</span>
              <span className="text-[11px] text-gray-500 font-normal">
                Bắt buộc nhập đủ thông tin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Tên Khách hàng / Công ty: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty TNHH ABC"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nhóm khách hàng:
                </label>
                <select
                  value={customerGroup}
                  onChange={(e) => setCustomerGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="Nhóm khách hàng vãng lai">Nhóm khách hàng vãng lai</option>
                  <option value="Khách hàng doanh nghiệp">Khách hàng doanh nghiệp</option>
                  <option value="Khách hàng đại lý">Khách hàng đại lý</option>
                  <option value="Khách hàng thân thiết">Khách hàng thân thiết</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Số điện thoại:
                </label>
                <input
                  type="text"
                  placeholder="VD: 0912 345 678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Địa chỉ giao hàng:
                </label>
                <input
                  type="text"
                  placeholder="VD: Số 123 phố Cầu Giấy, Hà Nội"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nhân viên bán hàng:
                </label>
                <select
                  value={salesRep}
                  onChange={(e) => setSalesRep(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="Nguyễn Thành Khôi">Nguyễn Thành Khôi</option>
                  <option value="Nhân viên Bán hàng">Nhân viên Bán hàng</option>
                  <option value="Trần Thị Lan">Trần Thị Lan</option>
                  <option value="Lê Văn Hoàng">Lê Văn Hoàng</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Ngày hẹn giao:
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* PHẦN 2: KHAI BÁO SẢN PHẨM & QUY CÁCH KỸ THUẬT IN */}
          <div>
            <div className="font-bold text-gray-800 text-sm mb-2 pb-1 border-b border-gray-200 flex items-center justify-between">
              <span>2. Khai báo sản phẩm &amp; Quy cách in (Ảnh 2)</span>
              <span className="text-amber-700 font-medium text-[11px]">
                Sản phẩm cũ: bắt buộc có mã SP
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mã sản phẩm:
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  className="w-full font-mono border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  Tên sản phẩm in: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Catalogue giới thiệu sản phẩm A4 16 trang"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Kích thước (Dài x Rộng):
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Chất liệu / Loại giấy:
                </label>
                <input
                  type="text"
                  value={paperType}
                  onChange={(e) => setPaperType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Kỹ thuật in:
                </label>
                <select
                  value={printMethod}
                  onChange={(e) => setPrintMethod(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="In offset 4 màu">In offset 4 màu</option>
                  <option value="In nhanh kỹ thuật số">In nhanh kỹ thuật số</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Mặt in:
                </label>
                <select
                  value={printSides}
                  onChange={(e) => setPrintSides(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden bg-white"
                >
                  <option value="2 mặt">2 mặt</option>
                  <option value="1 mặt">1 mặt</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  Gia công sau in:
                </label>
                <input
                  type="text"
                  value={finishing}
                  onChange={(e) => setFinishing(e.target.value)}
                  placeholder="Cán màng mờ, Ép kim, Bế demi..."
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">
                  File thiết kế đính kèm:
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Số lượng: *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Đơn vị tính:
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Đơn giá (VNĐ): *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 focus:border-blue-500 focus:outline-hidden font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Thành tiền tạm tính:
                </label>
                <div className="py-2 px-2.5 bg-gray-100 rounded-md font-bold text-gray-900">
                  {new Intl.NumberFormat("vi-VN").format(quantity * unitPrice)} đ
                </div>
              </div>
            </div>
          </div>

          {/* CHỌN TRẠNG THÁI KHỞI TẠO THEO ẢNH 2 */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="font-bold text-amber-900">Trạng thái tiếp nhận ban đầu:</div>
              <div className="text-amber-800 text-[11px]">
                Chọn &quot;Lưu nháp&quot; nếu cần chỉnh sửa thêm hoặc &quot;Chờ PSX tiếp nhận&quot; để chuyển phòng sản xuất.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="initialStep"
                  checked={initialStep === "DRAFT"}
                  onChange={() => setInitialStep("DRAFT")}
                />
                <span>Lưu nháp</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-800 font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="initialStep"
                  checked={initialStep === "WAITING_PSX"}
                  onChange={() => setInitialStep("WAITING_PSX")}
                />
                <span className="text-blue-700">Chờ PSX tiếp nhận (Khuyên dùng)</span>
              </label>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md font-medium transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold shadow-xs transition"
            >
              Hoàn tất tạo đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
