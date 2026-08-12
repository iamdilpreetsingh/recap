import { HollowVideo } from "../../../Assets";
import type { SidebarSection } from "./Sidebar.types";

export const sections: SidebarSection[] = [
  {
    items: [
      {
        label: "Meetings",
        icon: () => <HollowVideo />,
        to: "/meetings",
      },
    ],
  },
];
