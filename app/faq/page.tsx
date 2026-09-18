import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { FAQ_ITEMS } from "@/lib/copy/faq";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/structured-data";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Questions and answers",
  description:
    "How OpenRadio works: what it costs, where the stations come from, what it stores about you, and why a station sometimes goes quiet.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-12 px-4 py-12">
      <JsonLd data={[faqJsonLd(FAQ_ITEMS), breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }])]} />

      <header className="space-y-3">
        <p className="font-mono text-[11px] tracking-[0.25em] text-accent uppercase">FAQ</p>
        <h1 className="text-4xl font-semibold sm:text-6xl">Questions and answers</h1>
        <p className="text-lg text-muted">
          What {SITE_NAME} is, what it costs, and what it does with your data.
        </p>
      </header>

      <dl className="space-y-8">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <div key={question} className="space-y-2">
            <dt className="text-2xl font-semibold">{question}</dt>
            <dd className="leading-relaxed text-muted">{answer}</dd>
          </div>
        ))}
      </dl>

      <p className="text-muted">
        Still stuck? The{" "}
        <Link href="/about" className="text-text underline underline-offset-4">
          about page
        </Link>{" "}
        goes into more detail, or{" "}
        <Link href="/" className="text-accent underline underline-offset-4">
          go back to the tuner
        </Link>
        .
      </p>
    </div>
  );
}
