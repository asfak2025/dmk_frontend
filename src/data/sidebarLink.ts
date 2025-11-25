import {
  User,
  Bot,
  LayoutDashboard,
  Users,
  Coins,
  HandCoins,
  BriefcaseBusiness,
  BotMessageSquare,
  IndianRupee,
  Locate,
  PhoneCall
} from "lucide-react";

 export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export interface NavGroup {
  groupTitle: string;
  groupIcon: React.ElementType;
  items: NavItem[];
}

export const navGroupsByRole: {
  [role: string]: Array<NavItem | NavGroup>;
} = {
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      groupTitle: "Agents",
      groupIcon: Bot,
      items: [
        {
          title: "Bot Agents",
          href: "/bot-agents",
          icon: BotMessageSquare,
        },
        {
          title: "Human Agents",
          href: "/human-agents",
          icon: User,
        },
      ],
    },
    {
      groupTitle: "Payments",
      groupIcon: IndianRupee,
      items: [
        {
          title: "Payment Summary",
          href: "/payments",
          icon: Coins,
        },
        {
          title: "Usage",
          href: "/payment-usage",
          icon: HandCoins,
        },
      ],
    },
    {
      title: "Manage Team",
      href: "/teamManagement",
      icon: Users,
    },
    {
      title: "Campaign",
      href: "/campaign",
      icon: BriefcaseBusiness,
    },
  ],
  lead: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      groupTitle: "Agents",
      groupIcon: Bot,
      items: [
        {
          title: "Bot Agents",
          href: "/bot-agents",
          icon: BotMessageSquare,
        },
      ],
    },
    {
      title: "Campaign",
      href: "/campaign",
      icon: BriefcaseBusiness,
    },
  ],
  support: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      groupTitle: "Agents",
      groupIcon: Bot,
      items: [
        {
          title: "Human Agents",
          href: "/human-agents",
          icon: User,
        },
      ],
    },
  ],
};

export const NavGroupItems: (NavItem | NavGroup)[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Dashboard",
      href: "/operation/dashboard",
      icon: LayoutDashboard,
    },
    {
      groupTitle: "Agents",
      groupIcon: Bot,
      items: [
        {
          title: "Bot Agents",
          href: "/bot-agents",
          icon: BotMessageSquare,
        },
        {
          title: "Human Agents",
          href: "/human-agents",
          icon: User,
        },
      ],
    },
    {
      groupTitle: "Payments",
      groupIcon: IndianRupee,
      items: [
        {
          title: "Payment Summary",
          href: "/payments",
          icon: Coins,
        },
        {
          title: "Usage",
          href: "/payment-usage",
          icon: HandCoins,
        },
      ],
    },
    {
      title: "Manage Team",
      href: "/teamManagement",
      icon: Users,
    },
    {
      title: "Campaign",
      href: "/campaign",
      icon: BriefcaseBusiness,
    },
    {
      title: "Poll Map",
      href: "/poll-map",
      icon: Locate,
    },
    {
      title: "AI Call Analysis",
      href: "/callsummary",
      icon: PhoneCall,
    },
  ]