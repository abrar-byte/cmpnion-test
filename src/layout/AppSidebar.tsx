import { Link, useLocation } from "react-router";
import { GridIcon, HorizontaLDots, ListIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

const navItems = [
  { name: "Dashboard", path: "/", icon: <GridIcon /> },
  { name: "Orders", path: "/orders", icon: <ListIcon /> },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const showLabels = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {showLabels ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img src="/favicon.png" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2
            className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
              !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
            }`}
          >
            {showLabels ? "Menu" : <HorizontaLDots className="size-6" />}
          </h2>
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`menu-item group ${
                    isActive(item.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  } ${
                    !isExpanded && !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(item.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {showLabels && (
                    <span className="menu-item-text">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
