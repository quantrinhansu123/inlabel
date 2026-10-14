"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar, NavTab } from "@/components/Sidebar";
import { SalesReportView } from "@/components/SalesReportView";
import { OrdersWorkflowView } from "@/components/OrdersWorkflowView";
import { InteractiveDiagramModal } from "@/components/InteractiveDiagramModal";
import { OrderActionModal } from "@/components/OrderActionModal";
import { CreateOrderModal } from "@/components/CreateOrderModal";
import { OriginalImagesModal } from "@/components/OriginalImagesModal";
import { LeadListView } from "@/components/LeadListView";
import { CustomerListView } from "@/components/CustomerListView";
import { QuotationListView } from "@/components/QuotationListView";
import { CreateQuotationModal } from "@/components/CreateQuotationModal";
import { PricingPolicyView } from "@/components/PricingPolicyView";
import { InventoryView } from "@/components/InventoryView";
import { CreateLeadModal } from "@/components/CreateLeadModal";
import { CreateCustomerModal } from "@/components/CreateCustomerModal";
import { DesignTemplateListView } from "@/components/DesignTemplateListView";
import { CreateDesignTemplateModal } from "@/components/CreateDesignTemplateModal";
import { CustomerDetailModal } from "@/components/CustomerDetailModal";
import { FinanceView } from "@/components/FinanceView";
import { CreatePaymentModal } from "@/components/CreatePaymentModal";
import { FundAccountModal } from "@/components/FundAccountModal";
import {
  INITIAL_ORDERS,
  INITIAL_LEADS,
  INITIAL_CUSTOMERS,
  INITIAL_QUOTATIONS,
  INITIAL_INVENTORY,
  INITIAL_PRICING,
  INITIAL_DESIGN_TEMPLATES,
  INITIAL_PAYMENTS,
  INITIAL_STOCK_VOUCHERS,
  INITIAL_FUND_ACCOUNTS,
} from "@/data/mockData";
import { SalesOrder, Lead, Customer, Quotation, InventoryItem, PricingCategoryItem, DesignTemplate, PaymentVoucher, StockVoucher, FundAccount } from "@/types";
import {
  FileText,
  DollarSign,
  ShoppingCart,
  Cpu,
  Layers,
  Archive,
  Truck,
  Receipt,
  Workflow,
  Sparkles,
  ArrowRight,
  Plus,
  PackageCheck,
  CheckCircle2,
  Calendar,
  Box,
  TrendingUp,
} from "lucide-react";

const VALID_TABS: NavTab[] = [
  "sales-report",
  "orders-flow",
  "quotations",
  "pricing",
  "leads",
  "customers",
  "lsx",
  "bom",
  "inventory",
  "receipts",
  "exports",
  "design-templates",
  "diagram-view",
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState<NavTab>("sales-report");
  const [financeSub, setFinanceSub] = useState<string>("cashbook");
  const [invSub, setInvSub] = useState<string>("stock");

  // Đồng bộ tab + tab con từ URL (?tab=...&fin=...&inv=...) khi load / back-forward
  useEffect(() => {
    const t = searchParams.get("tab") as NavTab | null;
    if (t && VALID_TABS.includes(t)) {
      setCurrentTab(t);
    }
    const f = searchParams.get("fin");
    if (f && ["cashbook", "receipts", "payments", "accounts"].includes(f)) {
      setFinanceSub(f);
    }
    const iv = searchParams.get("inv");
    if (iv && ["stock", "inbound"].includes(iv)) {
      setInvSub(iv);
    }
  }, [searchParams]);

  // Click hạng mục -> đổi state + đẩy lên URL để thấy router
  const handleSelectTab = (tab: NavTab, sub?: string) => {
    setCurrentTab(tab);
    if (tab === "receipts") {
      const f = sub || financeSub || "cashbook";
      setFinanceSub(f);
      router.replace(`?tab=${tab}&fin=${f}`, { scroll: false });
    } else if (tab === "inventory") {
      const iv = sub || invSub || "stock";
      setInvSub(iv);
      router.replace(`?tab=${tab}&inv=${iv}`, { scroll: false });
    } else {
      router.replace(`?tab=${tab}`, { scroll: false });
    }
  };
  const [orders, setOrders] = useState<SalesOrder[]>(INITIAL_ORDERS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [quotations, setQuotations] = useState<Quotation[]>(INITIAL_QUOTATIONS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [pricingItems] = useState<PricingCategoryItem[]>(INITIAL_PRICING);
  const [designTemplates, setDesignTemplates] = useState<DesignTemplate[]>(INITIAL_DESIGN_TEMPLATES);
  const [payments, setPayments] = useState<PaymentVoucher[]>(INITIAL_PAYMENTS);
  const [stockVouchers, setStockVouchers] = useState<StockVoucher[]>(INITIAL_STOCK_VOUCHERS);
  const [fundAccounts, setFundAccounts] = useState<FundAccount[]>(INITIAL_FUND_ACCOUNTS);
  const [editingAccount, setEditingAccount] = useState<FundAccount | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Modals state
  const [isDiagramOpen, setIsDiagramOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOriginalImagesOpen, setIsOriginalImagesOpen] = useState(false);
  const [isCreateQuotationOpen, setIsCreateQuotationOpen] = useState(false);
  const [isCreateLeadOpen, setIsCreateLeadOpen] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [isCreateDesignOpen, setIsCreateDesignOpen] = useState(false);
  const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
  const [isFundAccountOpen, setIsFundAccountOpen] = useState(false);

  // Chọn đơn hàng để xem chi tiết & tương tác quy trình
  const handleSelectOrder = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsActionModalOpen(true);
  };

  // Cập nhật đơn hàng sau khi thao tác
  const handleUpdateOrder = (updatedOrder: SalesOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setSelectedOrder(updatedOrder);
  };

  // Thêm đơn hàng mới
  const handleCreateOrder = (newOrder: SalesOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Thêm báo giá mới
  const handleCreateQuotation = (newQuotation: Quotation) => {
    setQuotations((prev) => [newQuotation, ...prev]);
  };

  // Thêm Lead mới
  const handleCreateLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Thêm Khách hàng mới
  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  // Khách đang sửa (null = đang thêm mới)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Khách đang xem chi tiết
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  // Mở modal sửa khách hàng
  const handleOpenEditCustomer = (c: Customer) => {
    setEditingCustomer(c);
    setIsCreateCustomerOpen(true);
  };

  // Đóng modal khách hàng (reset trạng thái sửa)
  const handleCloseCustomerModal = () => {
    setIsCreateCustomerOpen(false);
    setEditingCustomer(null);
  };

  // Lưu thay đổi khách hàng + lan sang snapshot KH trong đơn hàng
  const handleUpdateCustomer = (updated: Customer) => {
    setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setOrders((prev) =>
      prev.map((o) =>
        o.customer.id === updated.id ? { ...o, customer: { ...o.customer, ...updated } } : o
      )
    );
    setEditingCustomer(null);
  };

  // Xóa khách hàng (đơn cũ giữ snapshot)
  const handleDeleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (editingCustomer?.id === id) setEditingCustomer(null);
  };

  // Từ 1 khách -> sang tab đơn hàng để tạo đơn mới
  const handleCreateOrderForCustomer = (c: Customer) => {
    handleSelectTab("orders-flow");
    setIsCreateModalOpen(true);
  };

  // Thêm Mẫu thiết kế mới
  const handleCreateDesign = (t: DesignTemplate) => {
    setDesignTemplates((prev) => [t, ...prev]);
  };

  // Thêm Phiếu chi mới
  const handleCreatePayment = (v: PaymentVoucher) => {
    setPayments((prev) => [v, ...prev]);
  };

  // Xóa Phiếu chi
  const handleDeletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Nhập kho NVL: ghi sổ phiếu + cộng tồn kho
  const handleStockImport = (v: StockVoucher) => {
    setStockVouchers((prev) => [v, ...prev]);
    setInventoryItems((prev) =>
      prev.map((it) =>
        it.id === v.itemId
          ? { ...it, quantity: it.quantity + v.quantity, lastUpdated: "Hôm nay" }
          : it
      )
    );
  };

  // CRUD Tài khoản quỹ
  const handleCreateAccount = (a: FundAccount) => {
    setFundAccounts((prev) => [a, ...prev]);
  };
  const handleOpenEditAccount = (a: FundAccount) => {
    setEditingAccount(a);
    setIsFundAccountOpen(true);
  };
  const handleCloseAccountModal = () => {
    setIsFundAccountOpen(false);
    setEditingAccount(null);
  };
  const handleUpdateAccount = (updated: FundAccount) => {
    setFundAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setEditingAccount(null);
  };
  const handleDeleteAccount = (id: string) => {
    setFundAccounts((prev) => prev.filter((a) => a.id !== id));
    if (editingAccount?.id === id) setEditingAccount(null);
  };

  // Sổ quỹ đầu kỳ = tổng số dư đầu kỳ các tài khoản
  const OPENING_BALANCE = fundAccounts.reduce((s, a) => s + (a.openingBalance || 0), 0);

  // Xóa Mẫu thiết kế
  const handleDeleteDesign = (id: string) => {
    setDesignTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Chuyển Báo giá thành Đơn hàng (Phiếu bán hàng) theo sơ đồ START (Ảnh 2)
  const handleConvertQuotationToOrder = (quotation: Quotation) => {
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 5);
    const delivStr = `${deliveryDate.getDate()}/${deliveryDate.getMonth() + 1}/${deliveryDate.getFullYear()}`;

    const totalQty = quotation.items.reduce((s, it) => s + it.quantity, 0);

    // Tìm hoặc tạo khách hàng liên kết
    let matchedCustomer = customers.find(
      (c) => c.phone === quotation.customerPhone || c.name === quotation.customerName
    );

    if (!matchedCustomer) {
      matchedCustomer = {
        id: `KH-${Date.now().toString().slice(-4)}`,
        name: quotation.customerName,
        group: "Khách hàng doanh nghiệp",
        phone: quotation.customerPhone,
        address: quotation.customerCompany || "Hà Nội",
        email: "",
        totalOrders: 1,
        totalRevenue: quotation.totalAmount,
      };
      setCustomers((prev) => [matchedCustomer!, ...prev]);
    } else {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === matchedCustomer!.id
            ? {
                ...c,
                totalOrders: (c.totalOrders || 0) + 1,
                totalRevenue: (c.totalRevenue || 0) + quotation.totalAmount,
              }
            : c
        )
      );
    }

    const newSalesBillNum = `BH2510${Math.floor(10 + Math.random() * 89)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: SalesOrder = {
      id: `DH-${Date.now().toString().slice(-4)}`,
      salesBillNumber: newSalesBillNum,
      orderDate: dateStr,
      deliveryDate: delivStr,
      customer: matchedCustomer,
      salesRep: quotation.salesRep,
      step: "WAITING_PSX", // Đơn hàng mới chuyển sang Phòng Sản Xuất tiếp nhận (Bước 1 -> Bước 2 trong Ảnh 2)
      items: quotation.items,
      subTotal: quotation.subTotal,
      discount: quotation.discount,
      vat: quotation.vat,
      totalAmount: quotation.totalAmount,
      receipts: [],
      exports: [],
      paidAmount: 0,
      debtAmount: quotation.totalAmount,
      totalQtyOrdered: totalQty,
      totalQtyExported: 0,
      remainingQty: totalQty,
    };

    // Cập nhật trạng thái báo giá
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quotation.id
          ? { ...q, status: "CONVERTED", convertedOrderId: newOrder.id }
          : q
      )
    );

    // Thêm vào danh sách đơn hàng
    setOrders((prev) => [newOrder, ...prev]);

    // Mở quy trình đơn hàng và hiển thị popup hành động
    handleSelectTab("orders-flow");
    setSelectedOrder(newOrder);
    setIsActionModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Cột trái: Sidebar điều hướng SaaS cao cấp */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        orderCount={orders.length}
        activeSub={currentTab === "receipts" ? financeSub : currentTab === "inventory" ? invSub : undefined}
      />

      {/* Cột phải: Khung nội dung chính */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header trên cùng */}
        <Header
          onOpenDiagram={() => setIsDiagramOpen(true)}
          onOpenOriginalImages={() => setIsOriginalImagesOpen(true)}
          notificationCount={orders.filter((o) => o.step === "WAITING_PSX").length}
        />

        {/* Nội dung theo Tab đang chọn */}
        <main className="app-main flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* TAB 1: BÁO CÁO BÁN HÀNG (Ảnh 1) */}
          {currentTab === "sales-report" && (
            <SalesReportView
              orders={orders}
              onSelectOrder={handleSelectOrder}
              onOpenCreateOrder={() => setIsCreateModalOpen(true)}
            />
          )}

          {/* TAB 2: QUY TRÌNH ĐƠN HÀNG IN ẤN (Ảnh 2) */}
          {currentTab === "orders-flow" && (
            <OrdersWorkflowView
              orders={orders}
              onSelectOrder={handleSelectOrder}
              onUpdateOrder={handleUpdateOrder}
              onOpenCreateOrder={() => setIsCreateModalOpen(true)}
              onOpenDiagram={() => setIsDiagramOpen(true)}
            />
          )}

          {/* TAB: DANH SÁCH LEAD */}
          {currentTab === "leads" && (
            <LeadListView
              leads={leads}
              onOpenCreateLead={() => setIsCreateLeadOpen(true)}
            />
          )}

          {/* TAB: DANH SÁCH KHÁCH HÀNG */}
          {currentTab === "customers" && (
            <CustomerListView
              customers={customers}
              onOpenCreateCustomer={() => {
                setEditingCustomer(null);
                setIsCreateCustomerOpen(true);
              }}
              onViewCustomer={setViewingCustomer}
              onEditCustomer={handleOpenEditCustomer}
              onDeleteCustomer={handleDeleteCustomer}
              onCreateOrderForCustomer={handleCreateOrderForCustomer}
            />
          )}

          {/* TAB 3: SƠ ĐỒ ĐỒ HỌA TOÀN DIỆN (Ảnh 2 Poster) */}
          {currentTab === "diagram-view" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Sơ Đồ Quy Trình Quản Lý In Ấn (Hệ thống Fsolution)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mô phỏng toàn bộ sơ đồ đồ họa từ file `anh2.jpg` với tính năng tương tác trực tiếp
                  </p>
                </div>
                <button
                  onClick={() => setIsOriginalImagesOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all cursor-pointer"
                >
                  Đối chiếu với ảnh gốc
                </button>
              </div>

              {/* Nhúng giao diện sơ đồ lớn */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
                <InteractiveDiagramModal
                  isOpen={true}
                  onClose={() => handleSelectTab("orders-flow")}
                />
              </div>
            </div>
          )}

          {/* TAB: LỆNH SẢN XUẤT (LSX) */}
          {currentTab === "lsx" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Quản Lý Lệnh Sản Xuất (LSX) &amp; Tổ In
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bước 4 &amp; 5 trong quy trình: Sinh LSX từ đơn hàng, điều phối máy in Heidelberg, máy in nhanh KTS và tổ gia công BTP
                  </p>
                </div>
                <button
                  onClick={() => handleSelectTab("orders-flow")}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
                >
                  Xem dòng đơn hàng &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders
                  .filter((o) => o.productionOrder)
                  .map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className="saas-card p-5 space-y-3 cursor-pointer group hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="font-mono font-bold text-indigo-600 text-sm group-hover:text-indigo-800">
                          {order.productionOrder?.lsxCode}
                        </span>
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded-full">
                          {order.step}
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-600">
                        <div>
                          Khách hàng: <strong className="text-slate-900">{order.customer.name}</strong>
                        </div>
                        <div>
                          Máy in: <strong className="text-slate-800">{order.productionOrder?.machine}</strong>
                        </div>
                        <div>
                          Phụ trách: <strong className="text-slate-800">{order.productionOrder?.psxLead}</strong>
                        </div>
                        <div>
                          Phiếu bán liên kết: <span className="font-mono text-indigo-600 font-semibold">{order.salesBillNumber}</span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Định mức: {order.productionOrder?.bomItems.length} loại NVL</span>
                        <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                          Chi tiết &gt;
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: ĐỊNH MỨC NVL (BOM) */}
          {currentTab === "bom" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Định Mức Nguyên Vật Liệu (BOM) In Ấn
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bảng tổng hợp định mức giấy, kẽm CTP, mực in và vật tư gia công theo từng đơn hàng đã phát hành LSX
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Mã đơn / LSX</th>
                      <th>Sản phẩm in</th>
                      <th>Vật tư định mức (Giấy / Kẽm / Mực)</th>
                      <th className="text-right">SL Định mức</th>
                      <th>Đơn vị</th>
                      <th>Trạng thái cấp kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter((o) => o.productionOrder)
                      .flatMap((o) =>
                        o.productionOrder!.bomItems.map((bom, idx) => (
                          <tr key={`${o.id}-${idx}`}>
                            <td>
                              <span className="font-mono text-indigo-600 font-bold">
                                {o.salesBillNumber} / {o.productionOrder?.lsxCode}
                              </span>
                            </td>
                            <td className="text-slate-900 font-medium">
                              {o.items[0]?.name}
                            </td>
                            <td className="font-semibold text-slate-800">
                              {bom.materialName}
                            </td>
                            <td className="text-right font-extrabold text-slate-900">
                              {bom.plannedQty}
                            </td>
                            <td className="text-slate-600 font-medium">{bom.unit}</td>
                            <td>
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {bom.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TÀI CHÍNH — SỔ QUỸ / PHIẾU THU / PHIẾU CHI / TÀI KHOẢN (Nhánh A) */}
          {currentTab === "receipts" && (
            <FinanceView
              orders={orders}
              payments={payments}
              accounts={fundAccounts}
              openingBalance={OPENING_BALANCE}
              subTab={financeSub as "cashbook" | "receipts" | "payments" | "accounts"}
              onSubTabChange={(sub) => handleSelectTab("receipts", sub)}
              onOpenCreatePayment={() => setIsCreatePaymentOpen(true)}
              onDeletePayment={handleDeletePayment}
              onOpenCreateAccount={() => {
                setEditingAccount(null);
                setIsFundAccountOpen(true);
              }}
              onEditAccount={handleOpenEditAccount}
              onDeleteAccount={handleDeleteAccount}
              onGoToOrders={() => handleSelectTab("orders-flow")}
            />
          )}

          {/* TAB: PHIẾU XUẤT KHO (Nhánh B trong Ảnh 2) */}
          {currentTab === "exports" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Quản Lý Phiếu Xuất Kho &amp; Giao Hàng (Nhánh B)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý xuất kho thành phẩm in ấn, địa chỉ giao hàng và trạng thái xuất hàng
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Mã phiếu xuất</th>
                      <th>Ngày xuất</th>
                      <th>Đơn hàng liên kết</th>
                      <th>Khách hàng nhận</th>
                      <th className="text-right">SL xuất</th>
                      <th>Địa chỉ giao</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .flatMap((o) =>
                        o.exports.map((e) => ({ ...e, orderRef: o }))
                      )
                      .map((exp) => (
                        <tr key={exp.id}>
                          <td>
                            <span className="font-mono font-bold text-indigo-700">
                              {exp.code}
                            </span>
                          </td>
                          <td className="text-slate-600">{exp.date}</td>
                          <td className="font-mono text-indigo-600 font-semibold">
                            {exp.orderRef.salesBillNumber}
                          </td>
                          <td className="font-semibold text-slate-900">
                            {exp.receiver}
                          </td>
                          <td className="text-right font-bold text-slate-900">
                            {exp.exportedQty.toLocaleString("vi-VN")}
                          </td>
                          <td className="text-slate-600">{exp.address}</td>
                          <td>
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                              <Truck className="w-3 h-3 text-indigo-600" />
                              {exp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: TỒN KHO NGUYÊN VẬT LIỆU */}
          {currentTab === "inventory" && (
            <InventoryView
              items={inventoryItems}
              inboundVouchers={stockVouchers.filter((v) => v.type === "IMPORT")}
              subTab={invSub as "stock" | "inbound"}
              onSubTabChange={(sub) => handleSelectTab("inventory", sub)}
              onImportVoucher={handleStockImport}
            />
          )}

          {/* TAB: QUẢN LÝ BÁO GIÁ IN ẤN */}
          {currentTab === "quotations" && (
            <QuotationListView
              quotations={quotations}
              onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
              onConvertQuotationToOrder={handleConvertQuotationToOrder}
            />
          )}

          {/* TAB: CHÍNH SÁCH BẢNG GIÁ DỊCH VỤ */}
          {currentTab === "pricing" && (
            <PricingPolicyView
              pricingItems={pricingItems}
              onOpenCreateQuotation={() => setIsCreateQuotationOpen(true)}
            />
          )}

          {/* TAB: MẪU THIẾT KẾ */}
          {currentTab === "design-templates" && (
            <DesignTemplateListView
              templates={designTemplates}
              onOpenCreate={() => setIsCreateDesignOpen(true)}
              onDelete={handleDeleteDesign}
            />
          )}
        </main>
      </div>

      {/* POPUP MODALS */}

      {/* 1. Modal Xem Sơ đồ Quy trình Ảnh 2 tương tác */}
      <InteractiveDiagramModal
        isOpen={isDiagramOpen}
        onClose={() => setIsDiagramOpen(false)}
        onStepFilter={() => {
          handleSelectTab("orders-flow");
        }}
      />

      {/* 2. Modal Thao tác Đơn hàng & Chuyển trạng thái quy trình */}
      <OrderActionModal
        order={selectedOrder}
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        onUpdateOrder={handleUpdateOrder}
        designTemplates={designTemplates}
      />

      {/* 3. Modal Tạo mới Đơn đặt hàng in ấn */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateOrder={handleCreateOrder}
      />

      {/* 4. Modal Đối chiếu trực tiếp 2 ảnh gốc */}
      <OriginalImagesModal
        isOpen={isOriginalImagesOpen}
        onClose={() => setIsOriginalImagesOpen(false)}
      />

      {/* 5. Modal Khởi tạo Báo giá in ấn mới */}
      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => setIsCreateQuotationOpen(false)}
        onCreateQuotation={handleCreateQuotation}
      />

      {/* 6. Modal Thêm Lead khách hàng tiềm năng mới */}
      <CreateLeadModal
        isOpen={isCreateLeadOpen}
        onClose={() => setIsCreateLeadOpen(false)}
        onCreateLead={handleCreateLead}
      />

      {/* 7. Modal Thêm / Sửa Khách hàng */}
      <CreateCustomerModal
        isOpen={isCreateCustomerOpen}
        onClose={handleCloseCustomerModal}
        onCreateCustomer={handleCreateCustomer}
        editingCustomer={editingCustomer}
        onUpdateCustomer={handleUpdateCustomer}
      />

      {/* 7b. Modal Xem chi tiết Khách hàng */}
      <CustomerDetailModal
        customer={viewingCustomer}
        orders={orders}
        designTemplates={designTemplates}
        onClose={() => setViewingCustomer(null)}
        onEdit={(c) => {
          setViewingCustomer(null);
          handleOpenEditCustomer(c);
        }}
        onCreateOrder={(c) => {
          setViewingCustomer(null);
          handleCreateOrderForCustomer(c);
        }}
      />

      {/* 8. Modal Thêm Mẫu thiết kế mới */}
      <CreateDesignTemplateModal
        isOpen={isCreateDesignOpen}
        onClose={() => setIsCreateDesignOpen(false)}
        onCreate={handleCreateDesign}
        customers={customers}
      />

      {/* 9. Modal Lập Phiếu chi mới */}
      <CreatePaymentModal
        isOpen={isCreatePaymentOpen}
        onClose={() => setIsCreatePaymentOpen(false)}
        onCreate={handleCreatePayment}
        accounts={fundAccounts}
      />

      {/* 10. Modal Thêm / Sửa Tài khoản quỹ */}
      <FundAccountModal
        isOpen={isFundAccountOpen}
        onClose={handleCloseAccountModal}
        onCreate={handleCreateAccount}
        editingAccount={editingAccount}
        onUpdate={handleUpdateAccount}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Đang tải...</div>}>
      <HomeContent />
    </Suspense>
  );
}
