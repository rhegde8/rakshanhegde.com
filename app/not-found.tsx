import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-accent-2 font-mono text-sm">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted text-sm">The page you requested does not exist.</p>
      <Link href="/" className="bg-accent-1 text-bg rounded-md px-4 py-2 text-sm font-semibold">
        Return home
      </Link>
    </main>
  );
}
