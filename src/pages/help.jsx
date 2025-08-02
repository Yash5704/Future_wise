import { NavLink } from "react-router-dom";
import "../style-files/help.css";
function Help() {
    return (
        <main className="help-page">
            <section className="help-section">
                <div className="help-container">
                    <header className="help-header">
                        <h1 className="help-title">Help Center</h1>
                        <p className="help-intro">
                            Need <strong>Assistance</strong> or Have <strong>Suggestions</strong>?
                        </p>
                    </header>

                    <div className="help-content">
                        <article className="help-card">
                            <p>
                                If you're experiencing any issues or have suggestions to improve our platform, we'd love to hear from you! Your feedback helps us provide the best learning experience.
                            </p>
                        </article>

                        <article className="help-card faq">
                            <h2 className="help-subtitle">Common Questions</h2>
                            <ul className="help-list">
                                <li>
                                    <strong>Videos not loading properly?</strong>
                                    <p>Try refreshing the page or checking your internet connection.</p>
                                </li>
                                <li>
                                    <strong>Facing difficulties with navigation?</strong>
                                    <p>Ensure you're using the latest version of your browser.</p>
                                </li>
                                <li>
                                    <strong>Problems on mobile devices?</strong>
                                    <p>Try rotating your screen or updating the app.</p>
                                </li>
                            </ul>
                        </article>

                        <article className="help-card contact-promo">
                            <h2 className="help-subtitle">Still Need Help?</h2>
                            <p>
                                If these solutions don't resolve your issue, please visit our <NavLink to="/contact" className="help-link">Contact Us</NavLink> page. Our support team typically responds within 24 hours.
                            </p>
                            <div className="help-cta">
                                <NavLink to="/contact" className="help-button">
                                    Contact Support
                                </NavLink>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Help;