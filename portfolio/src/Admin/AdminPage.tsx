import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") 
  );

  return isLoggedIn
    ? <AdminDashboard onLogout={() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }} />
    : <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
};

export default AdminPage;