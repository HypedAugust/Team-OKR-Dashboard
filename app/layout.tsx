import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: '사업전략팀 OKR 대시보드',
  description: '분기 OKR 진척도와 회고를 한 페이지에서 관리합니다.',
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
