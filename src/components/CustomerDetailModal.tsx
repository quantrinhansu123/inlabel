"use client";

import React, { useState } from "react";
import {
  Users,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShoppingBag,
  TrendingUp,
  FileText,
  Palette,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Customer, SalesOrder, DesignTemplate } from "@/types";
import { resolveDesignPreview } from "@/utils/drive";

interface CustomerDetailModalProps {
  customer: Customer | null;
  orders: SalesOrder[];
  designTemplates: DesignTemplate[];
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
  onCreateOrder?: (customer: Customer) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  orders,
  designTemplates,
  onClose,
  onEdit,
  onCreateOrder,
}) => {
  const [previewId, setPreviewId] = useState<string | null>(null);

  if (!customer) return null;

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const customerOrders = orders.filter(
    (o) => o.customer.id === customer.id || o.customer.name === customer.name
  );
  const revenue = customerOrders.reduce((s, o) => s + o.totalAmount, 0);
  const debt = customerOrders.reduce((s, o) => s + o.debtAmount, 0);
  const templates = designTemplates.filter((t) =>
    t.customerId
      ? t.customerId === customer.id
      : t.customerName === customer.name
  );
  const preview = templates.find((t) => t.id === previewId) || null;
  const previewSrc = preview
    ? preview.previewUrl ||
      resolveDesignPreview({
        driveLink: preview.driveLink,
        uploadedImageUrl: preview.uploadedImageUrl,
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm uppercase">
              {customer.name.slice(0, 2)}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{customer.name}</h3>
              <p className="text-[11px] text-slate-500">
                {customer.group} • KH từ {customer.createdAt || "—"}
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

        {/* Body */}
        <div className="p-5 space-y-5 text-xs overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <ShoppingBag className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-extrabold text-slate-900">{customerOrders.length}</div>
              <div className="text-[11px] text-slate-500">Đơn hàng</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <TrendingUp className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{formatVND(revenue)}</div>
              <div className="text-[11px] text-slate-500">Doanh thu</div>
            </div>
            <div className={`${debt > 0 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"} border rounded-xl p-3 text-center`}>
              <FileText className={`w-4 h-4 mx-auto mb-1 ${debt > 0 ? "text-rose-600" : "text-slate-400"}`} />
              <div className={`text-sm font-extrabold mt-0.5 ${debt > 0 ? "text-rose-700" : "text-slate-500"}`}>
                {debt > 0 ? formatVND(debt) : "Không nợ"}
              </div>
              <div className="text-[11px] text-slate-500">Công nợ</div>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> <span className="font-semibold">{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> <span>{customer.email}</span>
                </div>
              )}
              <div className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5" /> <span>{customer.address}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {customer.taxCode && (
                <div className="text-slate-600">MST: <span className="font-mono font-semibold text-slate-800">{customer.taxCode}</span></div>
              )}
              {customer.contactPerson && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> <span>{customer.contactPerson}</span>
                </div>
              )}
              {customer.notes && (
                <div className="text-slate-500 italic">“{customer.notes}”</div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
              Lịch sử đơn hàng ({customerOrders.length})
            </h4>
            {customerOrders.length === 0 ? (
              <p className="text-[11px] text-slate-400 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center">
                Chưa có đơn hàng nào — bấm “Tạo đơn” để lên đơn đầu tiên.
              </p>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Số phiếu bán</th>
                      <th>Ngày đặt</th>
                      <th className="text-right">Thành tiền</th>
                      <th className="text-right">Còn nợ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((o) => (
                      <tr key={o.id}>
                        <td className="font-mono font-bold text-indigo-600">{o.salesBillNumber}</td>
                        <td className="text-slate-600">{o.orderDate}</td>
                        <td className="text-right font-bold text-slate-900">{formatVND(o.totalAmount)}</td>
                        <td className={`text-right font-bold ${o.debtAmount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {o.debtAmount > 0 ? formatVND(o.debtAmount) : "Hết nợ"}
                        </td>
                        <td className="text-xs font-semibold text-slate-600">{o.step}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Design templates */}
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-violet-600" />
              Mẫu thiết kế ({templates.length})
            </h4>
            {templates.length === 0 ? (
              <p className="text-[11px] text-slate-400 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center">
                Chưa có mẫu nào của khách này.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {templates.map((t) => {
                  const src =
                    t.previewUrl ||
                    resolveDesignPreview({
                      driveLink: t.driveLink,
                      uploadedImageUrl: t.uploadedImageUrl,
                    });
                  return (
                    <button
                      key={t.id}
                      onClick={() => src && setPreviewId(t.id)}
                      className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-violet-400 hover:shadow-md transition cursor-pointer text-left"
                      title={`${t.name} — bấm để xem lớn`}
                    >
                      <div className="h-20 bg-slate-100">
                        {src ? (
                          <img src={src} alt={t.name} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="w-full h-full flex items-center justify-center text-slate-300">
                            <ImageIcon className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                      <div className="p-1.5 text-[10px] font-semibold text-slate-700 truncate">{t.name}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 shrink-0">
          {onEdit && (
            <button
              onClick={() => { onEdit(customer); }}
              className="px-4 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition cursor-pointer"
            >
              Sửa thông tin
            </button>
          )}
          {onCreateOrder && (
            <button
              onClick={() => { onCreateOrder(customer); }}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Tạo đơn &gt;
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Lightbox ảnh mẫu */}
      {preview && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 p-4"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{preview.name}</h3>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {preview.createdAt} • {preview.category}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {preview.driveLink && (
                  <a
                    href={preview.driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg inline-flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Mở Drive
                  </a>
                )}
                <button
                  onClick={() => setPreviewId(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-auto">
              {previewSrc ? (
                <img src={previewSrc} alt={preview.name} className="max-w-full max-h-[70vh] object-contain" referrerPolicy="no-referrer" />
              ) : (
                <p className="text-slate-400 text-sm p-10">Không có ảnh preview.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
