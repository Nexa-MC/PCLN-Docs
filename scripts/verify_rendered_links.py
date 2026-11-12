"""Validate same-site page and fragment links against rendered HTML, including rewritten locales."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit, urljoin
root=Path(__file__).resolve().parents[1]/'.vitepress/dist'
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=set();self.links=[];self.feed(text)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if 'id' in attrs:self.ids.add(attrs['id'])
        if tag=='a' and 'href' in attrs:self.links.append(attrs['href'])
pages={p:Page(p.read_text()) for p in root.rglob('*.html')}
errors=[];checked=0
for file,page in pages.items():
    route='/'+file.relative_to(root).as_posix()
    for href in page.links:
        link=urlsplit(href)
        if link.scheme or link.netloc:continue
        url=urlsplit(urljoin(route,href));relative=unquote(url.path).lstrip('/')
        base=root/relative
        candidates=[base] if base.suffix else [base.with_suffix('.html'),base/'index.html']
        if relative.endswith('/') or not relative:candidates=[base/'index.html']
        target=next((p for p in candidates if p.is_file()),None)
        if target is None:
            # Non-page downloads/assets are outside this check.
            if base.suffix and base.suffix!='.html':continue
            errors.append(f'{route} -> {href}: missing page');continue
        if url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'{route} -> {href}: missing fragment')
        checked+=1
if errors:raise SystemExit('\n'.join(errors[:80])+f'\n{len(errors)} broken rendered links')
print(f'PASS: {len(pages)} rendered pages, {checked} local page/fragment links.')
