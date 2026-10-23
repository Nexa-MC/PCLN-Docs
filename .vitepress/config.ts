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
    ['ui-and-extensions', '有限表单与图片', 'Finite forms and images'],
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
  if (kind !== 'development') sections.push({ text: `${labels[kind]} · Alpha 12`, collapsed: false, items: items(kind) });
  sections.push({ text: english ? 'Other authoring routes' : '其他开发路线', collapsed: false,
    items: (Object.keys(authorPages) as AuthorArea[]).filter(area => area !== kind && area !== 'development')
      .map(area => ({ text: labels[area], link: `${english ? '/en' : ''}/${area}/` })) });
  return sections;
}

const pluginSdkSidebar = [
  {
    text: '入门',
    collapsed: false,
    items: [
      { text: 'SDK 概览', link: '/plugin-sdk/' },
      { text: '学习路线', link: '/plugin-sdk/Learning-Path' },
      { text: '快速开始', link: '/plugin-sdk/Getting-Started' },
      { text: '从零完成第一个插件', link: '/plugin-sdk/Tutorial-First-Plugin' },
      { text: '桌面端安装与调试', link: '/plugin-sdk/Desktop-Installation-and-Debugging' },
    ],
  },
  {
    text: '核心概念',
    collapsed: true,
    items: [
      { text: '架构与边界', link: '/plugin-sdk/Architecture-and-Boundaries' },
      { text: 'NuGet 包', link: '/plugin-sdk/NuGet-Packages' },
      { text: '插件身份与版本', link: '/plugin-sdk/Plugin-Identity-and-Versioning' },
      { text: '生命周期与注册项', link: '/plugin-sdk/Lifecycle-and-Registrations' },
      { text: '注册表与运行时注入', link: '/plugin-sdk/Registry-and-Runtime-Patches' },
      { text: '兼容与废弃', link: '/plugin-sdk/Compatibility-and-Deprecation' },
    ],
  },
  {
    text: '功能实战',
    collapsed: false,
    items: [
      { text: '服务、设置与后台任务实战', link: '/plugin-sdk/Tutorial-Services-and-Settings' },
      { text: '服务参考', link: '/plugin-sdk/Services' },
      { text: '实战案例集', link: '/plugin-sdk/Examples-Cookbook' },
    ],
  },
  {
    text: 'UI 扩展',
    collapsed: false,
    items: [
      { text: 'UI 扩展实战', link: '/plugin-sdk/Tutorial-UI-Extension' },
      { text: 'UI Surface 与 Slot', link: '/plugin-sdk/UI-Surfaces-and-Slots' },
      { text: 'UI Patch 与冲突', link: '/plugin-sdk/UI-Patches-and-Conflicts' },
    ],
  },
  {
    text: 'Manifest 与安全',
    collapsed: true,
    items: [
      { text: 'Plugin Manifest', link: '/plugin-sdk/Plugin-Manifest' },
      { text: '依赖与兼容声明', link: '/plugin-sdk/Dependencies-and-Compatibility' },
      { text: '权限与安全', link: '/plugin-sdk/Permissions-and-Security' },
      { text: 'Analyzer 参考', link: '/plugin-sdk/Analyzer-Reference' },
    ],
  },
  {
    text: '构建、测试与发布',
    collapsed: false,
    items: [
      { text: '依赖与打包实战', link: '/plugin-sdk/Tutorial-Dependencies-and-Packaging' },
      { text: '构建 .pnp', link: '/plugin-sdk/Building-PNP-Packages' },
      { text: '测试插件', link: '/plugin-sdk/Testing-Plugins' },
      { text: '测试、调试与发布实战', link: '/plugin-sdk/Tutorial-Test-Debug-Release' },
      { text: 'OpenPGP 签名', link: '/plugin-sdk/OpenPGP-Signing' },
      { text: '发布插件', link: '/plugin-sdk/Publishing-a-Plugin' },
    ],
  },
  {
    text: '排错与参考',
    collapsed: true,
    items: [
      { text: '故障排查', link: '/plugin-sdk/Troubleshooting' },
      { text: 'FAQ', link: '/plugin-sdk/FAQ' },
    ],
  },
];

const englishPluginSdkSidebar = pluginSdkSidebar.map(section => ({
  ...section,
  text: section.text,
  items: section.items.map(item => ({ ...item, link: `/en${item.link}` }))
}));

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
  description: "NexaCL 使用、NTP/1 主题包与 Sidecar 开发文档",
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
          text: 'PCL N',
          items: [
            { text: 'Home', link: '/en/' },
            { text: 'Projects', link: '/en/projects' },
            { text: 'PXML', link: '/en/pxml-compiler/' },
            { text: 'Plugin SDK 0.2.5', link: '/en/plugin-sdk/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Nexa-MC/NexaCL' }
    ],

    footer: {
      message: 'Documentation released under CC BY-SA 4.0.',
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
        { text: 'Themes', link: '/en/theme-packs/' },
        { text: 'Sidecar', link: '/en/sidecar/' },
        { text: 'NXML', link: '/en/nxml/' },
        { text: 'References', items: [
          { text: 'Legacy Plugin SDK', link: '/en/plugin-sdk/' },
          { text: 'Legacy PXML', link: '/en/pxml-compiler/' },
          { text: 'Projects', link: '/en/projects' },
        ] },
        { text: 'NexaCL', link: 'https://pcln.top/docs' },
      ]
    },
    zhHans: {
      nav: [
        { text: '开发指南', link: '/development/' },
        { text: '主题包', link: '/theme-packs/' },
        { text: 'Sidecar', link: '/sidecar/' },
        { text: 'NXML', link: '/nxml/' },
        { text: '参考文档', items: [
          { text: '旧版插件 SDK', link: '/plugin-sdk/' },
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
