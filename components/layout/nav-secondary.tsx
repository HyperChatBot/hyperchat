import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { settingsDialogVisibleAtom } from '@/stores/global'
import { useSetAtom } from 'jotai'
import { Settings } from 'lucide-react'
import React from 'react'

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const setSettingsDialogVisible = useSetAtom(settingsDialogVisibleAtom)

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div onClick={() => setSettingsDialogVisible(true)}>
                <Settings />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
