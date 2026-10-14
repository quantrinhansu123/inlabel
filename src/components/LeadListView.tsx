"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  TrendingUp,
  User,
  Building2,
  Tag,
  ChevronDown,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Target,
  ExternalLink,
} from "lucide-react";
import { Lead, LeadStatus, LeadSource } from "@/types";

interface LeadListViewProps {
  leads: Lead[];
  onOpenCreateLead?: () => void;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ReactNode }
> = {
  NEW: {
    label: "Mới tiếp nhận",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  CONTACTED: {
    label: "Đã liên hệ",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <Phone className="w-3.5 h-3.5" />,
  },
  QUALIFIED: {
    label: "Đủ điều kiện",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  PROPOSAL: {
    label: "Đang báo giá",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    icon: <Target className="w-3.5 h-3.5" />,
  },
  NEGOTIATION: {
    label: "Đàm phán",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
  },
  WON: {
    label: "Chốt thành công",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  LOST: {
    label: "Không thành công",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
};

const SOURCE_COLORS: Record<LeadSource, string> = {
  Website: "bg-blue-50 text-blue-700 border-blue-200",
  Facebook: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Zalo: "bg-sky-50 text-sky-700 border-sky-200",
  "Giới thiệu": "bg-emerald-50 text-emerald-700 border-emerald-200",
  Telesales: "bg-amber-50 text-amber-700 border-amber-200",
  "Triển lãm": "bg-purple-50 text-purple-700 border-purple-200",
  "Google Ads": "bg-rose-50 text-rose-700 border-rose-200",
  "Khác": "bg-slate-50 text-slate-700 border-slate-200",
};

export const LeadListView: React.FC<LeadListViewProps> = ({ leads, onOpenCreateLead }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "ALL">("ALL");

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;
      const matchesSource =
        sourceFilter === "ALL" || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = leads.filter(
      (l) => !["WON", "LOST"].includes(l.status)
    ).length;
    const won = leads.filter((l) => l.status === "WON").length;
    const totalValue = leads
      .filter((l) => !["LOST"].includes(l.status))
      .reduce((s, l) => s + (l.estimatedValue || 0), 0);
    const newToday = leads.filter((l) => l.createdAt.includes("14/10") || l.createdAt.includes("15/10")).length;
    return { active, won, totalValue, newToday };
  }, [leads]);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CRM &amp; Khách hàng</span>
            <span>/</span>
            <span className="text-slate-500">Quản lý Lead tiềm năng</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Danh Sách Lead Khách Hàng Tiềm Năng
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi khách hàng tiềm năng, nhu cầu in ấn và tỷ lệ chuyển đổi thành đơn hàng
          </p>
        </div>
        <button
          onClick={onOpenCreateLead}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Lead mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lead đang xử lý
            </span>
            <div className="stat-icon blue">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.active}</div>
          <div className="text-xs text-indigo-600 font-semibold mt-2">
            Đang trao đổi &amp; tư vấn
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chốt thành công (Won)
            </span>
            <div className="stat-icon emerald">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.won}</div>
          <div className="text-xs text-slate-500 mt-2">
            Tỷ lệ chốt: <strong>{((stats.won / leads.length) * 100).toFixed(0)}%</strong>
          </div>
        </div>

        <div className="stat-card violet">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Giá trị pipeline
            </span>
            <div className="stat-icon violet">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">
            {formatVND(stats.totalValue)}
          </div>
          <div className="text-xs text-slate-500 mt-2">Ước tính theo nhu cầu in</div>
        </div>

        <div className="stat-card amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lead mới gần đây
            </span>
            <div className="stat-icon amber">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.newToday || 3}</div>
          <div className="text-xs text-slate-500 mt-2">Cần phản hồi trong 15p</div>
        </div>
      </div>

      {/* Pipeline Status Filter Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-800">Pipeline trạng thái chuyển đổi:</div>
        <div className="flex gap-2 flex-wrap">
          {(
            Object.entries(STATUS_CONFIG) as [
              LeadStatus,
              (typeof STATUS_CONFIG)[LeadStatus]
            ][]
          ).map(([status, cfg]) => {
            const count = leads.filter((l) => l.status === status).length;
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(isSelected ? "ALL" : status)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : `${cfg.bgColor} ${cfg.color} ${cfg.borderColor} hover:opacity-85`
                }`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-white/80"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên lead, doanh nghiệp, số điện thoại, email..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
        </div>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as LeadSource | "ALL")}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Tất cả nguồn lead</option>
          <option value="Website">Website</option>
          <option value="Facebook">Facebook</option>
          <option value="Zalo">Zalo</option>
          <option value="Giới thiệu">Giới thiệu</option>
          <option value="Telesales">Telesales</option>
          <option value="Google Ads">Google Ads</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Họ tên &amp; Doanh nghiệp</th>
                <th>Liên hệ</th>
                <th>Nhu cầu in ấn</th>
                <th>Nguồn lead</th>
                <th>Trạng thái pipeline</th>
                <th className="text-right">Giá trị ước tính</th>
                <th>NV Phụ trách</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Không tìm thấy lead nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const cfg = STATUS_CONFIG[lead.status];
                  const srcBadge = SOURCE_COLORS[lead.source] || "bg-slate-50 text-slate-700";

                  return (
                    <tr key={lead.id} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 uppercase">
                            {lead.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{lead.company || "Cá nhân"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="text-xs space-y-0.5">
                          <div className="font-medium text-slate-800 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                          {lead.email && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="font-medium text-slate-800 max-w-[200px] truncate" title={lead.printingNeed}>
                          {lead.printingNeed}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lead.createdAt}
                        </div>
                      </td>

                      <td>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${srcBadge}`}>
                          {lead.source}
                        </span>
                      </td>

                      <td>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bgColor} ${cfg.color} ${cfg.borderColor}`}>
                          {cfg.icon}
                          <span>{cfg.label}</span>
                        </span>
                      </td>

                      <td className="text-right font-extrabold text-slate-900">
                        {lead.estimatedValue ? formatVND(lead.estimatedValue) : "—"}
                      </td>

                      <td className="text-slate-700 font-medium text-xs">
                        {lead.assignedTo || "Chưa phân bổ"}
                      </td>

                      <td className="text-center">
                        <button className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer">
                          Chuyển đơn &gt;
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
    </div>
  );
};
