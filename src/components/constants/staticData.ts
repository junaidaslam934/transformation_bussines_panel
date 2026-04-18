import ICONS from "@/assets/icons";
import { ROUTES } from "./routes";

export const SIDEBAR = [
  {
    icons: {
        default: ICONS.sidebar.dashboard.inactive,
        filled: ICONS.sidebar.dashboard.active,
      },
    label: "Dashboard",
    path: ROUTES.dashboard.home,
  },
  {
     icons: {
        default: ICONS.sidebar.userManagement.inactive,
        filled: ICONS.sidebar.userManagement.active,
      },
    label: "Users",
    path: ROUTES.dashboard.userManagement,
  },
  {
     icons: {
        default: ICONS.sidebar.advisors.inactive,
        filled: ICONS.sidebar.advisors.active,
      },
    label: "Advisor",
    path: ROUTES.dashboard.advisors,
  },
  {
    icons: {
      default: ICONS.sidebar.challengeManagement.inactive,
      filled: ICONS.sidebar.challengeManagement.active,
    },
    label: "Challenges",
    path: ROUTES.dashboard.challengeManagement,
  },
  {
    icons:{
      default: ICONS.sidebar.contentManagement.inactive,
      filled: ICONS.sidebar.contentManagement.active,
    },
    label: "Content Management",
    path: ROUTES.dashboard.contentManagement.nutrition, // Default to nutrition
  },
  {
    icons:{
      default: ICONS.sidebar.announcements.inactive,
      filled: ICONS.sidebar.announcements.active,
    },
    label: "Announcement",
    path: ROUTES.dashboard.announcements,
  },
  {
    icons:{
      default: ICONS.sidebar.live.inactive,
      filled: ICONS.sidebar.live.active,
    },
    label: "Live streams",
    path: ROUTES.dashboard.live,
  },
  {
    icons: {
      default: ICONS.sidebar.settings.inactive,
      filled: ICONS.sidebar.settings.active,
    },
    label: "Settings",
    path: ROUTES.dashboard.settings,
  },
];
