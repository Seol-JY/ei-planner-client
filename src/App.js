import { useState, useEffect } from "react";
import axios from "axios";
import modalStore from "./stores/modalStore";
import userStore from "./stores/userStore";
import ModalContainer from "./modals/ModalContainer";
import Landing from "./main/Landing";
import Header from "./components/Header";
import egg from "./utils/egg";
import "./App.css";

const App = () => {
  const { isAuthenticated, setUserData, clearUserData } = userStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_PROXY}member`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(res);
        setIsLoading(false);
      } catch (error) {
        clearUserData();
        setIsLoading(false);
      }
    };
    // 쿼리스트링의 토큰 존재 여부 검사
    setIsLoading(true);
    const urlSearchParams = new URLSearchParams(window.location.search);
    const token = urlSearchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      urlSearchParams.delete("token");
      window.location.search = urlSearchParams.toString();
    } else {
      getUserData();
    }
    egg();
  }, [localStorage]);

  return (
    <div className="App">
      <ModalContainer />
      <Header isLoading={isLoading} />
      {isLoading ? "" : isAuthenticated ? "사용자 페이지" : <Landing />}
    </div>
  );
};

export default App;
