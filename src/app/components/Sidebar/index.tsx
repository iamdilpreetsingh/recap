import { useState } from "react";
import { NavLink } from "react-router-dom";
import { sections } from "./Sidebar.constants";
import { SidebarCollapse } from "../../../Assets";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div
      className={`border-r border-neutral-100 flex flex-col py-5 shrink-0 transition-all duration-200 bg-white ${
        collapsed ? "w-[52px] px-3" : "w-[220px] px-4"
      }`}
    >
      <div
        className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <span className="text-[20px] font-bold text-recap">Recap</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <SidebarCollapse />
        </button>
      </div>

      {sections.map((section, si) => (
        <nav key={si} className="flex flex-col gap-0.5 w-full">
          {section.items.map(({ label, icon, to }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  collapsed ? "justify-center p-2" : "px-2 py-1.5"
                } ${
                  isActive
                    ? "text-neutral-800"
                    : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="shrink-0">{icon(isActive)}</span>
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      ))}

      <div className="mt-auto pt-4 border-t border-neutral-100">
        {!collapsed && user && (
          <p className="text-[11px] text-neutral-400 truncate mb-2 px-2">
            {user.email}
          </p>
        )}
        <button
          onClick={signOut}
          title="Sign out"
          className={`flex items-center gap-2.5 rounded-lg text-[13px] font-medium text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer w-full ${
            collapsed ? "justify-center p-2" : "px-2 py-1.5"
          }`}
        >
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
