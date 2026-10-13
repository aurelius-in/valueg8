import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ValueGate",
  description: "Evidence-backed decision gate for enterprise AI initiative prioritization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#f8f7f4] text-slate-900 antialiased">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black tracking-tight text-slate-900">ValueGate</div>
                <div className="hidden text-xs font-medium uppercase tracking-[0.18em] text-slate-500 sm:block">
                  AI Initiative Decision Gate
                </div>
              </div>

              <nav className="flex items-center gap-5 text-sm font-medium text-slate-700">
                <Link href="/">Evaluations</Link>
                <Link href="/compare">Compare</Link>
                <Link href="/method">About</Link>
              </nav>

              <Link
                href="/evaluation/new"
                className="inline-flex items-center rounded-md bg-[#0a6dff] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0b5fda]"
              >
                New Evaluation
              </Link>
            </div>
          </header>

          <main>{children}</main>

          <footer className="mt-16 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>ValueGate is an evaluation prototype from Reliable AI Network.</div>
              <div>Outputs are decision-support, not forecasts or guarantees.</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
