import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/ui/Footer";
// ✅ 1. استدعاء زر الواتساب ومزود اللغة
import { WhatsappButton } from "@/components/whatsapp-button";
import { LanguageProvider } from "@/components/language-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyClinic.pro",
  description: "The complete SaaS solution for medical professionals.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950`}>
        
        {/* ✅ 2. تغليف التطبيق بـ LanguageProvider (للترجمة) */}
        <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              
              <div className="flex flex-col min-h-screen">
                
                {/* المحتوى الرئيسي */}
                <div className="flex-1">
                  {children}
                </div>
                
                {/* الفوتر الثابت في الأسفل */}
                <Footer />
                
              </div>

              {/* ✅ 3. زر الواتساب العائم (يظهر فوق كل شيء) */}
              <WhatsappButton />

            </ThemeProvider>
        </LanguageProvider>

      </body>
    </html>
  );
}