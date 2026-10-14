"use client";

import React, { useState, useMemo } from "react";
import {
  Archive,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ArrowDownLeft,
  MapPin,
  ClipboardList,
  Truck,
  X,
} from "lucide-react";
import { InventoryItem, StockVoucher } from "@/types";

export type InvSubTab = "stock" | "inbound";

interface InventoryViewProps {
  items: InventoryItem[];
  inboundVouchers: StockVoucher[];
  subTab: InvSubTab;
  onSubTabChange: (sub: InvSubTab) => void;
  onImportVoucher: (v: StockVoucher) => void;
}

function todayStr() {
  const t = new Date();
  return `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;
}

/* ===== Modal lập phiếu nhập kho NVL ===== */
const InboundModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  presetItemId?: string;
  onSubmit: (v: StockVoucher) => void;
}> = ({ isOpen, onClose, items, presetItemId, onSubmit }) => {
  const [itemId, setItemId] = useState(presetItemId || items[0]?.id || "");
  const [qty, setQty] = useState<number>(10);
  const [partner, setPartner] = useState("");
  const [note, setNote] = useState("");

  // Reset khi mở modal / đổi preset
  React.useEffect(() => {
    if (isOpen) {
      setItemId(presetItemId || items[0]?.id || "");
      setQty(10);
      setPartner("");
      setNote("");
    }
  }, [isOpen, presetItemId, items]);

  if (!isOpen) return null;

  const selected = items.find((i) => i.id === itemId) || items[0];
  if (!selected) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = Number(qty) || 0;
    if (!selected || q <= 0) {
      alert("Vui lòng chọn vật tư và nhập số lượng > 0!");
      return;
    }
    const v: StockVoucher = {
      id: `SV-${Date.now().toString().slice(-6)}`,
      code: `PNK2510-${Math.floor(100 + Math.random() * 900)}`,
      type: "IMPORT",
      date: todayStr(),
      itemId: selected.id,
      itemCode: selected.code,
      itemName: selected.name,
      unit: selected.unit,
      quantity: q,
      unitPrice: selected.unitPrice,
      totalValue: q * selected.unitPrice,
      partner: partner.trim() || "—",
      note: note.trim() || undefined,
      createdBy: "Thủ kho",
    };
    onSubmit(v);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Phiếu Nhập Kho NVL</h3>
              <p className="text-[11px] text-slate-500">Ghi sổ + cộng tồn kho ngay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Vật tư nhập kho *
            </label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600 font-medium"
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.code} — {i.name} (tồn {i.quantity} {i.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Số lượng nhập ({selected.unit}) *
              </label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:bg-white focus:outline-emerald-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nhà cung cấp
              </label>
              <input
                type="text"
                placeholder="VD: Giấy Tân Mai"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] space-y-0.5">
            <div>
              Tồn sau nhập:{" "}
              <strong>
                {(selected.quantity + (Number(qty) || 0)).toLocaleString("vi-VN")} {selected.unit}
              </strong>
            </div>
            <div>
              Giá trị phiếu:{" "}
              <strong>
                {new Intl.NumberFormat("vi-VN").format((Number(qty) || 0) * selected.unitPrice)} đ
              </strong>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              placeholder="VD: Nhập bổ sung kịp LSX2510-004"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600"
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
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Xác Nhận Nhập Kho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ===== View chính ===== */
export const InventoryView: React.FC<InventoryViewProps> = ({
  items,
  inboundVouchers,
  subTab,
  onSubTabChange,
  onImportVoucher,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [inboundOpen, setInboundOpen] = useState(false);
  const [presetItemId, setPresetItemId] = useState<string | undefined>(undefined);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const categories = [
    "ALL",
    "Giấy in",
    "Bản kẽm CTP",
    "Mực in & Hóa chất",
    "Vật tư gia công",
  ];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLow = !onlyLowStock || item.quantity <= item.minSafeStock;
      return matchCat && matchSearch && matchLow;
    });
  }, [items, selectedCategory, searchQuery, onlyLowStock]);

  const stats = useMemo(() => {
    const totalTypes = items.length;
    const lowStockCount = items.filter((i) => i.quantity <= i.minSafeStock).length;
    const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    return { totalTypes, lowStockCount, totalValue };
  }, [items]);

  const inboundStats = useMemo(() => {
    const count = inboundVouchers.length;
    const totalValue = inboundVouchers.reduce((s, v) => s + v.totalValue, 0);
    return { count, totalValue };
  }, [inboundVouchers]);

  const openInbound = (itemId?: string) => {
    setPresetItemId(itemId);
    setInboundOpen(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Kho bãi</span>
            <span>/</span>
            <span className="text-slate-500">NVL in ấn &amp; phiếu nhập</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản Lý Tồn Kho Nguyên Vật Liệu In Ấn
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tồn kho giấy ram/cuộn, bản kẽm CTP, mực in offset và phiếu nhập kho ghi sổ
          </p>
        </div>

        <button
          onClick={() => openInbound()}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tạo Phiếu Nhập Kho NVL
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSubTabChange("stock")}
          className={`px-4 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === "stock"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Archive className="w-4 h-4" />
          Tồn kho ({items.length})
        </button>
        <button
          onClick={() => onSubTabChange("inbound")}
          className={`px-4 py-2 text-xs rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            subTab === "inbound"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Phiếu nhập kho ({inboundVouchers.length})
        </button>
      </div>

      {subTab === "stock" && (
        <>
          {/* 3 Thẻ KPI Kho */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="stat-card blue">
              <div className="text-xs text-slate-500 font-semibold">Tổng chủng loại NVL</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{stats.totalTypes} Mặt hàng</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kho Giấy, Kẽm, Mực, Màng</div>
            </div>
            <div className="stat-card emerald">
              <div className="text-xs text-slate-500 font-semibold">Tổng giá trị vốn lưu kho</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {formatVND(stats.totalValue)}
              </div>
              <div className="text-[11px] text-emerald-600/80 mt-0.5">Theo đơn giá bình quân</div>
            </div>
            <div className={`stat-card ${stats.lowStockCount > 0 ? "amber" : "emerald"}`}>
              <div className="text-xs text-slate-500 font-semibold">Cảnh báo tồn kho an toàn</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {stats.lowStockCount} Mặt hàng sắp hết
              </div>
              <div className="text-[11px] text-amber-700/80 mt-0.5">Cần nhập thêm để kịp LSX</div>
            </div>
          </div>

          {/* Thanh Tìm Kiếm & Lọc */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo mã NVL, tên vật tư, vị trí kệ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat === "ALL" ? "Tất cả kho" : cat}
                </button>
              ))}

              <button
                onClick={() => setOnlyLowStock(!onlyLowStock)}
                className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
                  onlyLowStock
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Sắp hết hàng</span>
              </button>
            </div>
          </div>

          {/* Bảng Dữ Liệu Tồn Kho */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Mã vật tư</th>
                    <th>Tên nguyên vật liệu</th>
                    <th>Phân loại kho</th>
                    <th>Quy cách / Thông số</th>
                    <th className="text-right">Tồn thực tế</th>
                    <th className="text-right">Tồn an toàn</th>
                    <th>Trạng thái tồn</th>
                    <th className="text-right">Giá trị tồn</th>
                    <th>Vị trí kệ kho</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-10 text-slate-400">
                        Không tìm thấy nguyên vật liệu nào
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((it) => {
                      const isLow = it.quantity <= it.minSafeStock;
                      const totalVal = it.quantity * it.unitPrice;
                      return (
                        <tr key={it.id} className="hover:bg-slate-50/80 transition-colors">
                          <td>
                            <span className="font-mono font-bold text-indigo-600 text-xs">
                              {it.code}
                            </span>
                          </td>
                          <td>
                            <div className="font-bold text-slate-900 text-xs">{it.name}</div>
                            <div className="text-[11px] text-slate-400">
                              Cập nhật: {it.lastUpdated}
                            </div>
                          </td>
                          <td>
                            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md border border-slate-200">
                              {it.category}
                            </span>
                          </td>
                          <td>
                            <div className="text-[11px] text-slate-600 max-w-xs truncate">
                              {it.specification}
                            </div>
                          </td>
                          <td className="text-right font-extrabold text-slate-900 text-xs">
                            {it.quantity.toLocaleString("vi-VN")} {it.unit}
                          </td>
                          <td className="text-right text-slate-500 text-xs">
                            {it.minSafeStock.toLocaleString("vi-VN")} {it.unit}
                          </td>
                          <td>
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                Sắp hết hàng
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                Đủ tồn kho
                              </span>
                            )}
                          </td>
                          <td className="text-right font-mono text-xs font-semibold text-slate-900">
                            {formatVND(totalVal)}
                          </td>
                          <td>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {it.location}
                            </div>
                          </td>
                          <td className="text-right">
                            <button
                              onClick={() => openInbound(it.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all cursor-pointer whitespace-nowrap"
                            >
                              + Nhập kho
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {subTab === "inbound" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="stat-card emerald">
              <div className="text-xs text-slate-500 font-semibold">Tổng lượt nhập kho</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{inboundStats.count} Phiếu</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Đã ghi sổ PNK</div>
            </div>
            <div className="stat-card blue">
              <div className="text-xs text-slate-500 font-semibold">Tổng giá trị đã nhập</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{formatVND(inboundStats.totalValue)}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Theo đơn giá ghi sổ</div>
            </div>
            <div className="stat-card violet">
              <div className="text-xs text-slate-500 font-semibold">Vận chuyển / NCC</div>
              <div className="text-2xl font-bold text-indigo-600 mt-1 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Ghi sổ
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Kèm tên NCC mỗi phiếu</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Số phiếu nhập</th>
                    <th>Ngày nhập</th>
                    <th>Vật tư</th>
                    <th>Nhà cung cấp</th>
                    <th className="text-right">Số lượng</th>
                    <th className="text-right">Đơn giá</th>
                    <th className="text-right">Thành tiền</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {inboundVouchers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-400">
                        Chưa có phiếu nhập nào — bấm “Tạo Phiếu Nhập Kho NVL”
                      </td>
                    </tr>
                  ) : (
                    inboundVouchers.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <span className="font-mono font-bold text-emerald-700">{v.code}</span>
                        </td>
                        <td className="text-slate-600 whitespace-nowrap">{v.date}</td>
                        <td>
                          <div className="font-semibold text-slate-900 text-xs">{v.itemName}</div>
                          <div className="font-mono text-[11px] text-slate-400">{v.itemCode}</div>
                        </td>
                        <td className="text-slate-700 font-medium">{v.partner}</td>
                        <td className="text-right font-bold text-slate-900">
                          {v.quantity.toLocaleString("vi-VN")} {v.unit}
                        </td>
                        <td className="text-right text-slate-600 font-mono">{formatVND(v.unitPrice)}</td>
                        <td className="text-right font-bold text-slate-900">{formatVND(v.totalValue)}</td>
                        <td className="text-slate-500 text-xs max-w-[220px]">{v.note || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal nhập kho */}
      <InboundModal
        isOpen={inboundOpen}
        onClose={() => setInboundOpen(false)}
        items={items}
        presetItemId={presetItemId}
        onSubmit={onImportVoucher}
      />
    </div>
  );
};
