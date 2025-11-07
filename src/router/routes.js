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
    path: "/admin",
    name: "Admin",
    component: () => import("../views/Admin.vue"),
    meta: {
      titleKey: "menu.admin",
      icon: "Setting",
      roles: ["admin"],
    },
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
