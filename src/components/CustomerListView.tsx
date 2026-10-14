"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  Calendar,
  ShoppingBag,
  TrendingUp,
  ChevronDown,
  Star,
  Crown,
  Users,
  FileText,
  ExternalLink,
  ShieldCheck,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { Customer } from "@/types";

interface CustomerListViewProps {
  customers: Customer[];
  onOpenCreateCustomer?: () => void;
  onViewCustomer?: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  onCreateOrderForCustomer?: (customer: Customer) => void;
}

const GROUP_COLORS: Record<string, string> = {
  "Khách hàng doanh nghiệp": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Nhóm khách hàng vãng lai": "bg-slate-100 text-slate-700 border-slate-200",
  "Khách hàng startup": "bg-violet-50 text-violet-700 border-violet-200",
};

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onOpenCreateCustomer,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onCreateOrderForCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name" | "revenue" | "orders">("revenue");

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  const groups = useMemo(
    () => [...new Set(customers.map((c) => c.group))],
    [customers]
  );

  const filteredCustomers = useMemo(() => {
    let result = customers.filter((c) => {
      const matchesSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.taxCode?.includes(searchQuery) ||
        c.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = groupFilter === "ALL" || c.group === groupFilter;
      return matchesSearch && matchesGroup;
    });
    result.sort((a, b) => {
      if (sortBy === "revenue") return (b.totalRevenue || 0) - (a.totalRevenue || 0);
      if (sortBy === "orders") return (b.totalOrders || 0) - (a.totalOrders || 0);
      return a.name.localeCompare(b.name, "vi");
    });
    return result;
  }, [customers, searchQuery, groupFilter, sortBy]);

  // Stats
  const stats = useMemo(() => {
    const total = customers.length;
    const enterprise = customers.filter(
      (c) => c.group === "Khách hàng doanh nghiệp"
    ).length;
    const totalRevenue = customers.reduce(
      (s, c) => s + (c.totalRevenue || 0),
      0
    );
    const totalOrders = customers.reduce(
      (s, c) => s + (c.totalOrders || 0),
      0
    );
    return { total, enterprise, totalRevenue, totalOrders };
  }, [customers]);

  // Tier badge
  const getTier = (revenue: number) => {
    if (revenue >= 100000000)
      return {
        label: "VIP Diamond",
        icon: <Crown className="w-3 h-3" />,
        color: "text-amber-700 bg-amber-50 border-amber-300",
      };
    if (revenue >= 10000000)
      return {
        label: "Gold Partner",
        icon: <Star className="w-3 h-3" />,
        color: "text-yellow-800 bg-yellow-50 border-yellow-300",
      };
    return {
      label: "Standard",
      icon: <User className="w-3 h-3" />,
      color: "text-slate-600 bg-slate-50 border-slate-200",
    };
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <span>CRM &amp; Khách hàng</span>
            <span>/</span>
            <span className="text-slate-500">Cơ sở dữ liệu khách hàng</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Danh Sách Khách Hàng In Ấn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý hồ sơ công ty, hạn mức công nợ, lịch sử mua hàng và doanh thu tích lũy
          </p>
        </div>
        <button
          onClick={onOpenCreateCustomer}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm khách hàng</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card blue">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số khách hàng
            </span>
            <div className="stat-icon blue">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <div className="text-xs text-slate-400 mt-2">Đang hoạt động trên hệ thống</div>
        </div>

        <div className="stat-card violet">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Khách Doanh nghiệp
            </span>
            <div className="stat-icon violet">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">{stats.enterprise}</div>
          <div className="text-xs text-slate-400 mt-2">Hợp đồng in định kỳ</div>
        </div>

        <div className="stat-card emerald">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng doanh thu tích lũy
            </span>
            <div className="stat-icon emerald">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {formatVND(stats.totalRevenue)}
          </div>
          <div className="text-xs text-slate-400 mt-2">Bao gồm toàn bộ đơn đã chốt</div>
        </div>

        <div className="stat-card amber">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng đơn đặt hàng
            </span>
            <div className="stat-icon amber">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.totalOrders}</div>
          <div className="text-xs text-slate-400 mt-2">Bình quân {(stats.totalOrders / (stats.total || 1)).toFixed(1)} đơn / KH</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên khách, SĐT, email, mã số thuế, địa chỉ xưởng..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition"
          />
        </div>

        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Tất cả nhóm khách</option>
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "revenue" | "orders")}
          className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
        >
          <option value="revenue">Sắp xếp: Doanh thu cao nhất</option>
          <option value="orders">Sắp xếp: Nhiều đơn nhất</option>
          <option value="name">Sắp xếp: Tên A-Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Khách hàng &amp; Phân hạng</th>
                <th>Nhóm khách</th>
                <th>Liên hệ</th>
                <th>Mã số thuế &amp; Địa chỉ</th>
                <th className="text-center">Số đơn</th>
                <th className="text-right">Tổng doanh thu</th>
                <th>Hạn mức nợ</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    Không tìm thấy khách hàng nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const tier = getTier(cust.totalRevenue || 0);
                  const grpBadge = GROUP_COLORS[cust.group] || "bg-slate-50 text-slate-700";

                  return (
                    <tr key={cust.id} className="cursor-pointer">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs uppercase">
                            {cust.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {cust.name}
                            </div>
                            <div className="mt-0.5">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded border ${tier.color}`}>
                                {tier.icon}
                                <span>{tier.label}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${grpBadge}`}>
                          {cust.group}
                        </span>
                      </td>

                      <td>
                        <div className="text-xs space-y-0.5">
                          <div className="font-medium text-slate-800 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{cust.phone}</span>
                          </div>
                          {cust.email && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{cust.email}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className="text-xs text-slate-700 max-w-[220px] truncate" title={cust.address}>
                          <MapPin className="w-3 h-3 inline text-slate-400 mr-1" />
                          <span>{cust.address}</span>
                        </div>
                        {cust.taxCode && (
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            MST: {cust.taxCode}
                          </div>
                        )}
                      </td>

                      <td className="text-center font-bold text-slate-800">
                        {cust.totalOrders || 0}
                      </td>

                      <td className="text-right font-extrabold text-slate-900">
                        {cust.totalRevenue ? formatVND(cust.totalRevenue) : "0 đ"}
                      </td>

                      <td className="text-xs font-semibold text-slate-600">
                        {cust.creditLimit ? formatVND(cust.creditLimit) : "Tiền mặt"}
                      </td>

                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onViewCustomer?.(cust)}
                            title="Xem chi tiết khách hàng"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Xem
                          </button>
                          <button
                            onClick={() => onEditCustomer?.(cust)}
                            title="Sửa thông tin khách hàng"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Sửa
                          </button>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Xóa khách hàng "${cust.name}"?\nCác đơn hàng cũ vẫn giữ snapshot thông tin.`
                                )
                              ) {
                                onDeleteCustomer?.(cust.id);
                              }
                            }}
                            title="Xóa khách hàng"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                          <button
                            onClick={() => onCreateOrderForCustomer?.(cust)}
                            title="Tạo đơn hàng cho khách này"
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition cursor-pointer"
                          >
                            Tạo đơn &gt;
                          </button>
                        </div>
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
