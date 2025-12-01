import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import TransitionWrapper from '../components/TransitionWrapper'

export const metadata: Metadata = {
  title: 'storyline',
  description: '故事线',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-CN'>
      <body className={`antialiased`}>
        <AntdRegistry>
          <TransitionWrapper>{children}</TransitionWrapper>
        </AntdRegistry>
      </body>
    </html>
  )
}
