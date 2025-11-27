import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-screen min-h-screen grid grid-cols-[1fr-auto-1fr]">
      <Header />
      <main className="min-h-[100dvh]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
