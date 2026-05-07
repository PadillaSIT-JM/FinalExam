import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("admin-token") 
  );

  return isLoggedIn
    ? <AdminDashboard onLogout={() => setIsLoggedIn(false)} />
    : <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
};

export default AdminPage;