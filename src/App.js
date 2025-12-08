import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Archive from "./pages/ArchiveTable";
import Navbar from "./components/Navbar";
import ConfirmMail from "./pages/RegisterConfirm";
import Register from "./pages/Register";
import RequestResetPassword from "./pages/RequestResetPassword";
import ConfirmResetPassword from "./pages/ConfirmResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password/confirm" element={<ConfirmResetPassword />}/>
        <Route path="/archive" element={<Archive />} />
        <Route path="/confirm" element={<ConfirmMail />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
