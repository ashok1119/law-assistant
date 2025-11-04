import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing-root">
      <header className="landing-nav">
        <div className="logo">LawAssistant</div>
        <nav className="nav-links">
          <Link to="/home" className="nav-link">Home</Link>
          <a href="#about" className="nav-link">About</a>
          <Link to="/login" className="nav-link cta small">Login</Link>
        </nav>
      </header>

      <main className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">Legal help, simplified.</h1>
          <p className="hero-sub">A friendly assistant that helps you understand legal text, generate drafts, and prepare for proceedings — fast and clearly.</p>
          <div className="hero-ctas">
            <Link to="/signup" className="btn primary">Get Started</Link>
            <Link to="/login" className="btn outline">Sign in</Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          {/* decorative shape */}
          <svg viewBox="0 0 600 400" className="blob" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#6dd3ff" />
                <stop offset="100%" stopColor="#8f7bff" />
              </linearGradient>
            </defs>
            <path fill="url(#g)" d="M421.3,304.4Q359,408,250.6,397.5Q142.2,387,86.9,298.4Q31.6,209.8,87.8,125.3Q144,40.9,255.5,47.6Q366.9,54.2,427.8,135.1Q488.8,216,421.3,304.4Z"></path>
          </svg>
        </div>
      </main>

      <section id="about" className="landing-about">
        <div className="about-inner">
          <h2>What we do</h2>
          <p>We help people draft legal documents, summarise complex laws, and prepare clear notes. Built for clarity, speed and accessibility.</p>

          <div className="features">
            <div className="feature">
              <h3>Summarize</h3>
              <p>Turn long statutes or contracts into plain, understandable summaries.</p>
            </div>
            <div className="feature">
              <h3>Draft</h3>
              <p>Generate templates and drafts for common legal forms and letters.</p>
            </div>
            <div className="feature">
              <h3>Prepare</h3>
              <p>Create checklists and briefs for hearings and client meetings.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div>© {new Date().getFullYear()} LawAssistant — All rights reserved.</div>
      </footer>
    </div>
  );
}
