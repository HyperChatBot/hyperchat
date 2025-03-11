'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Chat } from '@/lib/db/schema'
import { fetcher, getRandomEmoji } from '@/lib/utils'
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns'
import { ArrowUpRight, MoreHorizontal, StarOff, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { Skeleton } from '../ui/skeleton'

interface GroupedChats {
  today: Chat[]
  yesterday: Chat[]
  lastWeek: Chat[]
  lastMonth: Chat[]
  older: Chat[]
}

export function NavHistorySkeleton() {
  return (
    <section className="flex flex-col gap-3 p-2">
      {new Array(10).fill(0).map((_, idx) => (
        <div key={idx} className="flex gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-full" />
        </div>
      ))}
    </section>
  )
}

export function NavItems({ item }: { item: Chat }) {
  const { id } = useParams<{ id: string }>()
  const { isMobile } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={item.id === id}>
        <Link href={`/chat/${item.id}`}>
          <span>{getRandomEmoji()}</span>
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem>
            <StarOff className="text-muted-foreground" />
            <span>Remove from Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function NavHistories({}) {
  const { data: history, isLoading } = useSWR<Chat[]>('/api/history', fetcher, {
    fallbackData: []
  })

  const groupChatsByDate = (chats: Chat[]): GroupedChats => {
    const now = new Date()
    const oneWeekAgo = subWeeks(now, 1)
    const oneMonthAgo = subMonths(now, 1)

    return chats.reduce(
      (groups, chat) => {
        const chatDate = new Date(chat.createdAt)

        if (isToday(chatDate)) {
          groups.today.push(chat)
        } else if (isYesterday(chatDate)) {
          groups.yesterday.push(chat)
        } else if (chatDate > oneWeekAgo) {
          groups.lastWeek.push(chat)
        } else if (chatDate > oneMonthAgo) {
          groups.lastMonth.push(chat)
        } else {
          groups.older.push(chat)
        }

        return groups
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: []
      } as GroupedChats
    )
  }

  if (isLoading) {
    return <NavHistorySkeleton />
  }

  if (history?.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <section>
      {history !== undefined &&
        (() => {
          const groupedChats = groupChatsByDate(history)

          return (
            <>
              {groupedChats.today.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Today</SidebarGroupLabel>
                  <SidebarMenu>
                    {groupedChats.today.map((chat) => (
                      <NavItems item={chat} key={chat.id} />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {groupedChats.yesterday.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Yesterday</SidebarGroupLabel>
                  <SidebarMenu>
                    {groupedChats.yesterday.map((chat) => (
                      <NavItems item={chat} key={chat.id} />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {groupedChats.lastWeek.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Last Week</SidebarGroupLabel>
                  <SidebarMenu>
                    {groupedChats.lastWeek.map((chat) => (
                      <NavItems item={chat} key={chat.id} />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {groupedChats.lastMonth.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Last Month</SidebarGroupLabel>
                  <SidebarMenu>
                    {groupedChats.lastMonth.map((chat) => (
                      <NavItems item={chat} key={chat.id} />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}

              {groupedChats.older.length > 0 && (
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                  <SidebarGroupLabel>Older</SidebarGroupLabel>
                  <SidebarMenu>
                    {groupedChats.older.map((chat) => (
                      <NavItems item={chat} key={chat.id} />
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              )}
            </>
          )
        })()}
    </section>
  )
}
