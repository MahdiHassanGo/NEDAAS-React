// src/components/Navbar.jsx
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

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, role, logout, loading } = useAuth();

  const scrollToSection = (sectionId) => {
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
    navigate("/", { replace: true });
  };

  const dashboardPath = getDashboardPath(role);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Lab Name */}
          <div className="flex items-center gap-3">
            <img
              src="/Images/NEDAAS 3.0-01.png"
              alt="NEDAAS Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-bold text-deepTeal">NEDAAS Lab</div>
              <div className="text-xs text-midTeal">
                Neural Engineering, Data Analytics &amp; Applied Science
              </div>
            </div>
          </div>

          {/* Right: Nav Links + Auth */}
          <div className="flex items-center gap-5">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="relative text-deepTeal hover:text-midTeal transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal after:transition-all hover:after:w-full"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {firebaseUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={dashboardPath}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white font-medium hover:shadow-lg transition-shadow text-sm md:text-base"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-3 py-2 rounded-full border border-midTeal text-midTeal hover:bg-midTeal hover:text-white transition-colors text-xs md:text-sm"
                >
                  {loading ? "..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white font-medium hover:shadow-lg transition-shadow text-sm md:text-base"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
