import * as React from "react"
import {
  IconDashboard,
  IconDatabase,
  IconFolder,
  IconListDetails,
  IconBrain,
  IconUser,
  IconBell,
  IconLogout,
  IconChartArcs,
  IconMoneybag,
  IconSparkles,
  IconTargetArrow,
  IconTruck,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { Moon, Sun, MessageSquare, LayoutDashboard } from "lucide-react"
import { Link } from "react-router-dom"


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Uploads Files",
      url: "/upload",
      icon: IconFolder,
    },
    {
      title: "View PO's ",
      url: "/pos",
      icon: IconListDetails,
    },
    {
      title: "View Open PO's ",
      url: "/open-pos",
      icon: IconListDetails,
    },
    {
      title: "Platform",
      url: "/platform",
      icon: IconDatabase,
    },
    {
      title: "Vendors",
      url: "/vendors",
      icon: IconTruck,
    },
    {
      title: "Sales Analytics",
      url: "/sales-analytics",
      icon: IconChartArcs,
    },
    {
      title: "Profit Analysis",
      url: "/profit-analysis",
      icon: IconMoneybag,
    },
      {
      title: "AI Insights",
      url: "/ai-insights",
      icon: IconSparkles,
    },
    {
      title: "Target",
      url: "/target",
      icon: IconTargetArrow,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: IconBell,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },

  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" className="flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <div className="w-full h-px bg-border my-1" />
        <Button 
          variant="outline" 
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="mr-3 h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-3 h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
        <Button variant="default" asChild>
          <Link to="/ai-chat" className="flex items-center">
            <MessageSquare className="mr-3 h-4 w-4" />
            AI Chat
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
