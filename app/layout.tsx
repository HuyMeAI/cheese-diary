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
  title: "Cuốn nhật ký của em Cheese iu 🧀",
  description: "Nơi lưu giữ những khoảnh khắc ngọt ngào như phô mai của bé Trần Linh Chi ạ.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧀</text></svg>",
  },
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