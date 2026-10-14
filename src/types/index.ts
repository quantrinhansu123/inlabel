export type OrderStep =
  | "DRAFT"              // 1. Lưu nháp
  | "WAITING_PSX"       // 1. Chờ PSX tiếp nhận
  | "PSX_ACCEPTED"      // 3. PSX đã tiếp nhận
  | "LSX_CREATED"       // 4. Đã tạo LSX
  | "IN_PRODUCTION"     // 5. Đang sản xuất
  | "PRODUCED"          // 6. Sản xuất xong
  | "SHIPPED"           // B. Đã xuất hàng
  | "COMPLETED";        // Hoàn thành

export type LeadStatus =
  | "NEW"               // Mới tiếp nhận
  | "CONTACTED"         // Đã liên hệ
  | "QUALIFIED"         // Đủ điều kiện
  | "PROPOSAL"          // Đang gửi báo giá
  | "NEGOTIATION"       // Đang đàm phán
  | "WON"              // Thắng - chuyển thành KH
  | "LOST";            // Mất

export type LeadSource =
  | "Website"
  | "Facebook"
  | "Zalo"
  | "Giới thiệu"
  | "Telesales"
  | "Triển lãm"
  | "Google Ads"
  | "Khác";

export interface Lead {
  id: string;
  name: string;           // Tên người liên hệ / công ty
  company?: string;       // Tên công ty (nếu cá nhân)
  phone: string;
  email?: string;
  source: LeadSource;     // Nguồn lead
  status: LeadStatus;
  assignedTo: string;     // Nhân viên phụ trách
  note?: string;
  estimatedValue?: number; // Giá trị dự kiến
  createdAt: string;      // Ngày tạo
  lastContactAt?: string; // Lần liên hệ cuối
  tags?: string[];        // Tag phân loại: "In offset", "In KTS", "Bao bì"...
  printingNeed?: string;  // Nhu cầu in ấn
}

export interface Customer {
  id: string;
  name: string;
  group: string;
  phone: string;
  address: string;
  taxCode?: string;
  email?: string;
  contactPerson?: string;  // Người liên hệ chính
  notes?: string;
  createdAt?: string;
  totalOrders?: number;    // Tổng số đơn
  totalRevenue?: number;   // Tổng doanh thu
  creditLimit?: number;    // Hạn mức tín dụng / công nợ
}

export type ProductCategory =
  | "Ấn phẩm quảng cáo"
  | "Ấn phẩm văn phòng"
  | "Bao bì & Hộp giấy"
  | "Tem nhãn & Decal"
  | "Ấn phẩm sự kiện";

export interface Product {
  id: string;
  code: string;                 // Mã SP (VD: SP-CAT-01, SP-NAME-02...)
  name: string;                 // Tên sản phẩm in
  category: ProductCategory;
  standardDimensions: string;   // Kích thước chuẩn
  defaultPaper: string;         // Chất liệu mặc định
  printMethod: "In offset 4 màu" | "In nhanh kỹ thuật số" | "In offset hoặc KTS";
  recommendedFinishing: string[]; // Danh sách quy cách gia công hoàn thiện
  unit: string;                 // Cuốn, Cái, Hộp, Tờ, Chiếc, Bộ, Cuộn
  basePrice: number;            // Đơn giá cơ sở / tham khảo
  minOrderQty: number;          // Số lượng đặt tối thiểu (MOQ)
  productionLeadTime: string;   // Thời gian giao hàng tiêu chuẩn (VD: 24h, 2-3 ngày, 3-5 ngày)
  status: "ACTIVE" | "INACTIVE"; // Đang nhận in / Tạm ngưng
  description: string;          // Mô tả đặc điểm & ứng dụng
  tags: string[];               // Tag nổi bật: "Bán chạy", "Lấy ngay", "Cao cấp"...
  totalOrdersCount: number;     // Lượt đặt hàng
  colorAccent?: string;         // Gradient màu nhận diện
}

export interface PrintItem {
  id: string;
  code: string;           // Mã sản phẩm
  name: string;           // Tên sản phẩm in
  dimensions: string;     // Kích thước (e.g. 210x297mm)
  paperType: string;      // Loại giấy / chất liệu (e.g. Couche 250gsm)
  printMethod: "In nhanh kỹ thuật số" | "In offset 4 màu";
  printSides: "1 mặt" | "2 mặt";
  finishing: string[];    // Cán màng mờ, Ép kim, Bế dán hộp...
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  fileAttached?: string;  // Tên file thiết kế
  fileApproved: boolean;  // Đã kiểm tra file
}

export interface ProductionOrder {
  lsxCode: string;
  createdAt: string;
  machine: string;
  psxLead: string;
  bomItems: {
    materialName: string;
    plannedQty: number;
    unit: string;
    status: "Đã xuất kho NVL" | "Chờ cấp vật tư";
  }[];
  steps: {
    name: string;
    status: "pending" | "in_progress" | "done";
    assignee: string;
  }[];
}

export interface ReceiptVoucher {
  id: string;
  code: string;           // PT2510-xxx
  date: string;
  amount: number;
  method: "Chuyển khoản" | "Tiền mặt";
  recorded: boolean;      // Đã ghi sổ
  note?: string;
}

export type PaymentCategory =
  | "Mua NVL"
  | "Lương nhân sự"
  | "Điện nước"
  | "Thuê mặt bằng"
  | "Gia công ngoài"
  | "Vận chuyển"
  | "Bảo trì máy"
  | "Khác";

export interface PaymentVoucher {
  id: string;
  code: string;           // PC2510-xxx
  date: string;
  amount: number;
  method: "Chuyển khoản" | "Tiền mặt";
  category: PaymentCategory;
  receiver: string;       // Người nhận / NCC
  relatedBill?: string;   // Phiếu bán / LSX liên quan
  accountName?: string;   // Tài khoản chi (Quỹ tiền mặt / Vietcombank...)
  note?: string;
  recorded: boolean;      // Đã ghi sổ
  createdBy: string;
}

export interface FundAccount {
  id: string;
  name: string;           // Quỹ tiền mặt / Vietcombank
  type: "CASH" | "BANK";  // Tiền mặt / Ngân hàng
  bankName?: string;
  accountNumber?: string;
  holder?: string;        // Chủ tài khoản
  openingBalance: number; // Số dư đầu kỳ
  note?: string;
  createdAt: string;
}

export interface ExportVoucher {
  id: string;
  code: string;           // PXK2510-xxx
  date: string;
  exportedQty: number;
  receiver: string;
  address: string;
  status: "Đã xuất hàng" | "Đang giao" | "Đã giao";
}

export interface SalesOrder {
  id: string;
  salesBillNumber: string; // Số phiếu bán hàng (BH251009-001)
  orderDate: string;       // Ngày bán / ngày tạo (9/10/2025)
  deliveryDate: string;    // Ngày hẹn giao
  customer: Customer;
  salesRep: string;        // Nhân viên bán hàng
  step: OrderStep;         // Trạng thái hiện tại theo quy trình
  items: PrintItem[];
  subTotal: number;        // Tổng tiền
  discount: number;        // Giảm giá
  vat: number;             // VAT
  totalAmount: number;     // Thành tiền
  
  // Dữ liệu sản xuất & liên kết (Ảnh 2)
  psxAssignedTo?: string;  // Nhân viên phòng sản xuất
  productionOrder?: ProductionOrder;
  
  // Dữ liệu tài chính & kho (Ảnh 2)
  receipts: ReceiptVoucher[]; // Các phiếu thu đã ghi sổ
  exports: ExportVoucher[];   // Các phiếu xuất kho
  paidAmount: number;         // Tổng đã thu
  debtAmount: number;         // Còn lại / Công nợ
  totalQtyOrdered: number;    // Tổng SL đặt
  totalQtyExported: number;   // Tổng SL đã xuất
  remainingQty: number;       // Còn lại trong kho chưa xuất
}

export type QuotationStatus =
  | "DRAFT"       // Dự thảo
  | "SENT"        // Đã gửi khách
  | "APPROVED"    // Khách duyệt
  | "CONVERTED"   // Đã chuyển thành đơn hàng
  | "REJECTED";   // Không duyệt

export interface Quotation {
  id: string;
  quotationNumber: string;    // BG2510-001
  date: string;
  validUntil: string;
  customerName: string;
  customerPhone: string;
  customerCompany?: string;
  salesRep: string;
  status: QuotationStatus;
  items: PrintItem[];
  subTotal: number;
  discount: number;
  vat: number;
  totalAmount: number;
  notes?: string;
  convertedOrderId?: string;
}

export interface InventoryItem {
  id: string;
  code: string;               // VT-G-C250
  name: string;               // Giấy Couche 250gsm (79x109)
  category: "Giấy in" | "Bản kẽm CTP" | "Mực in & Hóa chất" | "Vật tư gia công" | "Thành phẩm";
  specification: string;      // 79 x 109 cm, định lượng 250gsm
  quantity: number;
  unit: string;               // Ram, Tấm, Kg, Cuộn
  minSafeStock: number;       // Mức an toàn
  unitPrice: number;          // Đơn giá nhập bình quân
  location: string;           // Kho A - Kệ 03
  lastUpdated: string;
}

export interface PricingCategoryItem {
  id: string;
  serviceName: string;
  category: "In nhanh KTS" | "In Offset" | "Giấy in ấn" | "Gia công sau in";
  unit: string;
  tier1: number;              // Mức SL ít
  tier2: number;              // Mức SL vừa
  tier3: number;              // Mức SL nhiều
  notes: string;
}

export interface DesignTemplate {
  id: string;
  name: string;               // Tên mẫu thiết kế
  customerId?: string;        // Lưu theo khách hàng (rỗng = mẫu chung)
  customerName?: string;      // Tên KH hiển thị nhanh
  category: string;           // Catalogue, Namecard, Hộp giấy, Túi giấy...
  driveLink?: string;         // Link Google Drive gốc
  previewUrl?: string;        // Ảnh preview (suy ra từ driveLink hoặc link ảnh trực tiếp)
  uploadedFileName?: string;  // File tự đẩy lên
  uploadedImageUrl?: string;  // DataURL / object URL ảnh tự upload
  notes?: string;
  createdAt: string;
  createdBy?: string;
}

export type StockVoucherType = "IMPORT" | "EXPORT"; // Nhập kho / Xuất kho NVL

export interface StockVoucher {
  id: string;
  code: string;               // PNK2510-xxx (nhập) / PXK-NVL2510-xxx (xuất)
  type: StockVoucherType;
  date: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  unit: string;
  quantity: number;
  unitPrice: number;          // Đơn giá tại thời điểm nhập/xuất
  totalValue: number;
  partner: string;            // NCC (nhập) / Bộ phận nhận (xuất)
  relatedLSX?: string;        // LSX liên quan khi xuất NVL cho sản xuất
  note?: string;
  createdBy: string;
}

export interface StocktakeLine {
  itemId: string;
  itemCode: string;
  itemName: string;
  unit: string;
  systemQty: number;          // Tồn trên sổ
  countedQty: number;         // Tồn kiểm thực tế
  diff: number;               // counted - system
}

export type StocktakeStatus = "DRAFT" | "BALANCED"; // Đang kiểm / Đã cân bằng

export interface StocktakeSession {
  id: string;
  code: string;               // PKK2510-xxx
  date: string;
  status: StocktakeStatus;
  lines: StocktakeLine[];
  note?: string;
  createdBy: string;
}
