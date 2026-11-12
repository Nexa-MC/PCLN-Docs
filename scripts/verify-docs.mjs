import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
async function walk(dir) {
  const out=[];
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const name=path.join(dir,entry.name);
    if(entry.isDirectory())out.push(...await walk(name));
    else if(name.endsWith('.md'))out.push(name);
  }
  return out;
}
async function exists(file) {try {await access(file);return true;} catch {return false;}}
const failures=[];let links=0;
for(const file of await walk(path.join(root,'docs'))) {
  const raw=await readFile(file,'utf8');
  const prose=raw.replace(/^(`{3,}|~{3,}).*\n[\s\S]*?^\1\s*$/gm,'');
  for(const match of prose.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const target=match[1].split('#')[0].split('?')[0];
    if(!target || /^(?:[a-z]+:|\/\/)/i.test(target))continue;
    let base;
    if(target.startsWith('/')) {
      base=target.startsWith('/en/') ? path.join(root,'docs',target) : path.join(root,'docs/zhHans',target);
    } else base=path.resolve(path.dirname(file),decodeURIComponent(target));
    const candidates=[base+'.md',path.join(base,'index.md')];
    if(path.extname(base))candidates.unshift(base);
    if(target.startsWith('/'))candidates.push(path.join(root,'docs/public',target),path.join(root,'public',target));
    if(!(await Promise.all(candidates.map(exists))).some(Boolean))failures.push(`${path.relative(root,file)} -> ${target}`);
    links++;
  }
  if(file.includes('/plugin-sdk/') && !file.includes('/specifications/') && /PCL\.N\.Plugin\./.test(raw) && !/legacy|histor|旧|迁移|migrat/i.test(raw))
    failures.push(`Unlabelled legacy API: ${file}`);
}
const meta=JSON.parse(await readFile(path.join(root,'sdk-docs-source.json'),'utf8'));
if(meta.repository!=='Nexa-MC/NexaCL-Plugin-SDK' || !/^[a-f0-9]{40}$/.test(meta.commit))failures.push('Invalid SDK source identity');
if(failures.length)throw new Error(failures.join('\n'));
console.log(`Verified ${links} local documentation links and SDK source identity.`);
