"use client";

import { GalleryVerticalEnd, SquareTerminal, User2 } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/ui/nav-main";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/ui/team-switcher";

// This is sample data.
const data = {
  teams: [
    {
      name: "Road Wheel",
      logo: GalleryVerticalEnd,
      plan: "Web App",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Analytics",
          url: "/",
        },
        {
          title: "Leaderboard",
          url: "/leaderboard",
        },
        {
          title: "Quiz",
          url: "/quiz",
        },
        {
          title: "Feedback",
          url: "/feedback",
        },
      ],
    },

    {
      title: "User Management",
      url: "#",
      icon: User2,
      isActive: true,
      items: [
        {
          title: "User",
          url: "/user-management",
        },
        {
          title: "Admin Roles",
          url: "/admin-role",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
