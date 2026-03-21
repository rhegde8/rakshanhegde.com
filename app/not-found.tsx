import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-[#00ff88]">{"// 404"}</p>
      <h1 className="font-mono text-3xl font-semibold text-[#e2e8f0]">page not found</h1>
      <p className="text-sm text-[#6b7280]">the page you requested does not exist.</p>
      <Link
        href="/"
        className="bg-[#00ff88] px-4 py-2 font-mono text-sm font-semibold text-[#0c0c0c] transition-opacity hover:opacity-85"
      >
        return home
      </Link>
    </main>
  );
}
