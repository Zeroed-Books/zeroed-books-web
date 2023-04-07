import ExternalLink from "@/components/ExternalLink";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-lg p-4 text-center">
      <h1 className="mb-4 text-2xl md:text-3xl">Not Found</h1>
      <p className="mb-4 text-lg">
        You&apos;ve reached a page that doesn&apos;t exist.
      </p>
      <ExternalLink
        className="border border-green-600 px-4 py-2 text-green-600 transition-colors hover:border-green-700 hover:bg-slate-100 hover:text-green-700"
        href="/"
      >
        Home
      </ExternalLink>
    </section>
  );
}
