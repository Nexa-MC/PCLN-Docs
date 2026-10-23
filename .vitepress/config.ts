import { defineConfig, UserConfig } from 'vitepress'
import { withI18n } from 'vitepress-i18n';
import { VitePressI18nOptions } from 'vitepress-i18n/types';

const themePages = ['index', 'quick-start', 'manifest-and-options', 'styles-and-resources', 'testing-and-publishing'];
const sidecarPages = ['index', 'quick-start', 'protocol-and-lifecycle', 'host-api', 'ui-and-extensions', 'testing-and-publishing'];
function authorSidebar(kind: 'theme-packs' | 'sidecar', english = false) {
  const themes = kind === 'theme-packs';
  const labels = themes
    ? (english ? ['Overview', 'Your first theme', 'Manifest and controls', 'Styles and resources', 'Testing and publishing'] : ['主题包概览', '制作第一个主题', '清单与设置控件', '样式与资源', '测试与发布'])
    : (english ? ['Overview', 'Build your first Sidecar', 'Protocol and lifecycle', 'Data and Host API', 'UI and extensions', 'Testing and distribution'] : ['Sidecar 概览', '构建第一个 Sidecar', '协议与生命周期', '数据与 Host API', 'UI 与扩展', '测试与分发']);
  return [{ text: themes ? 'NTP/1' : 'Sidecar · Alpha 12', items: (themes ? themePages : sidecarPages).map((page, i) => ({ text: labels[i], link: `${english ? '/en' : ''}/${kind}/${page === 'index' ? '' : page}` })) }];
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
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  lang: 'zh-CN',
  cleanUrls: true,
  metaChunk: true,

  rewrites: {
    'zhHans/:rest*': ':rest*'
  },

  themeConfig: {
    logo: '/logo.png',
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    sidebar: {
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
        { text: 'Theme packs', link: '/en/theme-packs/' },
        { text: 'Sidecar', link: '/en/sidecar/' },
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'PCL N Projects',
          link: '/en/projects'
        },
        {
          text: 'PXML',
          link: '/en/pxml-compiler/'
        },
        {
          text: 'Plugin Market',
          link: 'https://pcln.top/'
        },
      ]
    },
    zhHans: {
      nav: [
        { text: '主题包开发', link: '/theme-packs/' },
        { text: 'Sidecar 编写', link: '/sidecar/' },
        {
          text: '主页',
          link: '/'
        },
        {
          text: '旧版插件 SDK',
          link: '/plugin-sdk/'
        },
        {
          text: 'PXML',
          link: '/pxml-compiler/'
        },
        {
          text: '插件商店',
          link: 'https://pcln.top/'
        },
        {
          text: '开发者工作台',
          link: 'https://pcln.top/docs'
        },
        {
          text: '项目列表',
          link: '/projects'
        },
      ]
    }
  }
};

export default defineConfig(
  withI18n(vitepressConfig, i18nConfig)
)
