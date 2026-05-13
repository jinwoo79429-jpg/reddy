"use client";

export default function SignupPage() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--theme-secondary-color, #6D081D)",
        zIndex: 9999,
      }}
    >
      <iframe
        src="https://a2t.art/signup/reddybook.live"
        scrolling="yes"
        allowFullScreen
        title="Sign Up"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
