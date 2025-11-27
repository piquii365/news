import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          Page not found. The page you are looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition"
        >
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
