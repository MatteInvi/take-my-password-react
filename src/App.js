import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Archive from "./pages/ArchiveTable";
import Navbar from "./components/Navbar";
import ConfirmMail from "./pages/RegisterConfirm";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/confirm" element={<ConfirmMail/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
