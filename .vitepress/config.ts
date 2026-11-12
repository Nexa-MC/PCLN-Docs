import { defineConfig, UserConfig } from 'vitepress'
import { withI18n } from 'vitepress-i18n';
import { VitePressI18nOptions } from 'vitepress-i18n/types';

type AuthorArea = 'development' | 'theme-packs' | 'sidecar' | 'nxml';
const authorPages: Record<AuthorArea, [string, string, string][]> = {
  development: [
    ['index', '第三方开发路线', 'Choose your development route'],
    ['goal-first', '按目标完成一个功能', 'Develop toward an observable goal'],
    ['xsr-architecture', 'XSR 架构与作者职责', 'XSR architecture and ownership'],
    ['walkthrough', '综合案例：资源页便签', 'Worked design: resource notes'],
    ['platform-and-runtime', '平台能力与运行数据', 'Platform capabilities and runtime data'],
  ],
  'theme-packs': [
    ['index', '主题包概览', 'Theme overview'],
    ['quick-start', '第一个可调节主题', 'Your first adjustable theme'],
    ['manifest-and-options', '清单与九种值类型', 'Manifest and nine value kinds'],
    ['options-recipes', '控件与实时应用实战', 'Controls and live application'],
    ['nss-language', 'NSS/1 完整语言', 'NSS/1 language'],
    ['layout-and-motion', '布局、绘制与动效', 'Layout, paint and motion'],
    ['styles-and-resources', '资源、授权与生命周期', 'Resources, authority and lifetime'],
    ['appearance-and-capabilities', '外观字段与能力参考', 'Appearance and capabilities'],
    ['testing-and-publishing', '测试、恢复与发布', 'Testing, recovery and publishing'],
    ['cookbook-and-troubleshooting', '综合案例与排错', 'Cookbook and troubleshooting'],
  ],
  sidecar: [
    ['index', '独立能力与学习路线', 'Capabilities and learning route'],
    ['quick-start', '第一个 Sidecar', 'Your first Sidecar'],
    ['protocol-and-lifecycle', '协议与完整生命周期', 'Protocol and complete lifecycle'],
    ['commands-and-queries', '命令、查询与数据编码', 'Commands, queries and codecs'],
    ['state-events-streams', '状态、事件和有背压的流', 'State, events and bounded streams'],
    ['nxml-pages', '共享 NXML、页面与引导', 'Shared NXML, pages and onboarding'],
    ['automatic-functions', 'NFP3 与自动函数目录', 'NFP3 and automatic function catalogs'],
    ['ui-and-extensions', '旧 schema 1/2 兼容', 'Legacy schema 1/2 compatibility'],
    ['signals-and-patches', '信号与有限补丁', 'Signals and finite patches'],
    ['host-api', '全部 Host API 与实例', 'Complete Host API and examples'],
    ['packaging-and-discovery', '发现、签名与监督', 'Discovery, trust and supervision'],
    ['testing-and-publishing', '验收、测试与发布', 'Acceptance, testing and distribution'],
    ['cookbook-and-troubleshooting', '综合案例与排错', 'Cookbook and troubleshooting'],
  ],
  nxml: [
    ['index', 'NXML 宿主界面路线', 'NXML Host authoring'],
    ['syntax-and-components', '语法、组件与身份', 'Syntax, components and identity'],
    ['layout-and-style', '布局、滚动与两套 NSS', 'Layout, scroll and NSS dialects'],
    ['state-and-input', '状态、草稿与输入意图', 'State, drafts and intent'],
    ['dynamic-and-reload', '动态片段与保留更新', 'Owned fragments and retained updates'],
    ['overlays-and-accessibility', '弹层、锚点与无障碍', 'Overlays, anchors and accessibility'],
    ['reference', '组件、属性与预算完整参考', 'Components, properties and budgets'],
    ['complete-example', '综合实验与 NativeAOT', 'Complete lab and NativeAOT'],
  ],
};
function authorSidebar(kind: AuthorArea, english = false) {
  const labels: Record<AuthorArea, string> = english
    ? { development: 'Goals and XSR', 'theme-packs': 'NTP/1 themes', sidecar: 'Sidecar', nxml: 'NXML Host UI' }
    : { development: '目标与 XSR', 'theme-packs': 'NTP/1 主题', sidecar: 'Sidecar', nxml: 'NXML 宿主界面' };
  const items = (area: AuthorArea) => authorPages[area].map(([path, zh, en]) => ({
    text: english ? en : zh,
    link: `${english ? '/en' : ''}/${area}/${path === 'index' ? '' : path}`,
  }));
  const sections = [{ text: labels.development, collapsed: kind !== 'development', items: items('development') }];
  if (kind !== 'development') sections.push({ text: `${labels[kind]} · Alpha 14`, collapsed: false, items: items(kind) });
  sections.push({ text: english ? 'Other authoring routes' : '其他开发路线', collapsed: false,
    items: (Object.keys(authorPages) as AuthorArea[]).filter(area => area !== kind && area !== 'development')
      .map(area => ({ text: labels[area], link: `${english ? '/en' : ''}/${area}/` })) });
  return sections;
}

const pluginSections: [string, string, [string, string, string][]][] = [
  ['连续教程', 'Tutorials', [
    ['', '开发文档概览', 'Start here'],
    ['quickstart', '1. 构建与加载', '1. Build and load'],
    ['tutorials/page-and-action', '2. 页面与确认动作', '2. Page and action'],
    ['tutorials/state-and-storage', '3. 状态与存储', '3. State and storage'],
    ['tutorials/workflows', '4. 后台工作流', '4. Workflows'],
    ['tutorials/test-and-release', '5. 测试与发布', '5. Test and release'],
  ]],
  ['概念与行为', 'Concepts and behavior', [
    ['architecture', '架构与职责', 'Architecture'],
    ['loading-contract', '加载、激活与退出', 'Loading and retirement'],
    ['permissions', '权限与归属', 'Permissions and ownership'],
    ['guides/asynchronous-calls', '异步、预算与结果', 'Async calls and outcomes'],
    ['guides/offline', '离线使用', 'Offline use'],
    ['runtime-services', '运行时详细语义（英文）', 'Runtime semantics'],
  ]],
  ['任务指南', 'Task guides', [
    ['how-to/read-instances', '读取实例列表', 'Read instances'],
    ['how-to/mutations', '预览与执行修改', 'Prepare mutations'],
    ['how-to/files', '访问文件与资源', 'Access files and assets'],
    ['how-to/extend-business-features', '扩展业务能力', 'Extend business features'],
    ['business-providers', '实现业务 Provider', 'Implement providers'],
    ['errors', '排查错误', 'Troubleshoot errors'],
    ['migration', '迁移旧插件', 'Migrate old plugins'],
  ]],
  ['参考', 'Reference', [
    ['api/', '全部 API（英文）', 'All API operations'],
    ['api/models', '模型与枚举（英文）', 'Models and enums'],
    ['host-support', '宿主支持范围', 'Host support'],
    ['packaging', '打包与分发', 'Packaging'],
    ['wasm-sdk', 'Wasm 执行与编码（英文）', 'Wasm execution and codec'],
    ['documentation', '文档约定（英文）', 'Documentation conventions'],
  ]],
];
function sdkSidebar(english = false) {
  return pluginSections.map(([zh, en, pages]) => ({
    text: english ? en : zh, collapsed: false,
    items: pages.map(([route, titleZh, titleEn]) => ({
      text: english ? titleEn : titleZh, link: `${english ? '/en' : ''}/plugin-sdk/${route}`,
    })),
  }));
}
const pluginSdkSidebar = sdkSidebar();
const englishPluginSdkSidebar = sdkSidebar(true);

const pxmlCompilerSidebar = [
  {
    text: 'PXML 编译器',
    collapsed: false,
    items: [
      { text: '概览与安装', link: '/pxml-compiler/' },
      { text: '命令行参考', link: '/pxml-compiler/CLI' },
      { text: '编译阶段与 PXB', link: '/pxml-compiler/Pipeline-and-PXB' },
      { text: '发布、PGO 与差分', link: '/pxml-compiler/Releases-and-PGO' },
    ],
  },
  {
    text: 'PXML UI 教程',
    collapsed: false,
    items: [
      { text: '教程概览', link: '/pxml-compiler/ui-tutorial/' },
      { text: '1. 创建第一个界面', link: '/pxml-compiler/ui-tutorial/First-Page' },
      { text: '2. 语法、节点与属性', link: '/pxml-compiler/ui-tutorial/Syntax-and-Properties' },
      { text: '3. 布局与尺寸', link: '/pxml-compiler/ui-tutorial/Layout-and-Sizing' },
      { text: '4. Binding、Command 与事件', link: '/pxml-compiler/ui-tutorial/Binding-and-Commands' },
      { text: '5. 条件、列表与虚拟化', link: '/pxml-compiler/ui-tutorial/Structure-and-Lists' },
      { text: '6. 组件、模板与 Slot', link: '/pxml-compiler/ui-tutorial/Components-and-Templates' },
      { text: '7. 样式、主题与资源', link: '/pxml-compiler/ui-tutorial/Styles-and-Resources' },
      { text: '8. 动效、交互与无障碍', link: '/pxml-compiler/ui-tutorial/Motion-Interaction-and-A11y' },
      { text: '9. 弹层、导航与 NativeHost', link: '/pxml-compiler/ui-tutorial/Overlays-Navigation-and-NativeHost' },
      { text: '10. 构建、调试与发布', link: '/pxml-compiler/ui-tutorial/Build-Debug-and-Release' },
      { text: '完整页面示例', link: '/pxml-compiler/ui-tutorial/Complete-Example' },
    ],
  },
];

const englishPxmlCompilerSidebar = [
  {
    text: 'PXML Compiler',
    collapsed: false,
    items: [
      { text: 'Overview and installation', link: '/en/pxml-compiler/' },
      { text: 'CLI reference', link: '/en/pxml-compiler/CLI' },
      { text: 'Pipeline and PXB', link: '/en/pxml-compiler/Pipeline-and-PXB' },
      { text: 'Releases, PGO, and diffs', link: '/en/pxml-compiler/Releases-and-PGO' },
    ],
  },
  {
    text: 'PXML UI tutorials',
    collapsed: false,
    items: [
      { text: 'Tutorial overview', link: '/en/pxml-compiler/ui-tutorial/' },
      { text: '1. Create your first UI', link: '/en/pxml-compiler/ui-tutorial/First-Page' },
      { text: '2. Syntax, nodes, and properties', link: '/en/pxml-compiler/ui-tutorial/Syntax-and-Properties' },
      { text: '3. Layout and sizing', link: '/en/pxml-compiler/ui-tutorial/Layout-and-Sizing' },
      { text: '4. Bindings, commands, and events', link: '/en/pxml-compiler/ui-tutorial/Binding-and-Commands' },
      { text: '5. Conditions, lists, virtualization', link: '/en/pxml-compiler/ui-tutorial/Structure-and-Lists' },
      { text: '6. Components, templates, slots', link: '/en/pxml-compiler/ui-tutorial/Components-and-Templates' },
      { text: '7. Styles, themes, and resources', link: '/en/pxml-compiler/ui-tutorial/Styles-and-Resources' },
      { text: '8. Motion, interaction, accessibility', link: '/en/pxml-compiler/ui-tutorial/Motion-Interaction-and-A11y' },
      { text: '9. Overlays, navigation, NativeHost', link: '/en/pxml-compiler/ui-tutorial/Overlays-Navigation-and-NativeHost' },
      { text: '10. Build, debug, and release', link: '/en/pxml-compiler/ui-tutorial/Build-Debug-and-Release' },
      { text: 'Complete page example', link: '/en/pxml-compiler/ui-tutorial/Complete-Example' },
    ],
  },
];

const vitepressConfig: UserConfig = {
  srcDir: "docs",
  
  title: "NexaCL Docs",
  description: "NexaCL 插件、主题、Sidecar 与 NXML 开发教程和参考",
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', href: '/icons/nexacl-32.png' }],
  ],
  lang: 'zh-CN',
  cleanUrls: true,
  metaChunk: true,

  rewrites: {
    'zhHans/:rest*': ':rest*'
  },

  themeConfig: {
    logo: { light: '/icons/neon-n-light-transparent.svg', dark: '/icons/neon-n-dark-transparent.svg' },
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    sidebar: {
      '/development/': authorSidebar('development'),
      '/nxml/': authorSidebar('nxml'),
      '/en/development/': authorSidebar('development', true),
      '/en/nxml/': authorSidebar('nxml', true),
      '/theme-packs/': authorSidebar('theme-packs'),
      '/sidecar/': authorSidebar('sidecar'),
      '/en/theme-packs/': authorSidebar('theme-packs', true),
      '/en/sidecar/': authorSidebar('sidecar', true),
      '/plugin-sdk/': pluginSdkSidebar,
      '/en/plugin-sdk/': englishPluginSdkSidebar,
      '/pxml-compiler/': pxmlCompilerSidebar,
      '/en/pxml-compiler/': englishPxmlCompilerSidebar,
      '/en/': [
        {
          text: 'NexaCL',
          items: [
            { text: 'Home', link: '/en/' },
            { text: 'Projects', link: '/en/projects' },
            { text: 'PXML', link: '/en/pxml-compiler/' },
            { text: 'Plugin SDK · ABI 100', link: '/en/plugin-sdk/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nexa-MC/NexaCL' }
    ],

    footer: {
      message: 'Site documentation: CC BY-SA 4.0. Imported SDK documents: Apache-2.0 as marked.',
      copyright: 'Copyright © 2026 <a href="https://github.com/MuXue1230-owo">PCL N contributors</a>'
    },
    editLink: {
      pattern: 'https://github.com/Nexa-MC/PCLN-Docs/edit/main/docs/:path',
    },
  },
}

const i18nConfig: VitePressI18nOptions = {
  locales: ['zhHans', 'en'],
  searchProvider: 'local',
  rootLocale: 'zhHans',
  themeConfig: {
    en: {
      nav: [
        { text: 'Developer guide', link: '/en/development/' },
        { text: 'Plugin SDK', link: '/en/plugin-sdk/' },
        { text: 'Themes', link: '/en/theme-packs/' },
        { text: 'Sidecar', link: '/en/sidecar/' },
        { text: 'NXML', link: '/en/nxml/' },
        { text: 'References', items: [
          { text: 'Legacy PXML', link: '/en/pxml-compiler/' },
          { text: 'Projects', link: '/en/projects' },
        ] },
        { text: 'NexaCL', link: 'https://pcln.top/docs' },
      ]
    },
    zhHans: {
      nav: [
        { text: '开发指南', link: '/development/' },
        { text: '插件 SDK', link: '/plugin-sdk/' },
        { text: '主题包', link: '/theme-packs/' },
        { text: 'Sidecar', link: '/sidecar/' },
        { text: 'NXML', link: '/nxml/' },
        { text: '参考文档', items: [
          { text: '旧版 PXML', link: '/pxml-compiler/' },
          { text: '项目列表', link: '/projects' },
        ] },
        { text: 'NexaCL 主站', link: 'https://pcln.top/docs' },
      ]
    },
  }
};

export default defineConfig(
  withI18n(vitepressConfig, i18nConfig)
)
