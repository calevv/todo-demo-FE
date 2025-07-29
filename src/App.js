import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./route/PrivateRoute";
import { useEffect, useState } from "react";
import api from "./utils/api";
function App() {
  const [user, setUser] = useState(null);
  const getUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        console.log("토큰 발견:", storedToken);
        const response = await api.get("/user/me");
        setUser(response.data.user);
        console.log("사용자 데이터 가져옴:", response.data.user);
      } else {
        console.log("세션 스토리지에 토큰이 없습니다.");
      }
    } catch (err) {
      console.error("사용자 데이터 가져오기 오류:", err); // <--- 오류 상세 정보를 위해 추가
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute user={user}>
            <TodoPage setUser={setUser} />
          </PrivateRoute>
        }
      />
      <Route path="/register" element={<RegisterPage user={user} />} />
      <Route
        path="/login"
        element={<LoginPage user={user} setUser={setUser} />}
      />
    </Routes>
  );
}
export default App;
