import { SidebarRight } from '@/components/chatbox/config'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { NavActions } from '@/components/layout/nav-actions'
import { SettingsDialog } from '@/components/setting/settings-dialog'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import '@/public/stylesheets/globals.css'
import { Provider } from 'jotai'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Hyper Chat',
  description: 'Advanced AI Agent'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <div className="bg-background flex h-dvh min-w-0 flex-col">
                  <header className="sticky flex h-14 w-full shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3">
                      <SidebarTrigger />
                      <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>
                    <div className="ml-auto px-3">
                      <NavActions />
                    </div>
                  </header>
                  {children}
                  <SettingsDialog />
                  <Toaster />
                </div>
              </SidebarInset>
              <SidebarRight />
            </SidebarProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
