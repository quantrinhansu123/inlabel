"use client";

import React, { useState, useEffect } from "react";
import { Users, Building2, Phone, Mail, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { Customer } from "@/types";

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCustomer: (customer: Customer) => void;
  editingCustomer?: Customer | null;
  onUpdateCustomer?: (customer: Customer) => void;
}

export const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onCreateCustomer,
  editingCustomer,
  onUpdateCustomer,
}) => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("Khách hàng doanh nghiệp");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [notes, setNotes] = useState("");

  const isEditing = !!editingCustomer;

  // Nạp dữ liệu khi mở modal sửa, reset khi mở modal thêm
  useEffect(() => {
    if (isOpen && editingCustomer) {
      setName(editingCustomer.name || "");
      setGroup(editingCustomer.group || "Khách hàng doanh nghiệp");
      setPhone(editingCustomer.phone || "");
      setAddress(editingCustomer.address || "");
      setTaxCode(editingCustomer.taxCode || "");
      setEmail(editingCustomer.email || "");
      setContactPerson(editingCustomer.contactPerson || "");
      setNotes(editingCustomer.notes || "");
    } else if (isOpen && !editingCustomer) {
      setName("");
      setGroup("Khách hàng doanh nghiệp");
      setPhone("");
      setAddress("");
      setTaxCode("");
      setEmail("");
      setContactPerson("");
      setNotes("");
    }
  }, [isOpen, editingCustomer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ Tên khách hàng, Số điện thoại và Địa chỉ!");
      return;
    }

    // Chế độ sửa: giữ id, ngày tạo, số liệu tích lũy
    if (isEditing && editingCustomer) {
      const updated: Customer = {
        ...editingCustomer,
        name: name.trim(),
        group,
        phone: phone.trim(),
        address: address.trim(),
        taxCode: taxCode.trim() || undefined,
        email: email.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      onUpdateCustomer?.(updated);
      onClose();
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const newCustomer: Customer = {
      id: `KH-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      group,
      phone: phone.trim(),
      address: address.trim(),
      taxCode: taxCode.trim() || undefined,
      email: email.trim() || undefined,
      contactPerson: contactPerson.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: dateStr,
      totalOrders: 0,
      totalRevenue: 0,
    };

    onCreateCustomer(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isEditing ? "Sửa Hồ Sơ Khách Hàng" : "Thêm Hồ Sơ Khách Hàng Mới"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Lưu trữ thông tin xuất hóa đơn, địa chỉ giao hàng và công nợ
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Tên công ty / Khách hàng *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Công ty TNHH Bao Bì Á Đông"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Phân nhóm khách hàng
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                <option value="Khách hàng doanh nghiệp">Khách hàng doanh nghiệp</option>
                <option value="Khách hàng startup">Khách hàng startup</option>
                <option value="Nhóm khách hàng vãng lai">Nhóm khách hàng vãng lai</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Số điện thoại liên hệ *
              </label>
              <input
                type="text"
                placeholder="0912 xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Địa chỉ trụ sở / Giao hàng *
            </label>
            <input
              type="text"
              placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Mã số thuế (nếu có)
              </label>
              <input
                type="text"
                placeholder="010xxxxxxx"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Email nhận hóa đơn &amp; file test
              </label>
              <input
                type="email"
                placeholder="ketoan@congty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Người đại diện / Phụ trách liên hệ
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Chị Trần Mai Linh (Trưởng phòng Thu mua)"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Ghi chú công nợ / Yêu cầu in ấn đặc thù
            </label>
            <textarea
              rows={2}
              placeholder="Hạn thanh toán 15 ngày kể từ ngày giao hàng, luôn gửi mẫu proof..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
            />
          </div>

          {/* Buttons */}
          <div className="p-4 -mx-5 -mb-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              {isEditing ? "Lưu Thay Đổi" : "Lưu Khách Hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
