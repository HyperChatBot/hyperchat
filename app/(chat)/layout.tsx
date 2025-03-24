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

import { Provider } from 'jotai'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
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
  )
}
