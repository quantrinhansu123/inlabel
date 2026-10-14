"use client";

import React from "react";
import {
  FileText,
  ShoppingCart,
  DollarSign,
  Tag,
  Cpu,
  GitBranch,
  Layers,
  Archive,
  ArrowDownLeft,
  ArrowUpRight,
  ClipboardCheck,
  LayoutDashboard,
  Receipt,
  LogOut,
  Printer,
  Workflow,
  Target,
  Users,
  Zap,
  ChevronRight,
  Palette,
  BookOpenCheck,
  Wallet,
  Landmark,
} from "lucide-react";

export type NavTab =
  | "sales-report" // Bán hàng (Ảnh 1)
  | "orders-flow"  // Đơn đặt hàng (Ảnh 2)
  | "quotations"   // Báo giá
  | "pricing"      // Chính sách giá
  | "leads"        // Danh sách Lead
  | "customers"    // Danh sách khách hàng
  | "lsx"          // Lệnh sản xuất
  | "bom"          // Định mức NVL
  | "inventory"    // Tồn kho
  | "receipts"     // Phiếu thu
  | "exports"      // Phiếu xuất kho
  | "design-templates" // Mẫu thiết kế
  | "diagram-view";// Sơ đồ quy trình đầy đủ

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab, sub?: string) => void;
  orderCount?: number;
  activeSub?: string;
}

interface NavItemProps {
  tab: NavTab;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab, sub?: string) => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
  sub?: string;
  activeSub?: string;
}

const NavItem: React.FC<NavItemProps> = ({
  tab,
  currentTab,
  onSelectTab,
  icon,
  label,
  badge,
  badgeColor = "bg-indigo-500/20 text-indigo-300",
  sub,
  activeSub,
}) => {
  const isActive =
    currentTab === tab && (sub === undefined || activeSub === sub);
  return (
    <button
      onClick={() => onSelectTab(tab, sub)}
      className={`sidebar-nav-item w-full ${isActive ? "active" : ""}`}
    >
      <span className="w-4 h-4 shrink-0 opacity-70">{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge && (
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${badgeColor}`}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  orderCount = 5,
  activeSub,
}) => {
  return (
    <aside className="saas-sidebar w-[260px] text-gray-300 flex flex-col shrink-0 min-h-screen select-none relative z-10">
      {/* Brand */}
      <div className="p-5 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/25">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight">
              Fsolution
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Quản lý in ấn SaaS
            </div>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="mx-3 mt-4 mb-2 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            Q
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">
              Quản trị viên
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              admin@fsolution.vn
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5 relative z-10">
        {/* KHÁCH HÀNG */}
        <div>
          <div className="section-label text-slate-500 mb-2">
            Khách hàng
          </div>
          <div className="space-y-0.5">
            <NavItem
              tab="leads"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Target className="w-4 h-4" />}
              label="Danh sách Lead"
            />
            <NavItem
              tab="customers"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Users className="w-4 h-4" />}
              label="Danh sách khách hàng"
            />
          </div>
        </div>

        {/* BÁN HÀNG */}
        <div>
          <div className="section-label text-slate-500 mb-2">
            Bán hàng
          </div>
          <div className="space-y-0.5">
            <NavItem
              tab="quotations"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<FileText className="w-4 h-4" />}
              label="Báo giá"
            />
            <NavItem
              tab="orders-flow"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<ShoppingCart className="w-4 h-4" />}
              label="Đơn đặt hàng"
              badge={`${orderCount}`}
              badgeColor="bg-amber-500/20 text-amber-300"
            />
            <NavItem
              tab="sales-report"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<DollarSign className="w-4 h-4" />}
              label="Bán hàng"
            />
            <NavItem
              tab="pricing"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Tag className="w-4 h-4" />}
              label="Chính sách giá bán"
            />
          </div>
        </div>

        {/* SẢN XUẤT */}
        <div>
          <div className="section-label text-slate-500 mb-2">
            Sản xuất
          </div>
          <div className="space-y-0.5">
            <NavItem
              tab="lsx"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Cpu className="w-4 h-4" />}
              label="Lệnh sản xuất"
            />
            <NavItem
              tab="diagram-view"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<GitBranch className="w-4 h-4" />}
              label="Quy trình sản xuất"
            />
            <NavItem
              tab="bom"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Layers className="w-4 h-4" />}
              label="Định mức NVL (BOM)"
            />
            <NavItem
              tab="design-templates"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Palette className="w-4 h-4" />}
              label="Mẫu thiết kế"
            />
          </div>
        </div>

        {/* KHO BÃI */}
        <div>
          <div className="section-label text-slate-500 mb-2">
            Kho bãi
          </div>
          <div className="space-y-0.5">
            <NavItem
              tab="inventory"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Archive className="w-4 h-4" />}
              label="Tồn kho"
              sub="stock"
              activeSub={activeSub}
            />
            <NavItem
              tab="inventory"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<ArrowDownLeft className="w-4 h-4" />}
              label="Phiếu nhập kho"
              sub="inbound"
              activeSub={activeSub}
            />
            <NavItem
              tab="exports"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<ArrowUpRight className="w-4 h-4" />}
              label="Phiếu xuất kho"
            />
          </div>
        </div>

        {/* TÀI CHÍNH */}
        <div>
          <div className="section-label text-slate-500 mb-2">
            Tài chính
          </div>
          <div className="space-y-0.5">
            <NavItem
              tab="receipts"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<BookOpenCheck className="w-4 h-4" />}
              label="Sổ quỹ"
              sub="cashbook"
              activeSub={activeSub}
            />
            <NavItem
              tab="receipts"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Receipt className="w-4 h-4" />}
              label="Phiếu thu"
              sub="receipts"
              activeSub={activeSub}
            />
            <NavItem
              tab="receipts"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Wallet className="w-4 h-4" />}
              label="Phiếu chi"
              sub="payments"
              activeSub={activeSub}
            />
            <NavItem
              tab="receipts"
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              icon={<Landmark className="w-4 h-4" />}
              label="Tài khoản"
              sub="accounts"
              activeSub={activeSub}
            />
          </div>
        </div>
      </div>

      {/* Bottom Sticky */}
      <div className="p-3 border-t border-white/[0.06] space-y-2 relative z-10">
        <button
          onClick={() => onSelectTab("diagram-view")}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-[length:200%_100%] hover:bg-right text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5"
        >
          <Workflow className="w-4 h-4" />
          <span>Sơ đồ quy trình</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </button>

        <button
          onClick={() => alert("Chức năng đăng xuất an toàn.")}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-medium transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};
