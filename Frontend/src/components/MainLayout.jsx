import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import VerificationRequired from "./VerificationRequired";

const MainLayout = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.user);
 
  return (
    <>
      {isLoggedIn && user?.email_verified === false && (
          <VerificationRequired/>
        )}
      <Topbar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;