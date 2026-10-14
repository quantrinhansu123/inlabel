"use client";

import React, { useState, useEffect } from "react";
import { Landmark } from "lucide-react";
import { FundAccount } from "@/types";

interface FundAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (a: FundAccount) => void;
  editingAccount?: FundAccount | null;
  onUpdate?: (a: FundAccount) => void;
}

export const FundAccountModal: React.FC<FundAccountModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  editingAccount,
  onUpdate,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"CASH" | "BANK">("CASH");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [note, setNote] = useState("");

  const isEditing = !!editingAccount;

  useEffect(() => {
    if (isOpen && editingAccount) {
      setName(editingAccount.name || "");
      setType(editingAccount.type || "CASH");
      setBankName(editingAccount.bankName || "");
      setAccountNumber(editingAccount.accountNumber || "");
      setHolder(editingAccount.holder || "");
      setOpeningBalance(editingAccount.openingBalance || 0);
      setNote(editingAccount.note || "");
    } else if (isOpen && !editingAccount) {
      setName("");
      setType("CASH");
      setBankName("");
      setAccountNumber("");
      setHolder("");
      setOpeningBalance(0);
      setNote("");
    }
  }, [isOpen, editingAccount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập Tên tài khoản / quỹ!");
      return;
    }
    if (type === "BANK" && !accountNumber.trim()) {
      alert("Vui lòng nhập Số tài khoản ngân hàng!");
      return;
    }

    if (isEditing && editingAccount) {
      onUpdate?.({
        ...editingAccount,
        name: name.trim(),
        type,
        bankName: bankName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        holder: holder.trim() || undefined,
        openingBalance: Math.max(0, Math.round(openingBalance) || 0),
        note: note.trim() || undefined,
      });
      onClose();
      return;
    }

    const t = new Date();
    onCreate({
      id: `ACC-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      type,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      holder: holder.trim() || undefined,
      openingBalance: Math.max(0, Math.round(openingBalance) || 0),
      note: note.trim() || undefined,
      createdAt: `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {isEditing ? "Sửa Tài Khoản Quỹ" : "Thêm Tài Khoản Quỹ Mới"}
              </h3>
              <p className="text-[11px] text-slate-500">Quỹ tiền mặt / tài khoản ngân hàng của xưởng</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tên tài khoản / quỹ *
              </label>
              <input
                type="text"
                placeholder="VD: Quỹ tiền mặt, Vietcombank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Loại
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "CASH" | "BANK")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                <option value="CASH">Tiền mặt</option>
                <option value="BANK">Ngân hàng</option>
              </select>
            </div>
          </div>

          {type === "BANK" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Số tài khoản *
                </label>
                <input
                  type="text"
                  placeholder="VD: 0011001234567"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Ngân hàng
                </label>
                <input
                  type="text"
                  placeholder="VD: Vietcombank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Chủ tài khoản
            </label>
            <input
              type="text"
              placeholder="VD: Công ty TNHH Fsolution"
              value={holder}
              onChange={(e) => setHolder(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Số dư đầu kỳ (VNĐ)
            </label>
            <input
              type="number"
              min="0"
              value={openingBalance || ""}
              onChange={(e) => setOpeningBalance(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-indigo-600"
            />
            {(openingBalance || 0) > 0 && (
              <p className="mt-1 text-[11px] font-semibold text-indigo-600">
                = {new Intl.NumberFormat("vi-VN").format(openingBalance)} đ
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              placeholder="VD: TK giao dịch chính"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
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
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {isEditing ? "Lưu Thay Đổi" : "Thêm Tài Khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
