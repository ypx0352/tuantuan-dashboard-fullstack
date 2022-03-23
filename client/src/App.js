import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
//import 'dotenv/config'
import store from "./store";
import LandingPage from "./pages/landing-page/LandingPage";
import LoginPage from "./pages/login-page/LoginPage";
import RegisterPage from "./pages/register-page/RegisterPage";
import OverviewPage from "./pages/dashboard-pages/overview-page/OverviewPage";
import OrderPage from "./pages/dashboard-pages/order-page/OrderPage";
import CheckoutPage from "./pages/dashboard-pages/checkout-page/CheckoutPage";
import AddressPage from "./pages/dashboard-pages/address-page/AddressPage";
import SettingPage from "./pages/dashboard-pages/setting-page/SettingPage";
import TestPage from "./pages/dashboard-pages/test-page/TestPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/overview" element={<OverviewPage />} />
          <Route path="/dashboard/order" element={<OrderPage />} />
          <Route path="/dashboard/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard/address" element={<AddressPage/>} />
          <Route path="/dashboard/setting" element={<SettingPage />} />
          <Route path="/dashboard/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
