import type { Metadata } from "next";
import { Mali } from "next/font/google";
import "./globals.css";

// Tải font Mali với các độ đậm khác nhau, hỗ trợ tiếng Việt
const mali = Mali({ 
  subsets: ["vietnamese"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mali',
});

export const metadata: Metadata = {
  title: "Nhật Ký Của Cheese 🧀",
  description: "Nơi lưu giữ những khoảnh khắc ngọt ngào như phô mai của bé Trần Linh Chi mỗi ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${mali.variable} font-sans bg-[#FFFDE7]`}>
        {children}
      </body>
    </html>
  );
}