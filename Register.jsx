import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Field } from "../components/ui/Field.jsx";
import { ErrorBox } from "../components/ui/ErrorBox.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { safeNext } from "../lib/utils.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate(safeNext(params.get("next")), { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track orders and check out faster.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field id="name" label="Full name" autoComplete="name" required value={form.name} onChange={set("name")} />
          <Field id="email" label="Email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} />
          <Field id="password" label="Password (min. 8 characters)" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={set("password")} />
          {error && <ErrorBox message={error} />}
          <button type="submit" disabled={busy} className="btn btn-brand w-full">
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
