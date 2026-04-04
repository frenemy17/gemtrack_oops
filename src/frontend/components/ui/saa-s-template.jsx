'use client';

import React from "react";
import Link from "next/link";

const Button = React.forwardRef(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icons
const ArrowRight = ({
  className = "",
  size = 16
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Menu = ({
  className = "",
  size = 24
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const X = ({
  className = "",
  size = 24
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// Navigation Component
const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">GemTrack</div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button type="button" variant="default" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-[slideDown_0.3s_ease-out]">
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Link href="/login">
                <Button type="button" variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button type="button" variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Navigation.displayName = "Navigation";

// Hero Component
const Hero = React.memo(() => {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-start px-6 py-20 md:py-24"
      style={{
        animation: "fadeIn 0.6s ease-out"
      }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <aside className="mb-8 h-2"></aside>
      <h1
        className="text-4xl md:text-5xl lg:text-6xl font-medium text-center max-w-3xl px-6 leading-tight mb-6"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em"
        }}>
        Manage Your Jewelry <br />Business With Precision
      </h1>
      <p
        className="text-sm md:text-base text-center max-w-2xl px-6 mb-10"
        style={{ color: '#9ca3af' }}>
        An elegant, all-in-one platform for jewelry stock management, <br />sales tracking, and barcode integration. Designed for the modern jeweler.
      </p>
      <div className="flex items-center gap-4 relative z-10 mb-16">
        <Link href="/signup">
          <Button
            type="button"
            variant="gradient"
            size="lg"
            className="rounded-lg flex items-center justify-center"
            aria-label="Get started with the template">
            Get started
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-[1400px] relative pb-20">
        <div
          className="absolute left-1/2 w-full max-w-[1400px] h-[700px] pointer-events-none z-0 opacity-80 mix-blend-screen rounded-[2rem]"
          style={{
            top: "-30%",
            transform: "translateX(-50%)",
            background: "radial-gradient(circle at center, hsla(46, 65%, 52%, 0.6) 0%, hsla(46, 65%, 52%, 0.3) 40%, rgba(0, 0, 0, 0) 70%)",
            filter: "blur(80px)"
          }}
          aria-hidden="true" />

        <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
          <img
            src="/dashboard-preview.png"
            alt="GemTrack Dashboard showing sales metrics, revenue, inventory, and performance charts"
            className="w-full h-auto"
            loading="eager" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = "Hero";

// Main Component
export default function Component() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      <Hero />
    </main>
  );
}