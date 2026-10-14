import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fsolution - Hệ thống Quản lý Doanh nghiệp In ấn SaaS",
  description: "Fsolution - Hệ thống Quản lý Doanh nghiệp In ấn (In nhanh - In offset) - Đơn hàng, Sản xuất, Báo cáo Doanh thu, CRM Lead & Khách hàng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${roboto.variable} h-full`}>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
