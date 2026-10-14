"use client";

import React, { useState } from "react";
import { Receipt, Wallet } from "lucide-react";
import { PaymentVoucher, PaymentCategory, FundAccount } from "@/types";

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (v: PaymentVoucher) => void;
  accounts: FundAccount[];
}

const CATEGORIES: PaymentCategory[] = [
  "Mua NVL",
  "Lương nhân sự",
  "Điện nước",
  "Thuê mặt bằng",
  "Gia công ngoài",
  "Vận chuyển",
  "Bảo trì máy",
  "Khác",
];

function todayStr() {
  const t = new Date();
  return `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  accounts,
}) => {
  const [receiver, setReceiver] = useState("");
  const [category, setCategory] = useState<PaymentCategory>("Mua NVL");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"Chuyển khoản" | "Tiền mặt">("Chuyển khoản");
  const [accountName, setAccountName] = useState("");
  const [relatedBill, setRelatedBill] = useState("");
  const [note, setNote] = useState("");

  if (!isOpen) return null;

  const effectiveAccount = accountName || accounts[0]?.name || "Quỹ tiền mặt";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver.trim()) {
      alert("Vui lòng nhập Người nhận / Nhà cung cấp!");
      return;
    }
    if (!amount || amount <= 0) {
      alert("Vui lòng nhập Số tiền chi hợp lệ!");
      return;
    }
    const v: PaymentVoucher = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      code: `PC2510-${Math.floor(100 + Math.random() * 900)}`,
      date: todayStr(),
      amount: Math.round(amount),
      method,
      category,
      receiver: receiver.trim(),
      accountName: effectiveAccount,
      relatedBill: relatedBill.trim() || undefined,
      note: note.trim() || undefined,
      recorded: true,
      createdBy: "Quản trị viên",
    };
    onCreate(v);
    setReceiver("");
    setCategory("Mua NVL");
    setAmount(0);
    setMethod("Chuyển khoản");
    setAccountName("");
    setRelatedBill("");
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Lập Phiếu Chi Mới</h3>
              <p className="text-[11px] text-slate-500">Ghi sổ quỹ tiền mặt / chuyển khoản chi ra</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Người nhận / Nhà cung cấp *
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Công ty Giấy Tân Mai"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Khoản mục chi
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PaymentCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600 font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Hình thức
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as "Chuyển khoản" | "Tiền mặt")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600 font-medium"
              >
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="Tiền mặt">Tiền mặt</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Chi từ tài khoản
            </label>
            <select
              value={effectiveAccount}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600 font-medium"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}{a.type === "BANK" && a.accountNumber ? ` — ${a.accountNumber}` : " (tiền mặt)"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Số tiền chi (VNĐ) *
            </label>
            <input
              type="number"
              min="1"
              placeholder="Ví dụ: 5000000"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-rose-600"
              required
            />
            {amount > 0 && (
              <p className="mt-1 text-[11px] font-semibold text-rose-600">
                = {new Intl.NumberFormat("vi-VN").format(amount)} đ
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Phiếu bán / LSX liên quan (nếu có)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: BH251010-004 / LSX2510-002"
              value={relatedBill}
              onChange={(e) => setRelatedBill(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Diễn giải / Ghi chú
            </label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Thanh toán tiền giấy tháng 10..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-rose-600"
            />
          </div>

          <div className="p-4 -mx-5 -mb-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm shadow-rose-600/20 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Receipt className="w-3.5 h-3.5" /> Lưu Phiếu Chi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
