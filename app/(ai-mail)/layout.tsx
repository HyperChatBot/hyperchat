import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="w-full flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
