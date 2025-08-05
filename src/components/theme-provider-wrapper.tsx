'use client'

import { ThemeProvider } from 'next-themes'

export function ThemeProviderRealEstateCoreUi({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}