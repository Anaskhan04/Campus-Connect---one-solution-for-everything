import * as React from "react"
import {
  BookOpen,
  Briefcase,
  Calendar,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MoreHorizontal,
  Bot,
  Settings,
  UserCheck,
  Users2,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { Link, useLocation } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { CommandMenu } from "@/components/CommandMenu"
import { ProfileModal } from "@/components/profile/ProfileModal"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "People",
      url: "#",
      icon: Users2,
      items: [
        {
          title: "Students",
          url: "/students",
        },
        {
          title: "Faculty",
          url: "/faculty",
        },
        {
          title: "Alumni",
          url: "/alumni",
        },
      ],
    },
    {
      title: "Campus Life",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Events",
          url: "/events",
        },
        {
          title: "Clubs",
          url: "/clubs",
        },
        {
          title: "Campus Map",
          url: "/campus-map",
        },
      ],
    },
    {
      title: "Academic",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Attendance",
          url: "/attendance",
        },
        {
          title: "Resources",
          url: "/resources",
        },
      ],
    },
    {
      title: "Career & Tools",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Career Portal",
          url: "/career",
        },
        {
          title: "AI Tools",
          url: "/ai-tools",
          icon: Bot,
        },
      ],
    },
    {
      title: "Support",
      url: "/complaints",
      icon: ClipboardList,
    },
  ],
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)
  const [isFirstTime, setIsFirstTime] = React.useState(false)

  React.useEffect(() => {
    if (user && user.isProfileSetup === false) {
      setIsProfileModalOpen(true)
      setIsFirstTime(true)
    }
  }, [user])

  const openProfile = () => {
    setIsFirstTime(false)
    setIsProfileModalOpen(true)
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Campus Connect</span>
                    <span className="truncate text-xs">University Portal</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                      <div>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                                  <Link to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title} isActive={location.pathname === item.url}>
                      <Link to={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.profileImage} alt={user?.username} />
                      <AvatarFallback className="rounded-lg">
                        {user?.username?.substring(0, 2).toUpperCase() || "CC"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.username}</span>
                      <span className="truncate text-xs capitalize">{user?.role}</span>
                    </div>
                    <MoreHorizontal className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.profileImage} alt={user?.username} />
                        <AvatarFallback className="rounded-lg">
                          {user?.username?.substring(0, 2).toUpperCase() || "CC"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.username}</span>
                        <span className="truncate text-xs capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={openProfile}>
                      <UserCheck className="mr-2 size-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 size-4" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-between">
             <h1 className="text-lg font-bold capitalize">
               {location.pathname === "/" ? "Overview" : location.pathname.substring(1).replace("-", " ")}
             </h1>
             <div className="ml-auto flex items-center space-x-4">
               <CommandMenu />
             </div>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </SidebarInset>
      <Toaster position="top-right" richColors />
      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        isFirstTime={isFirstTime}
      />
    </SidebarProvider>
  )
}
