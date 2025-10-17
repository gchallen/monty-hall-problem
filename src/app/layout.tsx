import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DarkModeProvider } from '@/contexts/DarkModeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Monty Hall Problem - Illinois vs Purdue',
  description: 'Interactive simulation of the Monty Hall problem with college acceptance theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedMode = localStorage.getItem('darkMode');
                if (savedMode === 'true' || (savedMode === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <DarkModeProvider>
          {children}
        </DarkModeProvider>
      </body>
    </html>
  )
}