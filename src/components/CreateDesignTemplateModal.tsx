"use client";

import React, { useMemo, useRef, useState } from "react";
import { Palette, Link2, Upload, Image as ImageIcon, X } from "lucide-react";
import { Customer, DesignTemplate } from "@/types";
import { extractDriveFileId, isDirectImageUrl, resolveDesignPreview } from "@/utils/drive";

interface CreateDesignTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (t: DesignTemplate) => void;
  customers: Customer[];
}

const CATEGORIES = [
  "Catalogue",
  "Namecard",
  "Tờ rơi",
  "Hộp giấy",
  "Túi giấy",
  "Tem nhãn",
  "Menu",
  "Lịch",
  "Bao bì khác",
  "Mẫu chung",
];

export const CreateDesignTemplateModal: React.FC<CreateDesignTemplateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  customers,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customerId, setCustomerId] = useState<string>("COMMON");
  const [driveLink, setDriveLink] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [notes, setNotes] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === customerId),
    [customers, customerId]
  );

  // Preview trực tiếp khi dán link Drive / link ảnh / upload file
  const livePreview = resolveDesignPreview({ driveLink, uploadedImageUrl });
  const driveFileId = extractDriveFileId(driveLink);
  const driveHint = useMemo(() => {
    const link = driveLink.trim();
    if (!link) return "";
    if (isDirectImageUrl(link)) return "Nhận diện: link ảnh trực tiếp — hiển thị ngay.";
    if (driveFileId)
      return "Nhận diện: link Google Drive hợp lệ — ảnh preview qua thumbnail Drive (file cần share \"Anyone with the link\").";
    if (link.startsWith("http"))
      return "Link chưa nhận diện được ID Drive. Hãy dùng link dạng drive.google.com/file/d/.../view hoặc link ảnh .jpg/.png trực tiếp.";
    return "";
  }, [driveLink, driveFileId]);

  if (!isOpen) return null;

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      // Chỉ preview ảnh; file khác (pdf/ai) vẫn lưu tên để mở sau
      if (file.type.startsWith("image/")) setUploadedImageUrl(url);
      else setUploadedImageUrl("");
    };
    reader.readAsDataURL(file);
  };

  const clearUpload = () => {
    setUploadedFileName("");
    setUploadedImageUrl("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Vui lòng nhập Tên mẫu thiết kế!");
      return;
    }
    if (!driveLink.trim() && !uploadedFileName) {
      alert("Vui lòng dán link Google Drive HOẶC đẩy file mẫu lên!");
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const previewUrl = resolveDesignPreview({ driveLink: driveLink.trim(), uploadedImageUrl }) || undefined;

    const newTemplate: DesignTemplate = {
      id: `DSG-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      category,
      driveLink: driveLink.trim() || undefined,
      previewUrl,
      uploadedFileName: uploadedFileName || undefined,
      uploadedImageUrl: uploadedImageUrl || undefined,
      notes: notes.trim() || undefined,
      createdAt: dateStr,
      createdBy: "Quản trị viên",
    };

    onCreate(newTemplate);
    // reset
    setName("");
    setCategory(CATEGORIES[0]);
    setCustomerId("COMMON");
    setDriveLink("");
    setUploadedFileName("");
    setUploadedImageUrl("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-xs">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Thêm Mẫu Thiết Kế Mới</h3>
              <p className="text-[11px] text-slate-500">Lưu theo khách hàng hoặc mẫu chung — dán link Drive là hiện ảnh ngay</p>
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tên mẫu thiết kế *</label>
              <input
                type="text"
                placeholder="Ví dụ: Catalogue Vietcombank 16 trang - Bản duyệt in"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lưu theo khách hàng</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                <option value="COMMON">Mẫu chung (xưởng tự đẩy lên)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Danh mục mẫu</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Link Drive */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Link2 className="w-3.5 h-3.5 text-emerald-600" /> Link Google Drive (dán vào là hiện ảnh)
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing  hoặc  https://.../mau.jpg"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600 font-mono text-[11px]"
            />
            {driveHint && (
              <p className={`mt-1 text-[11px] font-medium ${driveFileId || isDirectImageUrl(driveLink) ? "text-emerald-600" : "text-amber-600"}`}>
                {driveHint}
              </p>
            )}
          </div>

          {/* Upload */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5 text-indigo-600" /> Hoặc tự đẩy file lên (ảnh hiện ngay, PDF/AI lưu tên file)
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf,.ai,.psd,.cdr"
                onChange={handlePickFile}
                className="flex-1 text-[11px] text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border file:border-indigo-200 file:bg-indigo-50 file:text-indigo-700 file:text-[11px] file:font-bold hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
              />
              {uploadedFileName && (
                <button
                  type="button"
                  onClick={clearUpload}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Xóa file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {uploadedFileName && (
              <p className="mt-1 text-[11px] text-slate-600">
                Đã chọn: <span className="font-mono font-semibold text-slate-800">{uploadedFileName}</span>
              </p>
            )}
          </div>

          {/* Preview */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Xem trước ảnh
            </label>
            <div className="rounded-xl border border-slate-200 bg-slate-950 overflow-hidden flex items-center justify-center min-h-[180px]">
              {livePreview ? (
                <img src={livePreview} alt="Preview mẫu" className="max-h-64 w-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <ImageIcon className="w-7 h-7 mx-auto mb-1.5 text-slate-600" />
                  <p className="text-[11px]">Dán link Drive / link ảnh hoặc chọn file để xem trước tại đây</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ghi chú mẫu (chất liệu, màu, khuôn bế...)</label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Bìa C300 cán mờ, ruột C150 16 trang, ép kim logo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-indigo-600"
            />
          </div>

          <div className="p-4 -mx-5 -mb-5 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-all shadow-sm shadow-violet-600/20 cursor-pointer"
            >
              Lưu Mẫu Thiết Kế
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
