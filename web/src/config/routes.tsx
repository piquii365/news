import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/Home";
import Culture from "../pages/Culture";
import Sports from "../pages/Sports";
import Reviews from "../pages/Reviews";
import Boxed from "../pages/Boxed";
import Politics from "../pages/Politics";
import Memes from "../pages/Memes";
import ArticleDetail from "../pages/ArticleDetails";
import CategoryArticles from "../pages/CategoryArticles";
import NotFound from "../pages/NotFound";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import AdminRoute from "../components/layout/AdminRoute";

const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "/culture", element: <Culture /> },
      { path: "/sports", element: <Sports /> },
      { path: "/reviews", element: <Reviews /> },
      { path: "/boxed", element: <Boxed /> },
      { path: "/politics", element: <Politics /> },
      { path: "/memes", element: <Memes /> },
      { path: "/category/:categoryId", element: <CategoryArticles /> },
      { path: "/article/:id", element: <ArticleDetail /> },
    ],
  },
  {
    path: "auth",
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <Suspense fallback={<div className="p-8">Loading admin...</div>}>
          <AdminDashboard />
        </Suspense>
      </AdminRoute>
    ),
  },
]);
