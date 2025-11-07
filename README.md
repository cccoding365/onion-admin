# Onion Admin

一个基于 Vue 3 + Vite + Element Plus 的轻量管理后台示例，内置登录与权限控制、仪表盘图表与数字滚动动画、用户管理（可编辑表格、创建/删除/修改）、个人中心，以及中英文国际化。

## 功能概览
- 认证与权限：登录、注册，基于角色的路由访问控制（`admin`、`user`）。
- 管理页（Admin）：
  - 可编辑表格：昵称、角色、年龄、性别可编辑；支持删除。
  - 创建弹窗：创建用户时可设置昵称、角色、年龄、性别。
  - 筛选与排序：按性别筛选、按年龄区间筛选；年龄与性别列支持排序。
  - 创建时间：统一以本地时间格式 `YYYY-MM-DD HH:mm` 展示（只读）。
  - 性别枚举配图标：男/女/其他分别使用图标展示。
- 个人中心（Profile）：
  - 可编辑：头像、昵称、年龄、性别；创建时间只读并格式化展示。
  - 修改密码：当前密码校验 + 新密码更新。
- 仪表盘（Dashboard）：
  - ECharts 展示柱状图/饼图/折线图。
  - 数字卡片组件（`NumberCard`）支持数字滚动动画（`countup.js`）、前后缀与小数位。
- 国际化（i18n）：内置中英文文案，语言与应用状态保持同步并持久化。
- 主题与外观：暗色模式开关、主色可配置。

## 技术栈
- 框架：`Vue 3`（`<script setup>`）
- 构建：`Vite`
- UI：`Element Plus`、`@element-plus/icons-vue`
- 路由：`vue-router`
- 状态管理：`Pinia` + `pinia-plugin-persistedstate`
- 国际化：`vue-i18n`
- 图表：`ECharts`
- 动画：`countup.js`
- 时间处理：`dayjs`

## 目录结构
```
src/
  components/         # 业务组件（NumberCard、Breadcrumb、Sidebar、TopNav 等）
  layouts/            # 布局（AppLayout）
  views/              # 页面（Dashboard、Admin、Profile、Auth、Forbidden、About）
  stores/             # Pinia Store（app、user、tabs）
  router/             # 路由与路由配置（含角色元信息）
  i18n/               # 国际化配置与文案
  mock/               # 仪表盘随机数据示例
```

## 使用与开发
- 环境要求：Node.js ≥ 16
- 安装依赖：
  - `npm install`
- 启动开发：
  - `npm run dev`
  - 打开终端输出的本地地址（通常为 `http://localhost:5173/` 或 `http://localhost:5174/`）。
- 构建生产包：
  - `npm run build`
- 本地预览构建产物：
  - `npm run preview`

## 默认账号与角色
- 管理员：`admin / admin123`
- 普通用户：`user / user123`
- 角色控制：
  - Admin、About 等路由仅 `admin` 可访问。
  - Dashboard、Profile 对 `admin`、`user` 开放。
  - 路由守卫会在未登录时跳转到登录页，并在无权限时跳转到 `403` 页。

## 权限与路由
- 路由在 `src/router/routes.js` 中定义，使用 `meta.roles` 指定可访问角色。
- 全局前置守卫在 `src/router/index.js`：
  - 未登录访问受限路由时跳转到 `/auth`。
  - 登录但角色不满足时跳转到 `/403`。
- 角色校验由 `userStore.hasAccess()` 实现。

## 用户数据与校验
- 用户 Store：`src/stores/user.js`
  - 字段：`username`、`password`、`role`、`nickname`、`avatar`、`age`、`gender`、`createdAt`。
  - 年龄合法区间：`0–120`，在管理页创建/编辑与个人中心保存时均有校验。
  - `createdAt` 只读，在展示时统一用 `dayjs(...).format('YYYY-MM-DD HH:mm')`。
- 管理页筛选与排序：
  - 性别筛选（全部/男/女/其他），年龄最小/最大值输入，支持一键重置。
  - 年龄列按数值排序，性别列按枚举序排序（男 < 女 < 其他）。

## 仪表盘与动画
- 随机数据来源：`src/mock/dashboard.js`。
- 数字动画卡片：`src/components/NumberCard.vue`（基于 `countup.js`）。
- ECharts 图表在 `src/views/Dashboard.vue` 中集成并保留原布局。

## 国际化与语言切换
- 文案在 `src/i18n/index.js`，默认语言为中文（`zh-CN`），回退为英文（`en`）。
- 语言与 `appStore.locale` 同步，在应用启动与状态变化时自动更新并持久化。

## 主题与暗色模式
- 在 `appStore` 中维护暗色状态与主色，并通过 CSS 变量应用。
- Element Plus 暗色变量已启用（`element-plus/theme-chalk/dark/css-vars.css`）。

## 常见问题
- 端口冲突：Vite 会自动选择可用端口，请以终端输出为准。
- 登录失败：确认使用默认账号或先注册；注册后会自动登录为所选角色。
- 权限受限：确认当前用户角色是否符合路由 `meta.roles` 要求。

## 路线图 / TODO

### 已完成
- 登录页与路由守卫
  - 已有 `Auth.vue` 登录/注册页、Pinia 中 `token` 持久化、路由前置守卫（未登录跳 `/auth`，无权限跳 `/403`）。
  - 当前使用固定账号登录（`admin/admin123`、`user/user123`），满足“只做 UI + 路由守卫”的目标。
- 首页 Dashboard
  - 已集成 4 个数字卡片（`NumberCard.vue`，基于 `countup.js`）与 ECharts 折线图，保留随机 mock 与原布局。
  - 组件名称与来源与约定略有差异（`NumberCard.vue` 非 `CountCard.vue`；随机数为自定义 mock 非 `lodash.random`）。
- 个人中心
  - 已支持头像、昵称、修改密码（本地保存），使用 Pinia + persistedstate。
  - 表单 UI 为 `Element Plus`（与约定的 `naive-ui` 不同）。
- 错误页（部分）
  - 已实现 `403` 页面与路由。

### 计划项
- 系统监控（在线用户 / 系统指标 / 操作日志）
  - 使用 `@faker-js/faker` 批量生成数据。
  - 抽象 `useDataTable` 组合式封装表格交互。
  - 新增页面：`Monitoring/OnlineUsers.vue`、`SystemMetrics.vue`、`OperationLogs.vue`。
- 权限演示（角色管理 + 菜单管理）
  - 读取前端路由表作为“菜单列表”（当前源为 `src/router/routes.js`）。
  - 支持切换角色并动态 `addRoute` 重建可访问路由。
- 文件中心
  - 上传 → 转 Base64 → 存 `IndexedDB` → 列表展示，不接入 OSS。
  - 组件：`UploadSlice.vue`；建议存储使用 `localforage` 或 `idb-keyval`。
- 图表实验室
  - 拖拽生成折线图/柱状图；右侧 JSON 编辑器，改即刻刷新。
  - 组件：`ChartLab.vue`；拖拽可用 `SortableJS` / `vue-draggable`；编辑器可用 `monaco-editor` / `codemirror`。
- Dashboard 细化（对齐约定）
  - 在 mock 中改用 `lodash.random`；抽出折线图为独立组件 `LineChart.vue`。
- 个人中心 UI 框架迁移（可选）
  - 将表单从 `Element Plus` 迁移至 `naive-ui`，保持与 Pinia 持久化兼容。

## License
本项目仅用于示例与学习用途，不附带开源协议。如需生产使用，请根据实际需求调整与补充。
