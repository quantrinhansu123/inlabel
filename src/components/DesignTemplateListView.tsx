"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ExternalLink,
  Image as ImageIcon,
  Trash2,
  Palette,
  Building2,
  LayoutGrid,
  FolderOpen,
  Link2,
} from "lucide-react";
import { DesignTemplate } from "@/types";
import { resolveDesignPreview } from "@/utils/drive";

interface DesignTemplateListViewProps {
  templates: DesignTemplate[];
  onOpenCreate: () => void;
  onDelete?: (id: string) => void;
}

export const DesignTemplateListView: React.FC<DesignTemplateListViewProps> = ({
  templates,
  onOpenCreate,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, string>();
    templates.forEach((t) => {
      if (t.customerId && t.customerName) map.set(t.customerId, t.customerName);
      else if (t.customerName) map.set(t.customerName, t.customerName);
    });
    return [...map.entries()];
  }, [templates]);

  const categories = useMemo(
    () => [...new Set(templates.map((t) => t.category).filter(Boolean))],
    [templates]
  );

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === "" ||
        t.name.toLowerCase().includes(q) ||
        (t.customerName || "").toLowerCase().includes(q) ||
        (t.uploadedFileName || "").toLowerCase().includes(q) ||
        (t.notes || "").toLowerCase().includes(q);
      const matchCustomer =
        customerFilter === "ALL" ||
        (customerFilter === "COMMON" && !t.customerId && !t.customerName) ||
        t.customerId === customerFilter ||
        t.customerName === customerFilter;
      const matchCategory = categoryFilter === "ALL" || t.category === categoryFilter;
      return matchSearch && matchCustomer && matchCategory;
    });
  }, [templates, searchQuery, customerFilter, categoryFilter]);

  const stats = useMemo(() => {
    const withCustomer = templates.filter((t) => t.customerName).length;
    const common = templates.length - withCustomer;
    const withDrive = templates.filter((t) => t.driveLink).length;
    return { total: templates.length, withCustomer, common, withDrive };
  }, [templates]);

  const previewTemplate = templates.find((t) => t.id === previewId) || null;
  const previewSrc = previewTemplate
    ? previewTemplate.previewUrl ||
      resolveDesignPreview({
        driveLink: previewTemplate.driveLink,
        uploadedImageUrl: previewTemplate.uploadedImageUrl,
      })
    : "";

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>Sản xuất</span>
            <span>/</span>
            <span className="text-slate-500">Kho mẫu thiết kế</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mẫu Thiết Kế In Ấn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu mẫu theo từng khách hàng hoặc mẫu chung của xưởng. Dán link Google Drive là tự hiện ảnh preview.
          </p>
        </div>
        <button
          onClick={onOpenCreate}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mẫu thiết kế</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card violet">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng số mẫu</span>
            <div className="stat-icon violet"><Palette className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <div className="text-xs text-slate-400 mt-2">Đang lưu trong kho mẫu</div>
        </div>
        <div className="stat-card blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mẫu theo KH</span>
            <div className="stat-icon blue"><Building2 className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{stats.withCustomer}</div>
          <div className="text-xs text-slate-400 mt-2">Gắn với 1 khách cụ thể</div>
        </div>
        <div className="stat-card amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mẫu chung</span>
            <div className="stat-icon amber"><LayoutGrid className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.common}</div>
          <div className="text-xs text-slate-400 mt-2">Xưởng tự đẩy lên dùng chung</div>
        </div>
        <div className="stat-card emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Có link Drive</span>
            <div className="stat-icon emerald"><FolderOpen className="w-4 h-4" /></div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.withDrive}</div>
          <div className="text-xs text-slate-400 mt-2">Mở được file gốc trên Drive</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên mẫu, tên khách, tên file, ghi chú..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
        </div>
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Tất cả khách hàng</option>
          <option value="COMMON">Mẫu chung (không gắn KH)</option>
          {customers.map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500 font-medium">Chưa có mẫu nào phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Bấm “Thêm mẫu thiết kế” để lưu mẫu theo khách hoặc tự đẩy file lên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t) => {
            const src =
              t.previewUrl ||
              resolveDesignPreview({ driveLink: t.driveLink, uploadedImageUrl: t.uploadedImageUrl });
            return (
              <div key={t.id} className="saas-card overflow-hidden group">
                {/* Ảnh */}
                <div
                  className="relative h-44 bg-slate-100 cursor-pointer overflow-hidden"
                  onClick={() => src && setPreviewId(t.id)}
                  title={src ? "Click để xem ảnh lớn" : "Chưa có ảnh preview"}
                >
                  {src ? (
                    <img
                      src={src}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1.5">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                      <span className="text-[11px] font-medium">Chưa có ảnh — dán link Drive hoặc upload file</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/70 text-white backdrop-blur">
                    {t.category}
                  </span>
                  {t.driveLink && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> Drive
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" title={t.name}>
                    {t.name}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    {t.customerName ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        <Building2 className="w-3 h-3" /> {t.customerName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        <LayoutGrid className="w-3 h-3" /> Mẫu chung
                      </span>
                    )}
                  </div>
                  {t.uploadedFileName && (
                    <div className="text-[11px] text-slate-500 truncate" title={t.uploadedFileName}>
                      File: <span className="font-mono font-semibold text-slate-700">{t.uploadedFileName}</span>
                    </div>
                  )}
                  {t.notes && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">{t.notes}</p>
                  )}
                  <div className="text-[10px] text-slate-400">{t.createdAt}{t.createdBy ? ` • ${t.createdBy}` : ""}</div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    {t.driveLink ? (
                      <a
                        href={t.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Mở Drive
                      </a>
                    ) : (
                      <span className="flex-1 inline-flex items-center justify-center px-2.5 py-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                        Không có link Drive
                      </span>
                    )}
                    {src && (
                      <button
                        onClick={() => setPreviewId(t.id)}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition cursor-pointer"
                      >
                        Xem ảnh
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm(`Xóa mẫu "${t.name}"?`)) onDelete(t.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Xóa mẫu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox xem ảnh lớn */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-[1360px] w-[94vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{previewTemplate.name}</h3>
                <p className="text-[11px] text-slate-500">
                  {previewTemplate.customerName || "Mẫu chung"} • {previewTemplate.category}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {previewTemplate.driveLink && (
                  <a
                    href={previewTemplate.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Mở Drive gốc
                  </a>
                )}
                <button
                  onClick={() => setPreviewId(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[78vh] overflow-auto">
              {previewSrc ? (
                <img src={previewSrc} alt={previewTemplate.name} className="max-w-full max-h-[78vh] object-contain" referrerPolicy="no-referrer" />
              ) : (
                <p className="text-slate-400 text-sm p-10">Không có ảnh preview cho mẫu này.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
