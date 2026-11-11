import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">404</p>
      <h1 className="mt-2 text-3xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-brand mt-6">Back to home</Link>
    </main>
  );
}
