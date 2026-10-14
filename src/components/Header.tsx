"use client";

import React, { useState } from "react";
import {
  Bell,
  Eye,
  Phone,
  Globe,
  Search,
  Sparkles,
  Workflow,
  Command,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HeaderProps {
  onOpenDiagram: () => void;
  onOpenOriginalImages: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDiagram,
  onOpenOriginalImages,
  notificationCount = 3,
}) => {
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <header className="saas-header sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-slate-200/80 px-4 sm:px-6 py-2.5 transition-all shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand / System info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 truncate">
                  <span>Fsolution</span>
                  <span className="text-slate-400 font-normal hidden md:inline">|</span>
                  <span className="text-xs font-semibold text-slate-600 hidden md:inline">
                    Hệ thống Quản lý Doanh nghiệp In ấn
                  </span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
                  v2.5 SaaS
                </span>
                <span className="hidden lg:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trực tuyến
                </span>
              </div>
              <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 truncate">
                <span>
                  Bản quyền: <strong className="text-slate-700 font-semibold">Fsolution</strong>
                </span>
                <span>•</span>
                <a
                  href="https://fsolution.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 font-medium"
                >
                  <Globe className="w-3 h-3" />
                  fsolution.vn
                </a>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1 text-emerald-700 font-semibold">
                  <Phone className="w-3 h-3" />
                  Hotline/Zalo: 0965310233
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search pill */}
        <div className="hidden xl:flex items-center">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm phiếu bán, khách hàng, LSX..."
              className="w-72 pl-9 pr-14 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-lg border border-slate-200/70 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
            <div className="absolute right-2 flex items-center gap-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 shadow-2xs">
              <Command className="w-2.5 h-2.5" /> K
            </div>
          </div>
        </div>

        {/* Right: Actions & User */}
        <div className="flex items-center gap-2.5">
          {/* Nút xem quy trình Ảnh 2 */}
          <button
            onClick={onOpenDiagram}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-300/80 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            title="Xem sơ đồ quy trình chuẩn từ Ảnh 2"
          >
            <Workflow className="w-3.5 h-3.5 text-amber-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Sơ đồ quy trình</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.2 rounded">
              Ảnh 2
            </span>
          </button>

          {/* Nút đối chiếu ảnh gốc */}
          <button
            onClick={onOpenOriginalImages}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/80 rounded-lg transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Mở ảnh gốc chụp từ thực tế để đối chiếu"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Đối chiếu</span> 2 ảnh gốc
          </button>

          {/* Chuông thông báo */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all relative cursor-pointer"
              title="Thông báo đơn hàng & quy trình"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Thông báo hệ thống</span>
                  <span className="text-[10px] text-indigo-600 font-semibold cursor-pointer hover:underline">
                    Đánh dấu đã đọc
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">Đơn hàng mới</span>
                      <span className="text-[10px] text-slate-400">5 phút trước</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Đơn BH251009-001 đang ở bước <strong>Chờ PSX tiếp nhận</strong>.
                    </p>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">LSX hoàn thành</span>
                      <span className="text-[10px] text-slate-400">1 giờ trước</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      LSX-2510-001 (In Catalogue 1.000 cuốn) đã hoàn tất gia công BTP.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-slate-700">
                Q
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                <span>Quản trị viên</span>
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">admin@fsolution.vn</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
