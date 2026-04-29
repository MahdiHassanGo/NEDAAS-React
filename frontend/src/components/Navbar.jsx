import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getDashboardPath(role) {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "director":
      return "/dashboard/director";
    case "advisor":
      return "/dashboard/advisor";
    case "lead":
      return "/dashboard/lead";
    case "member":
    default:
      return "/dashboard/member";
  }
}

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, role, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const dashboardPath = getDashboardPath(role);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    setMobileOpen(false);

    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "publications", label: "Publications" },
    { id: "team", label: "Team" },
    { id: "contact", label: "Contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-300 transform-gpu" style={{ willChange: "transform, backdrop-filter" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
       <div className="flex h-20 items-center justify-between gap-3">
  <Link to="/" className="flex min-w-0 items-center gap-3 transition-transform hover:scale-105">
    <img
      src="/Images/logo.png"
      alt="NEDAAS Logo"
      className="h-10 w-auto object-contain sm:h-12 lg:h-16 drop-shadow-sm"
    />
  </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-5 md:flex">
            <div className="flex items-center gap-5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="relative text-deepTeal transition-colors hover:text-midTeal after:absolute after:bottom-[-6px] after:left-0 after:h-0.5 after:w-0 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal after:transition-all hover:after:w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={dashboardPath}
                  className="rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-4 py-2 text-sm font-medium text-white transition-shadow hover:shadow-lg"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-full border border-midTeal px-3 py-2 text-sm text-midTeal transition-colors hover:bg-midTeal hover:text-white"
                >
                  {loading ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
               
              >
                
              </Link>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex items-center gap-2 md:hidden">
            {firebaseUser && (
              <Link
                to={dashboardPath}
                className="rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-3 py-2 text-xs font-medium text-white"
              >
                Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-deepTeal transition-colors hover:bg-slate-50"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileOpen ? "max-h-[420px] pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className="rounded-xl px-4 py-3 text-left text-deepTeal transition-colors hover:bg-slate-50 hover:text-midTeal"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-3 border-t border-slate-100 pt-3">
              {firebaseUser ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-4 py-3 text-sm font-medium text-white"
                  >
                    Go to Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full border border-midTeal px-4 py-3 text-sm font-medium text-midTeal transition-colors hover:bg-midTeal hover:text-white"
                  >
                    {loading ? "..." : "Logout"}
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  
                >
                  
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}