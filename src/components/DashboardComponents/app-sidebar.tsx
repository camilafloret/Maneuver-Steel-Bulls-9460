import * as React from "react"
import { LayoutDashboard, Settings, SquarePen } from "lucide-react"

// import { NavDocuments } from "@/components/DashboardComponents/nav-documents"
import { NavMain } from "@/components/DashboardComponents/nav-main"
// import { NavSecondary } from "@/components/DashboardComponents/nav-secondary"
import { NavUser } from "@/components/DashboardComponents/nav-user"
import { DataAttribution } from "@/components/DataAttribution"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "../ui/separator"
import ManeuverHorizontalLogo from "../../assets/Logotipo Escrito.png"
import { haptics } from "@/lib/haptics"

const data = {
  navMain: [
    // {
    //   title: "Data Actions",
    //   url: "/settings",
    //   icon: Settings,
    //   items: [
    //     {
    //       title: "Clear Data",
    //       url: "/clear-data",
    //     },
    //     {
    //       title: "Convert Scouting JSON Data",
    //       url: "/parse-data",
    //     }
    //   ]
    // },
    {
      title: "Ações de Dados",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Apagar Dados",
          url: "/clear-data",
        },
        {
          title: "Transferência de Dados JSON",
          url: "/json-transfer",
        },
        {
          title: "Transferência de Dados por QR",
          url: "/qr-data-transfer",
        },
        {
          title: "Dados da API",
          url: "/api-data",
        }
      ]
    },
    {
      title: "Estratégia",
      url: "#",
      icon: SquarePen,
      items: [
        {
          title: "Visão Geral da Estratégia",
          url: "/strategy-overview",
        },
        {
          title: "Estratégia de Partida",
          url: "/match-strategy",
        },
        {
          title: "Estatísticas da Equipe",
          url: "/team-stats",
        },
        {
          title: "Scoutin de Pit",
          url: "/pit-scouting",
        },
        {
          title: "Listas de Escolha",
          url: "/pick-list",
        }
      ],
    },
    {
      title: "Gerenciamento de Scouts",
      url: "#",
      icon: LayoutDashboard,
      items: [
        {
          title: "Painel de Scouts",
          url: "/scout-management",
        },
        {
          title: "Conquistas",
          url: "/achievements",
        },
        {
          title: "Atribuir Scouting de Pit",
          url: "/pit-assignments",
        },
        ...(import.meta.env.DEV ? [{
          title: "Ferramentas de Desenvolvimento",
          url: "/dev-utilities",
        }] : [])
      ],
    },
  ],
  navSecondary: [
    {
      title: "Obter Ajuda (WIP)",
      url: "#",
      // icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Estratégias de Partidas Salvas (WIP)",
      url: "#",
      // icon: IconDatabase,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile } = useSidebar()
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    
    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const minSwipeDistance = 60
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < -minSwipeDistance) {
        e.preventDefault()
        haptics.light()
        setOpenMobile(false)
      }
    }
    
    touchStartRef.current = null
  }

  React.useEffect(() => {
    const handleGlobalTouchStart = (e: TouchEvent) => {
      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      if (sidebar && !sidebar.contains(e.target as Node)) {
        const touch = e.touches[0]
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
      }
    }

    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return
      
      const sidebar = document.querySelector('[data-sidebar="sidebar"]')
      if (sidebar && !sidebar.contains(e.target as Node)) {
        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - touchStartRef.current.x
        const deltaY = touch.clientY - touchStartRef.current.y
        const minSwipeDistance = 60
        
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX < -minSwipeDistance) {
            e.preventDefault()
            haptics.light()
            setOpenMobile(false)
          }
        }
      }
      
      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true })
    document.addEventListener('touchend', handleGlobalTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleGlobalTouchStart)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
    }
  }, [setOpenMobile])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button] h-fit"
            >
              <a href="/" aria-label="Home">
                <img
                  src={ManeuverHorizontalLogo}
                  className="row-span-4 scale-75 dark"
                  width="240"
                  height="160"
                  alt="Logotipo Horizontal"
                />
              </a>
            </SidebarMenuButton>
            <Separator className="my-1" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1">
          <DataAttribution sources={['tba', 'nexus']} variant="compact" />
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
