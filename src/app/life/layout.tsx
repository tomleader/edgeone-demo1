import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1980',
  description: '大事件',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='w-full h-[100vh] bg-black text-[#fff] flex items-center justify-center overflow-hidden'>
      {children}
    </div>
  )
}
