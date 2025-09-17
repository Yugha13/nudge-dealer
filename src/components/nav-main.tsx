import { type Icon } from "@tabler/icons-react"
import { useNavigate, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const router = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = currentPath === item.url || 
                           (item.url !== '/' && currentPath.startsWith(item.url))
            
            return (
              <SidebarMenuItem key={item.title} onClick={() => router(item.url)}>
                <SidebarMenuButton 
                  tooltip={item.title}
                  className={cn(
                    'transition-colors',
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  {item.icon && <item.icon className={cn('h-5 w-5', isActive ? 'text-primary' : '')} />}
                  <span className={cn(isActive ? 'font-medium' : 'font-normal')}>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
