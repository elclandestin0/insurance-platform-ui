import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChakraProvider } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeFi insurance platform for smart contract exploitation',
  description: 'by Memo Khoury',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ChakraProvider>{children}</ChakraProvider></body>
    </html>
  )
}
