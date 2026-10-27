import React from 'react';
import { AppView } from '../types';
import { LOGO_URL } from '../data/initialData';

type UserRole = 'admin' | 'organizer' | 'sponsor';

interface SidebarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  allowedRoles?: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  activeTab,
  setActiveTab,
  userRole,
}) => {
  if (currentView === 'landing') {
    return null;
  }

  /*
   * ==================================================
   * NAVIGATION ITEMS
   * ==================================================
   */

  const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'events', label: 'Events', icon: 'calendar_today' },
  { id: 'sponsorships', label: 'Sponsorships', icon: 'payments' },
  { id: 'applications', label: 'Applications', icon: 'assignment_turned_in' },
  { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },

  // Admin only
  ...(currentView === 'admin'
    ? [
        {
          id: 'stall-management',
          label: 'Stall Management',
          icon: 'storefront',
        },
      ]
    : []),
];

  /*
   * ==================================================
   * CHECK WHETHER USER CAN SEE TAB
   * ==================================================
   */

  const canAccessTab = (item: NavItem) => {
    if (!item.allowedRoles) {
      return true;
    }

    if (!userRole) {
      return false;
    }

    return item.allowedRoles.includes(userRole);
  };

  /*
   * ==================================================
   * TAB CLICK
   * ==================================================
   */

  const handleTabClick = (tab: string) => {
    console.log(
      '[Sidebar] Opening tab:',
      tab,
      'Current portal:',
      currentView,
      'Role:',
      userRole
    );

    setActiveTab(tab);
  };

  /*
   * ==================================================
   * PORTAL SWITCH
   * ==================================================
   */

  const handlePortalChange = (view: AppView) => {
    console.log(
      '[Sidebar] Switching portal:',
      view
    );

    /*
     * Let App.tsx perform the authorization check.
     */
    onViewChange(view);
  };

  /*
   * ==================================================
   * PORTAL LABEL
   * ==================================================
   */

  const portalLabel =
    currentView === 'admin'
      ? 'Admin'
      : currentView === 'organizer'
      ? 'Organizer'
      : 'Sponsor';

  return (
    <aside
      className="
        hidden
        lg:flex
        flex-col
        fixed
        left-0
        top-0
        w-[260px]
        h-screen
        bg-[#0040e0]
        border-r
        border-blue-800
        z-50
        text-white
      "
    >

      {/* ================================================== */}
      {/* BRAND */}
      {/* ================================================== */}

      <div
        className="
          p-6
          flex
          items-center
          gap-3
          border-b
          border-white/10
        "
      >
        <button
          type="button"
          onClick={() => {
            console.log(
              '[Sidebar] Returning to public site'
            );

            handlePortalChange('landing');
          }}
          className="
            flex
            items-center
            gap-3
            hover:opacity-90
            transition-opacity
            text-left
          "
        >
          <img
            src={LOGO_URL}
            alt="PCTE Logo"
            className="
              w-10
              h-10
              rounded-lg
              bg-white
              p-1
              shadow-md
              object-contain
            "
          />

          <div>
            <span
              className="
                font-extrabold
                text-xl
                tracking-tight
                text-white
                block
                leading-none
              "
            >
              PCTE
            </span>

            <span
              className="
                text-[10px]
                text-blue-200
                font-semibold
                tracking-wider
                uppercase
              "
            >
              Campus Bridge
            </span>
          </div>
        </button>
      </div>

      {/* ================================================== */}
      {/* ACTIVE PORTAL */}
      {/* ================================================== */}

      <div
        className="
          px-6
          py-3
          bg-blue-900/50
          border-b
          border-white/10
          flex
          items-center
          justify-between
        "
      >
        <span
          className="
            text-blue-200
            uppercase
            tracking-wider
            text-[10px]
            font-bold
          "
        >
          Active Portal
        </span>

        <span
          className="
            bg-white/20
            text-white
            px-2.5
            py-1
            rounded-md
            text-[11px]
            font-bold
          "
        >
          {portalLabel}
        </span>
      </div>

      {/* ================================================== */}
      {/* NAVIGATION */}
      {/* ================================================== */}

      <nav
        className="
          mt-4
          flex-1
          space-y-1
          px-3
          overflow-y-auto
          no-scrollbar
        "
      >
        {navItems
          .filter(canAccessTab)
          .map((item) => {
            const isActive =
              activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleTabClick(item.id)
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3.5
                  px-4
                  py-3
                  rounded-xl
                  font-semibold
                  text-sm
                  transition-all
                  text-left
                  ${
                    isActive
                      ? `
                        bg-[#00ccf9]
                        text-[#001f28]
                        shadow-md
                        border-l-4
                        border-white
                      `
                      : `
                        text-white/80
                        hover:bg-white/10
                        hover:text-white
                      `
                  }
                `}
              >
                <span
                  className={`
                    material-symbols-outlined
                    text-xl
                    ${
                      isActive
                        ? 'filled'
                        : ''
                    }
                  `}
                >
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </button>
            );
          })}
      </nav>

      {/* ================================================== */}
      {/* PORTAL ACCESS */}
      {/* ================================================== */}

      <div
        className="
          p-4
          border-t
          border-white/10
          bg-blue-900/30
        "
      >
        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-blue-200
            mb-2
          "
        >
          Portal Access
        </p>

        <div className="space-y-1">

          {/* ADMIN */}

          <button
            type="button"
            onClick={() =>
              handlePortalChange('admin')
            }
            className={`
              w-full
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-xs
              font-semibold
              transition-all
              ${
                currentView === 'admin'
                  ? `
                    bg-white
                    text-[#0040e0]
                  `
                  : `
                    bg-white/10
                    text-white
                    hover:bg-white/20
                  `
              }
            `}
          >
            <span className="material-symbols-outlined text-base">
              admin_panel_settings
            </span>

            Admin Portal
          </button>

          {/* ORGANIZER */}

          <button
            type="button"
            onClick={() =>
              handlePortalChange('organizer')
            }
            className={`
              w-full
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-xs
              font-semibold
              transition-all
              ${
                currentView === 'organizer'
                  ? `
                    bg-white
                    text-[#0040e0]
                  `
                  : `
                    bg-white/10
                    text-white
                    hover:bg-white/20
                  `
              }
            `}
          >
            <span className="material-symbols-outlined text-base">
              calendar_month
            </span>

            Organizer Portal
          </button>

          {/* SPONSOR */}

          <button
            type="button"
            onClick={() =>
              handlePortalChange('sponsor')
            }
            className={`
              w-full
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              text-xs
              font-semibold
              transition-all
              ${
                currentView === 'sponsor'
                  ? `
                    bg-white
                    text-[#0040e0]
                  `
                  : `
                    bg-white/10
                    text-white
                    hover:bg-white/20
                  `
              }
            `}
          >
            <span className="material-symbols-outlined text-base">
              handshake
            </span>

            Sponsor Portal
          </button>

        </div>
      </div>
    </aside>
  );
};