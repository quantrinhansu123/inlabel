"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Box,
  Layers,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Ruler,
  FileText,
  DollarSign,
  ShoppingCart,
  Send,
  Eye,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
  Flame,
  Zap,
  TrendingUp,
  PackageCheck,
  Package,
} from "lucide-react";
import { Product, ProductCategory } from "@/types";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CreateProductModal } from "@/components/CreateProductModal";

interface ProductListViewProps {
  products: Product[];
  onCreateProduct: (product: Product) => void;
  onSelectProductForOrder?: (product: Product) => void;
  onSelectProductForQuotation?: (product: Product) => void;
}

const CATEGORIES: { id: "ALL" | ProductCategory; label: string; icon: React.ReactNode }[] = [
  { id: "ALL", label: "Tất cả danh mục", icon: <Package className="w-3.5 h-3.5" /> },
  { id: "Ấn phẩm quảng cáo", label: "Ấn phẩm quảng cáo", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "Ấn phẩm văn phòng", label: "Ấn phẩm văn phòng", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "Bao bì & Hộp giấy", label: "Bao bì & Hộp giấy", icon: <Box className="w-3.5 h-3.5" /> },
  { id: "Tem nhãn & Decal", label: "Tem nhãn & Decal", icon: <Tag className="w-3.5 h-3.5" /> },
  { id: "Ấn phẩm sự kiện", label: "Ấn phẩm sự kiện", icon: <Layers className="w-3.5 h-3.5" /> },
];

export const ProductListView: React.FC<ProductListViewProps> = ({
  products,
  onCreateProduct,
  onSelectProductForOrder,
  onSelectProductForQuotation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | ProductCategory>("ALL");
  const [selectedPrintMethod, setSelectedPrintMethod] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "name">("popular");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const formatVND = (val: number) =>
    new Intl.NumberFormat("vi-VN").format(val) + " đ";

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.defaultPaper.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.standardDimensions.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const matchMethod =
        selectedPrintMethod === "ALL" || p.printMethod === selectedPrintMethod;
      const matchStatus =
        selectedStatus === "ALL" || p.status === selectedStatus;

      return matchSearch && matchCat && matchMethod && matchStatus;
    });

    list.sort((a, b) => {
      if (sortBy === "popular") return b.totalOrdersCount - a.totalOrdersCount;
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      return a.name.localeCompare(b.name, "vi");
    });

    return list;
  }, [products, searchQuery, selectedCategory, selectedPrintMethod, selectedStatus, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.status === "ACTIVE").length;
    const fast24h = products.filter((p) => p.productionLeadTime.includes("24h")).length;
    const totalOrders = products.reduce((acc, p) => acc + p.totalOrdersCount, 0);
    return { total, active, fast24h, totalOrders };
  }, [products]);

  const handleOpenDetail = (p: Product) => {
    setDetailProduct(p);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Quản Lý Danh Mục Sản Phẩm &amp; Dịch Vụ In Ấn
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {products.length} sản phẩm
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy chuẩn thông số kỹ thuật (Kích thước, loại giấy, công nghệ in offset/KTS, gia công sau in) và đơn giá cơ sở
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="stat-card blue">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Tổng số ấn phẩm</span>
            <Box className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">
            {stats.total} dòng
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.active} đang nhận đặt hàng
          </div>
        </div>

        <div className="stat-card emerald">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>In Nhanh 24h Lấy Ngay</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {stats.fast24h} ấn phẩm
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Giao hỏa tốc trong ngày
          </div>
        </div>

        <div className="stat-card violet">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Tổng lượt đơn đã in</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {stats.totalOrders.toLocaleString("vi-VN")} lượt
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Theo dữ liệu sản xuất
          </div>
        </div>

        <div className="stat-card amber">
          <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between">
            <span>Ấn phẩm Best-seller</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-amber-900 mt-1.5 truncate">
            Card Visit &amp; Catalogue
          </div>
          <div className="text-[11px] text-amber-700 font-medium mt-1">
            &gt; 500 lượt đặt hàng
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer border ${
              selectedCategory === cat.id
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {cat.id !== "ALL" && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {products.filter((p) => p.category === cat.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 4. Search & Controls Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, mã SKU, chất liệu giấy, kích thước, tag..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Dropdowns & View toggles */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Filter Print Method */}
          <select
            value={selectedPrintMethod}
            onChange={(e) => setSelectedPrintMethod(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Mọi công nghệ in</option>
            <option value="In offset 4 màu">In offset 4 màu</option>
            <option value="In nhanh kỹ thuật số">In nhanh KTS</option>
            <option value="In offset hoặc KTS">In offset hoặc KTS</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="name">Tên sản phẩm (A-Z)</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ Thẻ (Grid)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Chế độ Bảng (Table)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Products Display: Grid or Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Box className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-sm">Không tìm thấy sản phẩm phù hợp</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Thử thay đổi từ khóa tìm kiếm hoặc chọn nhóm danh mục khác để xem danh sách ấn phẩm.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedPrintMethod("ALL");
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Card Top Banner / Tags */}
              <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50/70 to-white flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${
                      p.colorAccent || "from-indigo-500 to-violet-600"
                    } text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                  >
                    <Box className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {p.code}
                    </span>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {p.category}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Đang nhận đơn
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {p.totalOrdersCount} lượt in
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col space-y-3">
                <h3
                  onClick={() => handleOpenDetail(p)}
                  className="font-bold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  {p.name}
                </h3>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Specs Box */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Ruler className="w-3 h-3 text-slate-400" /> Khổ in:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]">
                      {p.standardDimensions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400" /> Giấy:
                    </span>
                    <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={p.defaultPaper}>
                      {p.defaultPaper}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Printer className="w-3 h-3 text-slate-400" /> Hệ in:
                    </span>
                    <span className="font-bold text-indigo-700">
                      {p.printMethod}
                    </span>
                  </div>
                </div>

                {/* Finishings */}
                <div className="flex flex-wrap gap-1">
                  {p.recommendedFinishing.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                  {p.recommendedFinishing.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-bold">
                      +{p.recommendedFinishing.length - 3}
                    </span>
                  )}
                </div>

                {/* Price and MOQ footer */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      MOQ: {p.minOrderQty} {p.unit} • {p.productionLeadTime}
                    </div>
                    <div className="text-base font-extrabold text-indigo-600 mt-0.5">
                      {formatVND(p.basePrice)}
                      <span className="text-[10px] font-normal text-slate-400 ml-1">
                        /{p.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenDetail(p)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="Xem chi tiết kỹ thuật"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {onSelectProductForOrder && (
                      <button
                        onClick={() => onSelectProductForOrder(p)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                        title="Tạo đơn hàng ngay"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Đặt in</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Mã SKU</th>
                <th>Tên sản phẩm in</th>
                <th>Danh mục</th>
                <th>Khổ chuẩn</th>
                <th>Chất liệu giấy</th>
                <th>Hệ in</th>
                <th className="text-right">MOQ</th>
                <th className="text-right">Đơn giá cơ sở</th>
                <th>Thời gian</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td>
                    <span className="font-mono font-bold text-indigo-600 text-xs">
                      {p.code}
                    </span>
                  </td>
                  <td>
                    <div
                      onClick={() => handleOpenDetail(p)}
                      className="font-bold text-slate-900 hover:text-indigo-600 transition cursor-pointer"
                    >
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                      {p.recommendedFinishing.join(", ")}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-600 font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="font-medium text-slate-700 text-xs">
                    {p.standardDimensions}
                  </td>
                  <td className="text-xs text-slate-600 max-w-[150px] truncate" title={p.defaultPaper}>
                    {p.defaultPaper}
                  </td>
                  <td>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {p.printMethod}
                    </span>
                  </td>
                  <td className="text-right font-semibold text-slate-700 text-xs">
                    {p.minOrderQty.toLocaleString("vi-VN")} {p.unit}
                  </td>
                  <td className="text-right font-extrabold text-indigo-600 text-xs">
                    {formatVND(p.basePrice)}
                  </td>
                  <td className="text-xs text-slate-500 font-medium">
                    {p.productionLeadTime}
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenDetail(p)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {onSelectProductForOrder && (
                        <button
                          onClick={() => onSelectProductForOrder(p)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[11px] font-bold transition flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Đặt</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POPUP MODALS */}
      {/* 1. Modal Chi tiết Quy cách sản phẩm */}
      <ProductDetailModal
        product={detailProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onQuickOrder={(p) => {
          if (onSelectProductForOrder) onSelectProductForOrder(p);
        }}
        onQuickQuotation={(p) => {
          if (onSelectProductForQuotation) onSelectProductForQuotation(p);
        }}
      />

      {/* 2. Modal Tạo mới sản phẩm in ấn */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateProduct={onCreateProduct}
      />
    </div>
  );
};
