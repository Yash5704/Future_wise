import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
    return (
    <>
        <Navbar />
        <main className="min-h-screen">
            <Outlet /> {/* This will render page-specific content */}
        </main>
        <Footer />
    </>
);
};

export default Layout;