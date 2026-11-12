import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sdk = path.resolve(process.env.NEXA_PLUGIN_SDK_SOURCE || path.join(root, '..', 'NexaCL-Plugin-SDK'));
const verify = process.argv.includes('--verify');
const sha = execFileSync('git', ['-C', sdk, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const project = await readFile(path.join(sdk, 'src/Nexa.Plugin.Sdk.Abi100/Nexa.Plugin.Sdk.Abi100.csproj'), 'utf8');
const version = project.match(/<Version>([^<]+)<\/Version>/)?.[1];
if (!version || !/^\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(version)) throw new Error('SDK package version is missing or invalid.');
const legacy = {
  'Getting-Started': 'quickstart', 'Tutorial-First-Plugin': 'quickstart',
  'Learning-Path': '', 'Architecture-and-Boundaries': 'architecture',
  'Tutorial-UI-Extension': 'tutorials/page-and-action',
  'Tutorial-Services-and-Settings': 'tutorials/state-and-storage',
  'Tutorial-Dependencies-and-Packaging': 'packaging',
  'Tutorial-Test-Debug-Release': 'tutorials/test-and-release',
  'Lifecycle-and-Registrations': 'loading-contract',
  'Permissions-and-Security': 'permissions',
  'Plugin-Manifest': 'packaging', 'Building-PNP-Packages': 'migration',
  'NuGet-Packages': 'packaging', 'Compatibility-and-Deprecation': 'migration',
  'Dependencies-and-Compatibility': 'loading-contract',
  'Desktop-Installation-and-Debugging': 'quickstart',
  'Examples-Cookbook': '', 'FAQ': 'errors', 'Troubleshooting': 'errors',
  'Testing-Plugins': 'tutorials/test-and-release', 'Publishing-a-Plugin': 'tutorials/test-and-release',
  'OpenPGP-Signing': 'packaging', 'Plugin-Identity-and-Versioning': 'architecture',
  'Registry-and-Runtime-Patches': 'migration', 'Services': 'runtime-services',
  'UI-Patches-and-Conflicts': 'migration', 'UI-Surfaces-and-Slots': 'tutorials/page-and-action',
  'Analyzer-Reference': 'migration',
};
async function walk(folder, relative = '') {
  const result = [];
  for (const entry of await readdir(path.join(folder, relative), { withFileTypes: true })) {
    if (entry.name === 'zh-CN') continue;
    const name = path.join(relative, entry.name);
    if (entry.isDirectory()) result.push(...await walk(folder, name));
    else if (entry.name.endsWith('.md')) result.push(name);
  }
  return result.sort();
}
for (const [locale, source] of [['en', path.join(sdk, 'docs')], ['zhHans', path.join(sdk, 'docs/zh-CN')]]) {
  const target = path.join(root, 'docs', locale, 'plugin-sdk');
  const expected = new Map();
  for (const name of await walk(source)) {
    let content = await readFile(path.join(source, name), 'utf8');
    // Repository-relative links between SDK translations need site locale roots:
    // docs/zh-CN/ becomes /plugin-sdk/, while docs/ becomes /en/plugin-sdk/.
    content = content.replace(/\]\(([^)\s]+)\)/g, (match, href) => {
      if (/^(?:[a-z]+:|\/|#)/i.test(href)) return match;
      const [target, ...fragment] = href.split('#');
      const resolved = path.resolve(path.dirname(path.join(source, name)), target);
      const relative = path.relative(path.join(sdk, 'docs'), resolved).split(path.sep).join('/');
      if (relative.startsWith('../') || path.isAbsolute(relative)) return match;
      const chinese = relative.startsWith('zh-CN/');
      if (chinese === (locale === 'zhHans')) return match;
      const route = chinese ? '/plugin-sdk/' + relative.slice('zh-CN/'.length) : '/en/plugin-sdk/' + relative;
      return '](' + route + (fragment.length ? '#' + fragment.join('#') : '') + ')';
    });
    const sourcePath = `${locale === 'en' ? 'docs' : 'docs/zh-CN'}/${name.split(path.sep).join('/')}`;
    // Historical proposals contain raw template syntax; publish them as literal source.
    if (name.startsWith('specifications/')) content = '# Historical design proposal\n\nThis is design history, not the current implementation reference.\n\n````text\n' + content + '\n````\n';
    content += `\n---\n\n${locale === 'en' ? 'Source' : '来源'}: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/${sha}/${sourcePath}) · Apache-2.0.\n`;
    expected.set(name, content);
  }
  for (const [old, destination] of Object.entries(legacy)) {
    const url = `/${locale === 'en' ? 'en/' : ''}plugin-sdk/${destination}`;
    expected.set(old + '.md', locale === 'en'
      ? `# This SDK page has moved\n\nThis URL belonged to the retired PCL SDK. New plugins use Bootstrap V1 and ABI 100.\nContinue with [the current guide](${url}) and review [migration](migration.md) before porting an old plugin.\n`
      : `# 此文档已迁移\n\n此地址原属旧 PCL SDK。新插件使用 Bootstrap V1 与 ABI 100。\n请阅读[当前指南](${url})，移植旧插件前先查看[迁移说明](migration.md)。\n`);
  }
  if (verify) {
    for (const [name, content] of expected) {
      if (await readFile(path.join(target, name), 'utf8').catch(() => null) !== content)
        throw new Error(`Stale SDK copy: ${locale}/${name}`);
    }
    const actual = await walk(target);
    if (actual.length !== expected.size) throw new Error(`Unexpected SDK pages in ${target}`);
  } else {
    await rm(target, { recursive: true, force: true });
    for (const [name, content] of expected) {
      await mkdir(path.dirname(path.join(target, name)), { recursive: true });
      await writeFile(path.join(target, name), content);
    }
  }
  console.log(`${verify ? 'Verified' : 'Synced'} ${expected.size} SDK pages: ${locale}`);
}
const metadataPath = path.join(root, 'sdk-docs-source.json');
const metadata = JSON.stringify({
  repository: 'Nexa-MC/NexaCL-Plugin-SDK', commit: sha,
  version, command: 'pnpm docs:sync',
}, null, 2) + '\n';
if (verify) {
  if (await readFile(metadataPath, 'utf8') !== metadata) throw new Error('SDK source metadata is stale.');
} else await writeFile(metadataPath, metadata);
