import { AuthForm } from "@/components/site/auth-form";

export const metadata = { title: "Sign In | AICT Global Bangladesh" };

export default function LoginPage() {
  return (
    <section className="pt-section" style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <h1 className="pt-section-title" style={{ marginBottom: 0 }}>Account Access</h1>
        <p className="pt-section-subtitle">Sign in to manage your donations.</p>
        <div
          style={{
            background: "var(--pt-card-bg)",
            border: "1px solid var(--pt-border)",
            borderRadius: "var(--pt-radius-lg)",
            padding: 30,
            boxShadow: "var(--pt-shadow-md)",
          }}
        >
          <AuthForm />
        </div>
      </div>
    </section>
  );
}
