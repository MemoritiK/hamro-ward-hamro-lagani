import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Add more routes like Home, About, etc. */}
      </Routes>
    </BrowserRouter>
  );
}
