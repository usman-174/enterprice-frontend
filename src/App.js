import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from "react-router-dom";

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




function App() {
  const { setUser, user } = useUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get("/auth/getUser");

        setUser(data);
        setLoading(false);
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
      setLoading(false);

    };
    // if (!user) {
    checkUser();
    // }

    // eslint-disable-next-line
  }, []);
 if (loading && !user) {
    return <img src={logo} alt="loading" className="loader" />;
  }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <UserProtectedRoute Element={Home} loading={loading} user={user} Reverse={"/login"} />
          }
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />

        {/* ADMIN ROUTES */}

        <Route
          exact
          path="/dashboard"
          element={
            <AdminProtectedRoute
              Element={Dashboard}
              user={user} loading={loading}
              Reverse={"/"}
            />
          }
        >
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="licenses" element={<Licenses />} />


        </Route>
      </Routes>
    </Router>
  );
}

const UserProtectedRoute = ({ Element, Reverse,loading, user }) => {
    if(!user && !loading){
      return <Navigate to={"/login"} />;

    }
    if(user && !loading){
      if (user?.role==="user") {
        return <Element />;
      }else{
        return <Navigate to={"/dashboard"} />;
      }
    }
  
  return <Navigate to={Reverse} />;
};
const AdminProtectedRoute = ({ Element, Reverse,loading, user }) => {


  if(!user && !loading){
    return <Navigate to={"/login"} />;

  }
  if (user?.role === "admin"&& !loading) {
    return <Element />;
  }
  return <Navigate to={Reverse} />;
};
export default App;
