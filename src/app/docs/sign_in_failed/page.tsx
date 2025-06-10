import Link from "next/link"

export default function SignInFailed() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Sign-In Issue</h1>
      <p style={{ marginBottom: "1rem" }}>
        We're currently experiencing a technical issue with email and password login. If you encounter an error like the one shown below, there's an easy workaround.
      </p>

      {/* Replace the src below with the actual image path once uploaded */}
      <img
        src="/docs/simisfield.png"
        alt="Sign-in error screenshot"
        style={{ width: "100%", maxWidth: "100%", marginBottom: "1rem", border: "1px solid #ccc" }}
      />

      <p style={{ marginBottom: "1rem" }}>
        Simply return to the <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>homepage</Link>. From there, click your avatar in the top-right corner to access the dashboard. Once inside, you can select the <strong>Dashboard</strong> option to manage your account.
      </p>

      <p style={{ fontStyle: "italic", color: "#555" }}>
        We appreciate your patience while we resolve this issue.
      </p>
    </div>
  )
}
