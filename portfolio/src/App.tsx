import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import NavBar from "./pages/NavBar";
import AdminPage from "./Admin/AdminPage";
import ProtectedRoute from "./Admin/ProtectedRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/about"    element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/admin"    element={<AdminPage />} />
        <Route path="*"         element={<div>404 - Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;