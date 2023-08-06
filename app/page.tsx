import ExternalLink from "@/components/ExternalLink";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    noAuthRedirect?: string;
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { noAuthRedirect } = searchParams;
  const session = await getSession();

  if (session?.user && !noAuthRedirect) {
    redirect("/application");
  }

  return (
    <section className="bg-green-500 p-8 text-white">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 text-4xl font-bold md:mb-8 md:pt-0 md:text-6xl">
          Zeroed Books
        </h1>
        <h2 className="mb-4 text-xl md:text-2xl">
          Plain text double-entry accounting
        </h2>

        <div className="flex items-center space-x-4">
          <ExternalLink
            className="border-2 border-white px-4 py-2 text-lg font-bold transition-colors hover:border-slate-200 hover:bg-green-600 hover:text-slate-200 hover:shadow"
            href="/api/auth/signup?returnTo=/application"
          >
            Sign Up
          </ExternalLink>
          <ExternalLink
            className="px-4 py-2 text-lg font-bold transition-colors hover:text-slate-200"
            href="/api/auth/login?returnTo=/application"
          >
            Log In
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
