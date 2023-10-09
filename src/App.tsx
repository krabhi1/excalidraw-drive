import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import GoogleRedirectPage from "./pages/GoogleRedirectPage";
import NoPage from "./pages/NoPage";
import "./App.css";
import "./config/antd.config";
import Test from "./pages/Test";

function Layout() {
  return  <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EditorPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="redirect" element={<GoogleRedirectPage />} />
          <Route path="test" element={<Test />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
