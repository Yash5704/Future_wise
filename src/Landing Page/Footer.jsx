import { NavLink } from "react-router-dom";
import "../style-files/footer.css";

function Footer() {
    return (
        <footer className="footer-container">
            <nav aria-label="Secondary navigation">
                <ul className="footer-links">
                    <li>
                        <NavLink 
                            to='/about' 
                            className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}
                            aria-current="page"
                        >
                            About Us
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to='/help' 
                            className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}
                        >
                            Help
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to='/contact' 
                            className={({ isActive }) => isActive ? 'footer-link active' : 'footer-link'}
                        >
                            Contact
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="footer-copyright">
                &copy; {new Date().getFullYear()} FutureVise. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;