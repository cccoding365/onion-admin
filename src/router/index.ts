import { createWebHistory, createRouter } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import routes from "./routes";

NProgress.configure({ showSpinner: false });

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 };
    }
});

router.beforeEach(() => {
    NProgress.start();
});

router.afterEach(() => {
    NProgress.done();
});

router.onError((error: any) => {
    NProgress.done();
    console.warn("路由错误", error.message);
});

export default router;
