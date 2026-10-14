"use client";

import React, { useMemo } from "react";
import {
  BookOpenCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  Pencil,
  Wallet,
  Landmark,
  Receipt,
  FileText,
} from "lucide-react";
import { SalesOrder, PaymentVoucher, FundAccount } from "@/types";

interface FinanceViewProps {
  orders: SalesOrder[];
  payments: PaymentVoucher[];
  accounts: FundAccount[];
  openingBalance: number;
  subTab: SubTab;
  onSubTabChange: (sub: SubTab) => void;
  onOpenCreatePayment: () => void;
  onDeletePayment: (id: string) => void;
  onOpenCreateAccount: () => void;
  onEditAccount: (a: FundAccount) => void;
  onDeleteAccount: (id: string) => void;
  onGoToOrders: () => void;
}

type SubTab = "cashbook" | "receipts" | "payments" | "accounts";

function parseVNDate(s: string): number {
  const [d, m, y] = s.split("/").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1).getTime();
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  orders,
  payments,
  accounts,
  openingBalance,
  subTab,
  onSubTabChange,
  onOpenCreatePayment,
  onDeletePayment,
  onOpenCreateAccount,
  onEditAccount,
  onDeleteAccount,
  onGoToOrders,
}) => {

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const receipts = useMemo(
    () => orders.flatMap((o) => o.receipts.map((r) => ({ ...r, orderRef: o }))),
    [orders]
  );

  // Phiếu thu chưa gắn TK nào thì mặc định vào quỹ tiền mặt
  const cashAccountName = useMemo(
    () => accounts.find((a) => a.type === "CASH")?.name || accounts[0]?.name || "Quỹ tiền mặt",
    [accounts]
  );

  const accountBalance = (name: string) => {
    const acc = accounts.find((a) => a.name === name);
    const opening = acc?.openingBalance || 0;
    const thu =
      name === cashAccountName
        ? receipts.reduce((s, r) => s + r.amount, 0)
        : 0;
    const chi = payments
      .filter((p) => (p.accountName || cashAccountName) === name)
      .reduce((s, p) => s + p.amount, 0);
    return { opening, thu, chi, balance: opening + thu - chi };
  };

  const totalIn = useMemo(
    () => receipts.reduce((s, r) => s + r.amount, 0),
    [receipts]
  );
  const totalOut = useMemo(
    () => payments.reduce((s, p) => s + p.amount, 0),
    [payments]
  );
  const closingBalance = openingBalance + totalIn - totalOut;

  // Sổ quỹ: gộp thu + chi, sắp xếp theo ngày, tính tồn lũy kế
  const ledger = useMemo(() => {
    const rows: {
      key: string;
      date: string;
      ts: number;
      code: string;
      desc: string;
      inAmt: number;
      outAmt: number;
    }[] = [
      ...receipts.map((r) => ({
        key: `IN-${r.id}`,
        date: r.date,
        ts: parseVNDate(r.date),
        code: r.code,
        desc: `Thu tiền ${r.orderRef.customer.name} (${r.orderRef.salesBillNumber})${r.note ? ` — ${r.note}` : ""}`,
        inAmt: r.amount,
        outAmt: 0,
      })),
      ...payments.map((p) => ({
        key: `OUT-${p.id}`,
        date: p.date,
        ts: parseVNDate(p.date),
        code: p.code,
        desc: `${p.category} — ${p.receiver}${p.relatedBill ? ` (${p.relatedBill})` : ""}${p.note ? ` — ${p.note}` : ""}`,
        inAmt: 0,
        outAmt: p.amount,
      })),
    ].sort((a, b) => a.ts - b.ts);
    let bal = openingBalance;
    return rows.map((r) => {
      bal = bal + r.inAmt - r.outAmt;
      return { ...r, balance: bal };
    });
  }, [receipts, payments, openingBalance]);

  const tabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: "cashbook", label: "Sổ quỹ", icon: <BookOpenCheck className="w-4 h-4" /> },
    { id: "receipts", label: `Phiếu thu (${receipts.length})`, icon: <ArrowDownLeft className="w-4 h-4" /> },
    { id: "payments", label: `Phiếu chi (${payments.length})`, icon: <ArrowUpRight className="w-4 h-4" /> },
    { id: "accounts", label: `Tài khoản (${accounts.length})`, icon: <Landmark className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Tài chính</span>
            <span>/</span>
            <span className="text-slate-500">Quỹ tiền mặt &amp; chuyển khoản</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Tài Chính — Sổ Quỹ, Thu &amp; Chi (Nhánh A)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sổ quỹ lũy kế theo từng chứng từ thu/chi đã ghi sổ — điều kiện tiên quyết để hoàn thành đơn
          </p>
        </div>
        <button
          onClick={onOpenCreatePayment}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-sm shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Lập phiếu chi</span>
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn đầu kỳ</span>
            <div className="stat-icon blue"><Landmark className="w-4 h-4" /></div>
          </div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatVND(openingBalance)}</div>
        </div>
        <div className="stat-card emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng thu</span>
            <div className="stat-icon emerald"><ArrowDownLeft className="w-4 h-4" /></div>
          </div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatVND(totalIn)}</div>
          <div className="text-xs text-slate-400 mt-1">{receipts.length} phiếu thu</div>
        </div>
        <div className="stat-card rose">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng chi</span>
            <div className="stat-icon rose"><ArrowUpRight className="w-4 h-4" /></div>
          </div>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatVND(totalOut)}</div>
          <div className="text-xs text-slate-400 mt-1">{payments.length} phiếu chi</div>
        </div>
        <div className="stat-card violet">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn quỹ hiện tại</span>
            <div className="stat-icon violet"><Wallet className="w-4 h-4" /></div>
          </div>
          <div className={`text-xl font-bold mt-1 ${closingBalance >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
            {formatVND(closingBalance)}
          </div>
          <div className="text-xs text-slate-400 mt-1">= Đầu kỳ + Thu − Chi</div>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onSubTabChange(t.id)}
            className={`px-4 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              subTab === t.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* SỔ QUỸ */}
      {subTab === "cashbook" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Chứng từ</th>
                  <th>Diễn giải</th>
                  <th className="text-right">Thu vào</th>
                  <th className="text-right">Chi ra</th>
                  <th className="text-right">Tồn lũy kế</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-slate-50">
                  <td className="text-slate-500">—</td>
                  <td className="font-mono text-slate-500 font-bold">ĐẦU KỲ</td>
                  <td className="font-semibold text-slate-700">Số dư quỹ đầu kỳ</td>
                  <td className="text-right text-slate-400">—</td>
                  <td className="text-right text-slate-400">—</td>
                  <td className="text-right font-extrabold text-slate-900">{formatVND(openingBalance)}</td>
                </tr>
                {ledger.map((r) => (
                  <tr key={r.key}>
                    <td className="text-slate-600 whitespace-nowrap">{r.date}</td>
                    <td>
                      <span className={`font-mono font-bold ${r.inAmt > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {r.code}
                      </span>
                    </td>
                    <td className="text-slate-700 text-xs max-w-md">{r.desc}</td>
                    <td className="text-right font-bold text-emerald-700">
                      {r.inAmt > 0 ? formatVND(r.inAmt) : "—"}
                    </td>
                    <td className="text-right font-bold text-rose-700">
                      {r.outAmt > 0 ? formatVND(r.outAmt) : "—"}
                    </td>
                    <td className="text-right font-extrabold text-slate-900">{formatVND(r.balance)}</td>
                  </tr>
                ))}
                <tr className="bg-indigo-50/60">
                  <td colSpan={3} className="font-extrabold text-slate-900">Tồn quỹ cuối kỳ</td>
                  <td className="text-right font-extrabold text-emerald-700">{formatVND(totalIn)}</td>
                  <td className="text-right font-extrabold text-rose-700">{formatVND(totalOut)}</td>
                  <td className="text-right font-extrabold text-indigo-700 text-sm">{formatVND(closingBalance)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PHIẾU THU */}
      {subTab === "receipts" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Phiếu thu được lập từ chi tiết từng đơn hàng (Nhánh A). Tổng đã thu:{" "}
              <strong className="text-emerald-700 text-sm">{formatVND(totalIn)}</strong>
            </div>
            <button
              onClick={onGoToOrders}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>Lập phiếu thu từ đơn hàng</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Số phiếu thu</th>
                    <th>Ngày ghi sổ</th>
                    <th>Khách hàng</th>
                    <th>Số phiếu bán liên kết</th>
                    <th>Hình thức</th>
                    <th className="text-right">Số tiền thu</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">Chưa có phiếu thu nào</td>
                    </tr>
                  ) : (
                    receipts.map((rcp) => (
                      <tr key={rcp.id}>
                        <td>
                          <span className="font-mono font-bold text-emerald-700">{rcp.code}</span>
                        </td>
                        <td className="text-slate-600">{rcp.date}</td>
                        <td className="font-semibold text-slate-900">{rcp.orderRef.customer.name}</td>
                        <td className="font-mono text-indigo-600 font-semibold">{rcp.orderRef.salesBillNumber}</td>
                        <td className="text-slate-700 font-medium">{rcp.method}</td>
                        <td className="text-right font-bold text-slate-900">{formatVND(rcp.amount)}</td>
                        <td className="text-slate-500 text-xs">{rcp.note || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PHIẾU CHI */}
      {subTab === "payments" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="saas-table">
              <thead>
                <tr>
                  <th>Số phiếu chi</th>
                  <th>Ngày ghi sổ</th>
                  <th>Khoản mục</th>
                  <th>Người nhận / NCC</th>
                  <th>Tài khoản chi</th>
                  <th>Liên kết</th>
                  <th>Hình thức</th>
                  <th className="text-right">Số tiền chi</th>
                  <th>Ghi chú</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10 text-slate-400">
                      Chưa có phiếu chi nào — bấm “Lập phiếu chi” để tạo mới
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className="font-mono font-bold text-rose-700">{p.code}</span>
                      </td>
                      <td className="text-slate-600">{p.date}</td>
                      <td>
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                          <FileText className="w-3 h-3 text-slate-400" />
                          {p.category}
                        </span>
                      </td>
                      <td className="font-semibold text-slate-900">{p.receiver}</td>
                      <td className="text-xs font-semibold text-indigo-700">{p.accountName || "—"}</td>
                      <td className="font-mono text-indigo-600 text-xs">{p.relatedBill || "—"}</td>
                      <td className="text-slate-700 font-medium">{p.method}</td>
                      <td className="text-right font-bold text-slate-900">{formatVND(p.amount)}</td>
                      <td className="text-slate-500 text-xs max-w-[200px]">{p.note || "—"}</td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Xóa phiếu chi "${p.code}"? Tồn quỹ sẽ tăng lại tương ứng.`)) {
                              onDeletePayment(p.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Xóa phiếu chi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TÀI KHOẢN QUỸ */}
      {subTab === "accounts" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Quản lý quỹ tiền mặt &amp; tài khoản ngân hàng. Sổ quỹ đầu kỳ = tổng số dư đầu kỳ các tài khoản:{" "}
              <strong className="text-indigo-700 text-sm">{formatVND(openingBalance)}</strong>
            </div>
            <button
              onClick={onOpenCreateAccount}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm tài khoản</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((a) => {
              const b = accountBalance(a.name);
              return (
                <div key={a.id} className="saas-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${a.type === "CASH" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-indigo-500 to-violet-600"}`}>
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{a.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {a.type === "CASH" ? "Tiền mặt" : `${a.bankName || "Ngân hàng"}${a.accountNumber ? ` • ${a.accountNumber}` : ""}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditAccount(a)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                        title="Sửa tài khoản"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Xóa tài khoản "${a.name}"?`)) onDeleteAccount(a.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-slate-50 rounded-lg py-2 border border-slate-100">
                      <div className="text-slate-400 font-medium">Đầu kỳ</div>
                      <div className="font-bold text-slate-800">{formatVND(b.opening)}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg py-2 border border-emerald-100">
                      <div className="text-slate-400 font-medium">Thu vào</div>
                      <div className="font-bold text-emerald-700">{formatVND(b.thu)}</div>
                    </div>
                    <div className="bg-rose-50 rounded-lg py-2 border border-rose-100">
                      <div className="text-slate-400 font-medium">Chi ra</div>
                      <div className="font-bold text-rose-700">{formatVND(b.chi)}</div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Số dư hiện tại</span>
                    <span className={`text-base font-extrabold ${b.balance >= 0 ? "text-indigo-700" : "text-rose-600"}`}>
                      {formatVND(b.balance)}
                    </span>
                  </div>
                  {a.holder && (
                    <div className="text-[11px] text-slate-400">Chủ TK: {a.holder}</div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400">
            * Phiếu thu mặc định vào {cashAccountName}; phiếu chi trừ đúng tài khoản đã chọn khi lập phiếu.
          </p>
        </div>
      )}
    </div>
  );
};
