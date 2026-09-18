# Search Console and Bing

Nothing here is required for the site to run. It is how you find out what search
engines and answer engines actually do with it.

## Verify ownership

**Prefer DNS TXT.** It survives redeploys, host changes and a wiped Vercel
project, and it verifies the whole domain rather than one page, which means
`openradio.space` and `www.openradio.space` are both covered by one record. The
app needs no change at all for this method.

1. Google Search Console, add property, choose **Domain** (not URL prefix).
2. Add the `TXT` record it gives you to the `openradio.space` DNS zone.
3. Bing Webmaster Tools can import the verified property straight from Google,
   which is quicker than verifying again.

**If you cannot reach the DNS zone**, set these in Vercel instead and redeploy.
They render as meta tags on every page:

| Variable | Engine |
| --- | --- |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console |
| `BING_SITE_VERIFICATION` | Bing Webmaster Tools |
| `YANDEX_SITE_VERIFICATION` | Yandex Webmaster |

A malformed value is dropped rather than rendered, because a broken tag fails
verification silently and is harder to spot than a missing one.

These tokens are not secrets (they are served in the HTML of every page) but
they are environment configuration, so keep them out of the repository.

## Submit the sitemap

Submit `https://www.openradio.space/sitemap.xml` in both tools.

`www` is the canonical host: the apex redirects to it with a 308, and
`NEXT_PUBLIC_APP_URL` is set accordingly, so canonicals, robots and the sitemap
all agree on `www`. Submitting the apex instead would report a redirect.

The sitemap rebuilds every six hours and currently carries roughly 1,600 URLs:
station pages, country, tag and language pages, the genre-in-country landing
pages and the static pages.

## What to look at once data arrives

Give it a few days; coverage reporting is not immediate.

- **Pages** → whether station pages are being indexed or excluded. "Crawled,
  currently not indexed" in volume means the quality bar in
  `lib/seo/station-sitemap.ts` is too loose and is submitting thin pages.
- **Submitted URL marked noindex** should be zero. If it is not, the sitemap and
  the pages disagree: the combo threshold in `lib/seo/combo-sitemap.ts` is the
  likely cause.
- **Crawl stats** → whether the AI crawlers named in `robots.txt` are actually
  fetching. They are allowed, not invited, so this is the only way to know.

## Checking a page the way a crawler sees it

`e2e/crawler.spec.ts` asserts the raw HTML carries the title, description,
canonical, structured data and real station content with no JavaScript executed.
Run it before assuming an indexing problem is Google's fault.

```sh
npx playwright test --project=desktop crawler
```
