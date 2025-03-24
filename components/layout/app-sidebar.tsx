'use client'

import { Bot, Plus } from 'lucide-react'
import * as React from 'react'

import { NavHistories } from '@/components/layout/nav-histories'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { SearchForm } from '../common/search-form'
import { Button } from '../ui/button'
import { NavSecondary } from './nav-secondary'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Bot className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hyper Chat</span>
                  <span className="truncate text-xs">v1.0.0</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex justify-between">
          <SearchForm />
          <Link href="/">
            <Button size="icon" variant="ghost">
              <Plus />
            </Button>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <NavHistories />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary className="mt-auto" />
      </SidebarFooter>
    </Sidebar>
  )
}
