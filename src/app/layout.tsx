import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '115 STRM 生成器',
    template: '%s | 115 STRM 生成器',
  },
  description:
    '将 115 网盘视频链接转换为 STRM 格式，方便在 Plex、Emby、Jellyfin 等媒体服务器中使用',
  keywords: [
    '115 STRM',
    'STRM 生成器',
    '115 网盘',
    'Plex',
    'Emby',
    'Jellyfin',
    '媒体服务器',
    '视频管理',
  ],
  authors: [{ name: '115 STRM Generator' }],
  generator: 'Next.js',
  // icons: {
  //   icon: '',
  // },
  openGraph: {
    title: '115 STRM 生成器 - 将网盘视频转换为 STRM 格式',
    description:
      '快速将 115 网盘视频链接转换为 STRM 格式，方便在 Plex、Emby、Jellyfin 等媒体服务器中使用',
    url: 'http://localhost:5000',
    siteName: '115 STRM 生成器',
    locale: 'zh_CN',
    type: 'website',
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Coze Code | Your AI Engineer is Here',
  //   description:
  //     'Build and deploy full-stack applications through AI conversation. No env setup, just flow.',
  //   // images: [''],
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
