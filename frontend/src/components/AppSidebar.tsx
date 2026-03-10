import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const navItems = [
  { title: "Dashboard", path: "/" },
  { title: "Query Workspace", path: "/query" },
  { title: "Datasets", path: "/datasets" },
  { title: "Reports", path: "/reports" },
  { title: "System Logs", path: "/logs" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen sticky top-0 bg-sidebar flex flex-col border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground font-semibold text-lg tracking-tight"
          >
            Data Fetcher Agent
          </motion.span>
        )}
        {collapsed && (
          <span className="text-foreground font-bold text-lg">D</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    relative flex items-center h-10 rounded-md px-3 text-sm font-medium transition-all duration-200
                    ${active 
                      ? "text-foreground" 
                      : "text-sidebar-foreground hover:text-foreground"
                    }
                  `}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1 bottom-1 w-[2px] bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {!collapsed && (
                    <motion.span
                      animate={{ x: active ? 8 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-sidebar-border text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
