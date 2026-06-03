import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/seo";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="mb-2 text-6xl font-extrabold text-amber-600">404</p>
      <h1 className="mb-3 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mb-8 text-slate-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700 transition-colors"
      >
        Back to {SITE_NAME}
      </Link>
    </div>
  );
}
