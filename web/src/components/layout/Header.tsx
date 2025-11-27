import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Culture", href: "/culture" },
    { name: "Politics", href: "/politics" },
    { name: "Memes", href: "/memes" },
    { name: "Sports", href: "/sports" },
    { name: "Boxed", href: "/boxed" },
    { name: "Reviews", href: "/reviews" },
  ];

  return (
    <header className="bg-white">
      {/* Top Banner */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="Discussion Logo"
              className="h-12 md:h-16 w-auto"
              onError={(e) => {
                // Fallback if logo doesn't load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="hidden text-3xl md:text-4xl font-bold">
              <span className="text-black">DISCUSSI</span>
              <span className="text-red-600">ON</span>
            </div>
          </div>

          {/* Ad Banner - Desktop */}
          <div className="hidden lg:block flex-1 max-w-2xl ml-8">
            <div className="bg-gradient-to-r from-gray-800 to-black rounded overflow-hidden h-20 flex items-center justify-end px-8 relative">
              <div className="absolute left-0 top-0 bottom-0 w-1/3">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=200&fit=crop"
                  alt="Ad"
                  className="w-full h-full object-cover opacity-70"
                />
              </div>
              <div className="relative z-10">
                <span className="text-white text-2xl font-bold tracking-wider">
                  DISCUSS<span className="text-red-600">ON</span>
                </span>
              </div>
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-red-600/30 to-transparent transform -skew-x-12"></div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-black p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-black">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8 py-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className="text-white hover:text-red-600 transition-colors duration-200 text-sm font-medium uppercase tracking-wide"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <ul className="lg:hidden py-4 space-y-3">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="block text-white hover:text-red-600 transition-colors duration-200 text-sm font-medium uppercase tracking-wide py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
