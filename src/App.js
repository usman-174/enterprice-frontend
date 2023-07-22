import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import axiosInstance from "./axiosInstance";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";

import logo from "./assests/logo.png";
import Navbar from "./components/navbar/Navbar";
import Departments from "./pages/dashboard/Departments";
import Licenses from "./pages/dashboard/Licenses";
import Users from "./pages/dashboard/Users";
import { useUser } from "./Store";
import ForgotPassword from "./pages/ForgotPassword";
import Directors from "./pages/dashboard/Directors";
import Suppliers from "./pages/dashboard/Suppliers";
import Donors from "./pages/dashboard/Donors";
import ComingLicenses from "./pages/ComingLicenses";
import Directions from "./pages/dashboard/Directions";

function App() {
  const { setUser, user } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        let response;
        if (window.location.pathname.includes("login")) {
          // Use axios if URL contains "login" string
          response = await axios.get(
            process.env.REACT_APP_API + "/auth/getUser" ||
              "https://enterprice-app-backend-production.up.railway.app/api/auth/getUser",
            { withCredentials: true }
          );
        } else {
          // Use axiosInstance if URL does not contain "login" string
          response = await axiosInstance.get("/auth/getUser");
        }

        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Check for user only once when the component mounts
    if (!user) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);
  if (loading && !user) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <UserProtectedRoute
              Element={Home}
              loading={loading}
              user={user}
              Reverse={"/login"}
            />
          }
        />
        <Route
          exact
          path="/coming_licenses"
          element={
            <UserProtectedRoute
              Element={ComingLicenses}
              loading={loading}
              user={user}
              Reverse={"/login"}
            />
          }
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          exact
          path="/forgot_password"
          element={user ? <Navigate to="/" /> : <ForgotPassword />}
        />

        {/* ADMIN ROUTES */}

        <Route
          exact
          path="/dashboard"
          element={
            <AdminProtectedRoute
              Element={Dashboard}
              user={user}
              loading={loading}
              Reverse={"/"}
            />
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="licenses" element={<Licenses />} />
          <Route path="directors" element={<Directors />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="donors" element={<Donors />} />
          <Route path="directions" element={<Directions />} />
        </Route>
      </Routes>
    </Router>
  );
}

const UserProtectedRoute = ({ Element, Reverse, loading, user }) => {
  if (!user && !loading) {
    return <Navigate to={"/login"} />;
  }
  if (user && !loading) {
    if (user?.role !== "admin") {
      return <Element />;
    } else {
      return <Navigate to={"/dashboard"} />;
    }
  }

  return <Navigate to={Reverse} />;
};
const AdminProtectedRoute = ({ Element, Reverse, loading, user }) => {
  if (!user && !loading) {
    return <Navigate to={"/login"} />;
  }
  if (user?.role === "admin" && !loading) {
    return <Element />;
  }
  return <Navigate to={Reverse} />;
};
export default App;
