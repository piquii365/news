import React from "react";
import { Mail, Phone, Heart } from "lucide-react";

const Footer: React.FC = () => {
  const categories = {
    SPORT: [
      {
        title: "Google To Boost Android Security In Few Days",
        image: "👨‍💼",
      },
      {
        title: "Cespedes play the winning Baseball Game",
        image: "⚾",
      },
    ],
    CRICKET: [
      {
        title: "US Promises to give intel aid to locate the soldiers",
        image: "🎯",
      },
      {
        title: "Renewable energy dead as industry waits for Policy",
        image: "👨‍💼",
      },
    ],
    LABELS: [
      { name: "Boxing", count: 5 },
      { name: "Fashion", count: 6 },
      { name: "Health", count: 7 },
      { name: "Nature", count: 8 },
    ],
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-3xl md:text-4xl font-bold">
                <span className="text-white">DISCUSSI</span>
                <span className="text-red-600">ON</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Buison is an amazing magazine Blogger theme that is easy to
              customize for your needs
            </p>
            <div className="space-y-2">
              <a
                href="mailto:hello@thebeautiful.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Mail size={16} />
                <span>news@discussion.com</span>
              </a>
              <a
                href="tel:+916052/488"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <Phone size={16} />
                <span>+2637895625</span>
              </a>
            </div>
          </div>

          {/* Sport Section */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              SPORT
            </h3>
            <div className="space-y-4">
              {categories.SPORT.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cricket Section */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              CRICKET
            </h3>
            <div className="space-y-4">
              {categories.CRICKET.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Labels Section */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">
              LABELS
            </h3>
            <div className="space-y-3">
              {categories.LABELS.map((label, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors flex items-center">
                    <span className="mr-2">›</span>
                    {label.name}
                  </span>
                  <span className="text-gray-600 text-sm">({label.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© all rights reserved</p>
            <p className="flex items-center space-x-1 mt-2 md:mt-0">
              <span>made with</span>
              <Heart size={14} className="text-red-600 fill-red-600" />
              <span>by mikelarry</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
