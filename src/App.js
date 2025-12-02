import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Archive from "./pages/ArchiveTable";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
