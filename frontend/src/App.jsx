import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { me } from "@/features/auth";
import { clearUserData, setUserData } from "@/redux/userSlice";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Agents from "./pages/Agents";
import Integeration from "./pages/Integeration";
import CreateAgent from "./pages/CreateAgent";

function AppRoutes() {
  const dispatch = useDispatch();
  const { userData, status } = useSelector((state) => state.user);

  useEffect(() => {
    let isCurrent = true;

    me()
      .then((user) => {
        if (isCurrent) dispatch(setUserData(user));
      })
      .catch(() => {
        if (isCurrent) dispatch(clearUserData());
      });

    return () => {
      isCurrent = false;
    };
  }, [dispatch]);

  if (status === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#030407] text-sm text-zinc-400">
        Loading your workspace...
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/" element={userData ? <Home /> : <Navigate to="/intro" replace />} />
      <Route path="/login" element={userData ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/intro" element={userData ? <Navigate to="/" replace /> : <Intro />} />
      <Route path="*" element={<Navigate to={userData ? "/" : "/intro"} replace />} />
      <Route path="/agents" element={userData ? <Agents /> : <Navigate to="/intro" replace />} />
      <Route path="/integeration" element={userData ? <Integeration /> : <Navigate to="/intro" replace />} />
      <Route path="/agents/new" element={userData ? <CreateAgent /> : <Navigate to="/intro" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
