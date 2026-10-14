"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Building2, Tag, Target, Sparkles, DollarSign } from "lucide-react";
import { Lead, LeadSource, LeadStatus } from "@/types";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateLead: (lead: Lead) => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onCreateLead,
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState<LeadSource>("Website");
  const [status, setStatus] = useState<LeadStatus>("NEW");
  const [assignedTo, setAssignedTo] = useState("Nguyễn Thành Khôi");
  const [estimatedValue, setEstimatedValue] = useState<number>(5000000);
  const [tagInput, setTagInput] = useState("In offset, Catalogue");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Vui lòng nhập tên người liên hệ và số điện thoại!");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    const newLead: Lead = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      company: company.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      source,
      status,
      assignedTo,
      estimatedValue: Number(estimatedValue) || 0,
      createdAt: dateStr,
      lastContactAt: "Hôm nay",
      tags: tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      note: note.trim() || undefined,
    };

    onCreateLead(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Thêm Lead Khách Hàng Tiềm Năng Mới
              </h3>
              <p className="text-[11px] text-slate-500">
                Ghi nhận cơ hội bán hàng &amp; nhu cầu in ấn từ các nguồn marketing
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tên người liên hệ *
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Anh Nguyễn Văn An"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Số điện thoại *
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tên công ty / Tổ chức
              </label>
              <input
                type="text"
                placeholder="Công ty CP In ấn Ánh Sao"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="contact@company.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nguồn Lead
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                <option value="Website">Website</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="Zalo">Zalo OA</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Giới thiệu">Khách hàng giới thiệu</option>
                <option value="Telesales">Telesales</option>
                <option value="Triển lãm">Triển lãm / Hội chợ</option>
                <option value="Khác">Nguồn khác</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Trạng thái tiếp nhận
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                <option value="NEW">Mới tiếp nhận</option>
                <option value="CONTACTED">Đã liên hệ</option>
                <option value="QUALIFIED">Đủ điều kiện</option>
                <option value="PROPOSAL">Đang báo giá</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Giá trị dự kiến (VNĐ)
              </label>
              <input
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:bg-white focus:outline-indigo-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Chuyên viên phụ trách
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Phân loại ấn phẩm (Tags, cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              placeholder="In offset, Hộp cứng, Túi giấy..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nhu cầu chi tiết / Ghi chú
            </label>
            <textarea
              rows={2}
              placeholder="Khách cần in gấp 2.000 cuốn brochure trước thứ 6..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              Tạo Lead Mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
