import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoutes";
import RedirectRoutes from "./components/RedirectRoutes";
import Home from "./pages/Home";
import Signup from "./pages/SIgnup";
import FacebookLogin from "./pages/FacebookLogin";
import Helpdesk from "./pages/Helpdesk";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route element={<RedirectRoutes />}>
        <Route path="/login" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path="/fb-login" element={<FacebookLogin />} />
        <Route path="/helpdesk" element={<Helpdesk />} />
      </Route>
    </Routes>
  );
}

export default App;
