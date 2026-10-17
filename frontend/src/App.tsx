import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import { Home } from "./pages/home";
import { Jobs } from "./pages/jobs";
import { CompanyPage } from "./pages/company";
import { CompanyDetail } from "./pages/companyDetail";
import { BlogsPage } from "./pages/blogs";
import { BlogDetail } from "./pages/blogDetail";
import { About } from "./pages/about";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import { AdminDashboard } from "./pages/admin/AdminDashboard";

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/companies" element={<CompanyPage />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;