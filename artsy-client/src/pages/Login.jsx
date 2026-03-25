import { useState } from "react";

const flowerImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Jan_Davidsz._de_Heem_-_Vase_of_Flowers_-_Google_Art_Project.jpg/800px-Jan_Davidsz._de_Heem_-_Vase_of_Flowers_-_Google_Art_Project.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>
        {/* Left: Form */}
        <div style={styles.formSection}>
          {/* Logo */}
          <div style={styles.logoWrap}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="22"
                fill="#5c3d1e"
                fontWeight="500"
              >
                AD
              </text>
              <rect
                x="2"
                y="2"
                width="48"
                height="48"
                rx="4"
                stroke="#5c3d1e"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          <h1 style={styles.title}>Welcome to Artsy Dublin</h1>
          <p style={styles.subtitle}>Find new activities to join</p>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              onFocus={(e) => (e.target.style.borderColor = "#5c3d1e")}
              onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: "44px" }}
                onFocus={(e) => (e.target.style.borderColor = "#5c3d1e")}
                onBlur={(e) => (e.target.style.borderColor = "#d9d9d9")}
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <div style={styles.passwordMeta}>
              <span style={styles.hint}>Use 8 or more letters, and numbers</span>
              <a href="#" style={styles.forgotLink}>
                Forgot Password?
              </a>
            </div>
          </div>

          <button onClick={handleSubmit} style={styles.signInBtn}>
            Sign In
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>Or</span>
            <span style={styles.dividerLine} />
          </div>

          <button style={styles.socialBtn}>
            <GoogleIcon />
            Sign in with Google
          </button>
          <button style={{ ...styles.socialBtn, marginTop: "10px" }}>
            <FacebookIcon />
            Sign in with Facebook
          </button>

          <p style={styles.signupText}>
            Don't you have an account?{" "}
            <a href="#" style={styles.signupLink}>
              Sign up
            </a>
          </p>
        </div>

        {/* Right: Artwork */}
        <div style={styles.imageSection}>
          <img src={flowerImage} alt="Floral artwork" style={styles.artwork} />
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0efed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  pageLabel: {
    alignSelf: "flex-start",
    marginLeft: "calc(50% - 500px)",
    color: "#aaa",
    fontSize: "13px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    marginBottom: "12px",
    letterSpacing: "0.02em",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "1000px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
    minHeight: "620px",
  },
  formSection: {
    flex: 1,
    padding: "56px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  imageSection: {
    width: "420px",
    flexShrink: 0,
    padding: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f5f2",
  },
  artwork: {
    width: "100%",
    height: "100%",
    maxHeight: "640px",
    objectFit: "cover",
    borderRadius: "12px",
  },
  logoWrap: {
    marginBottom: "16px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: "0 0 6px 0",
    textAlign: "center",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    fontSize: "13px",
    color: "#999",
    margin: "0 0 28px 0",
    textAlign: "center",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  formGroup: {
    width: "100%",
    maxWidth: "320px",
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    color: "#333",
    marginBottom: "6px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    textAlign: "left", 
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #d9d9d9",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    color: "#333",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    background: "#fff",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
  },
  passwordMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5px",
  },
  hint: {
    fontSize: "11px",
    color: "#bbb",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  forgotLink: {
    fontSize: "12px",
    color: "#1a73e8",
    textDecoration: "none",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  signInBtn: {
    width: "100%",
    maxWidth: "320px",
    padding: "13px",
    background: "#5c3d1e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    letterSpacing: "0.02em",
    marginTop: "8px",
    transition: "background 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "320px",
    margin: "20px 0",
    gap: "10px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e5e5e5",
  },
  dividerText: {
    fontSize: "13px",
    color: "#aaa",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  socialBtn: {
    width: "100%",
    maxWidth: "320px",
    padding: "11px",
    background: "#f0f4fb",
    color: "#333",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    transition: "background 0.2s",
  },
  signupText: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#555",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  },
  signupLink: {
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: "500",
  },
};
