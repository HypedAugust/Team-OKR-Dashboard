import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  // 브라우저 print 헤더에 들어가는 텍스트 — 영문으로 두어 명조체 회피
  title: 'OKR Dashboard',
  description: 'Quarterly OKR tracking dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-bg-base text-text-primary">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
