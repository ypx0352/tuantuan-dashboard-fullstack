import styled from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import LandingPage from "./pages/landing-page/LandingPage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import OverviewPage from "./pages/dashboard-pages/overview-page/OverviewPage";

import axios from "axios";

const Container = styled.div``;

function App() {
  

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/overview" element={<OverviewPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
