
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import Chatbot from "./Chatbot"; 

const MainLayout = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);
 
    return (
        <>
            {/* Removed the verification banner here */}
            <Topbar />
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <Chatbot />
        </>
    );
};

export default MainLayout;