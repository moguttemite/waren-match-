import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '../contexts/LanguageContext'

export const metadata: Metadata = {
  title: '和恋 (Waren) - 中日交友恋爱平台',
  description: '连接中日两国，寻找真爱',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}