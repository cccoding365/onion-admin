// 可导出的路由模块，用于菜单与权限
export const layoutRoutes = [
  { path: "", redirect: "/dashboard" },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      titleKey: "menu.dashboard",
      icon: "DataLine",
      roles: ["admin", "user"],
    },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
    meta: {
      titleKey: "menu.users",
      icon: "User",
      roles: ["admin"],
    },
  },
  // Common admin modules (placeholders for future implementation)
  {
    path: "/roles",
    name: "Roles",
    component: () => import("../views/Roles.vue"),
    meta: { titleKey: "menu.roles", icon: "PriceTag", roles: ["admin"] },
  },
  {
    path: "/permissions",
    name: "Permissions",
    component: () => import("../views/Permissions.vue"),
    meta: { titleKey: "menu.permissions", icon: "Key", roles: ["admin"] },
  },
  {
    path: "/departments",
    name: "Departments",
    component: () => import("../views/Departments.vue"),
    meta: {
      titleKey: "menu.departments",
      icon: "OfficeBuilding",
      roles: ["admin"],
    },
  },
  {
    path: "/menus",
    name: "Menus",
    component: () => import("../views/Menus.vue"),
    meta: { titleKey: "menu.menus", icon: "Memo", roles: ["admin"] },
  },
  {
    path: "/logs",
    name: "Logs",
    component: () => import("../views/Logs.vue"),
    meta: { titleKey: "menu.logs", icon: "Document", roles: ["admin"] },
  },

  {
    path: "/tasks",
    name: "Tasks",
    component: () => import("../views/Tasks.vue"),
    meta: { titleKey: "menu.tasks", icon: "Timer", roles: ["admin"] },
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("../views/Notifications.vue"),
    meta: { titleKey: "menu.notifications", icon: "Bell", roles: ["admin"] },
  },
  {
    path: "/files",
    name: "Files",
    component: () => import("../views/Files.vue"),
    meta: { titleKey: "menu.files", icon: "Folder", roles: ["admin"] },
  },
  {
    path: "/dicts",
    name: "Dicts",
    component: () => import("../views/Dicts.vue"),
    meta: { titleKey: "menu.dicts", icon: "Collection", roles: ["admin"] },
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../views/Settings.vue"),
    meta: { titleKey: "menu.settings", icon: "Setting", roles: ["admin"] },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      titleKey: "menu.about",
      icon: "Warning",
      roles: ["admin"],
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue"),
    meta: {
      titleKey: "profile.title",
      icon: "User",
      roles: ["admin", "user"],
      hidden: true,
    },
  },
];
