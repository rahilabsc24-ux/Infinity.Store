import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Field } from "../components/ui/Field.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { safeNext } from "../lib/utils.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(safeNext(params.get("next")), { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back to Infinity.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Field id="password" label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <ErrorBox message={error} />}
          <button type="submit" disabled={busy} className="btn btn-brand w-full">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to Infinity?{" "}
          <Link to={`/register${params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : ""}`} className="font-medium text-brand hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
