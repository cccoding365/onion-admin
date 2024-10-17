import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    { path: "/", component: () => import("@/layouts/base.vue") },
    {
        path: "/dashboard",
        component: () => import("@/layouts/base.vue"),
        redirect: "/dashboard/index",
        children: [
            {
                path: "index",
                name: "Dashboard",
                component: () => import("@/views/dashboard/index.vue")
            }
        ]
    },
    {
        path: "/component",
        component: () => import("@/layouts/base.vue"),
        children: [
            {
                path: "button",
                name: "Button",
                component: () => import("@/views/component/button/index.vue")
            },
            {
                path: "input",
                name: "Input",
                component: () => import("@/views/component/input/index.vue")
            }
        ]
    },
    {
        path: "/list",
        component: () => import("@/layouts/base.vue"),
        redirect: "/list/index",
        children: [
            {
                path: "index",
                name: "List",
                component: () => import("@/views/list/index.vue")
            }
        ]
    },
    {
        path: "/form",
        component: () => import("@/layouts/base.vue"),
        redirect: "/form/index",
        children: [
            {
                path: "index",
                name: "Form",
                component: () => import("@/views/form/index.vue")
            }
        ]
    },
    {
        path: "/custom-directives",
        component: () => import("@/layouts/base.vue"),
        children: [
            {
                path: 'debounce',
                name: 'Debounce',
                component:()=>import("@/views/custom-directives/debounce.vue")
            },
            {
                path: 'throttle',
                name: 'Throttle',
                component:()=>import("@/views/custom-directives/throttle.vue")
            }
        ]
    },
    {
        path: "/special-layout",
        component: () => import("@/layouts/base.vue"),
        children: [
            {
                path: 'flex',
                name: 'Flex',
                component:()=>import("@/views/special-layout/flex.vue")
            },
            {
                path: 'grid',
                name: 'Grid',
                component:()=>import("@/views/special-layout/grid.vue")
            },
            {
                path: 'waterfall',
                name: 'Waterfall',
                component:()=>import("@/views/special-layout/waterfall.vue")
            }
        ]
    },
    {
        path: "/exception",
        component: () => import("@/layouts/base.vue"),
        children: [
            {
                path: "404",
                name: "404",
                component: () => import("@/views/exception/404/index.vue")
            },
            {
                path: "500",
                name: "500",
                component: () => import("@/views/exception/500/index.vue")
            }
        ]
    },
    {
        path: "/information",
        component: () => import("@/layouts/base.vue"),
        redirect: "/information/index",
        children: [
            {
                path: "index",
                name: "Index",
                component: () => import("@/views/information/index.vue")
            }
        ]
    },
    {
        path: "/external-link",
        component: () => import("@/layouts/base.vue"),
        children: [
            {
                path: "embedded-page",
                component: () => import("@/views/external-link/embedded-page/index.vue")
            },
            {
                path: "external-page",
                component: () => import("@/views/external-link/external-page/index.vue")
            }
        ]
    },
    { path: "/login", component: () => import("@/views/login/index.vue") },
    { path: "/about", component: () => import("@/views/about/index.vue") },
    {
        path: "/:w+",
        component: () => import("@/views/exception/404/index.vue")
    }
];
export default routes;
