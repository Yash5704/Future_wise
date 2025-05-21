function About() {
    return (
        <main className="about-page">
            <section className="about-section">
                <div className="about-container">
                    <header className="about-header">
                        <h1 className="about-title">About FutureWise</h1>
                        <p className="about-intro">
                            Welcome to <strong>FutureWise</strong>, where we make learning accessible and engaging for students worldwide.
                        </p>
                    </header>

                    <div className="about-content">
                        <article className="about-card">
                            <h2 className="about-subtitle">Our Platform</h2>
                            <p>
                                Our platform provides high-quality educational videos, interactive content, and personalized support to help students excel in their exams. Whether you're preparing for school exams, college entrance, or any academic goal, our courses are tailored for your success.
                            </p>
                            <p>
                                We're committed to making education accessible, flexible, and effective for all students, regardless of location or background.
                            </p>
                        </article>

                        <article className="about-card">
                            <h2 className="about-subtitle">Our Mission</h2>
                            <p>
                                To empower students with knowledge and tools for academic success and beyond. We believe education should be simple, accessible, and effective for everyone.
                            </p>
                        </article>

                        <article className="about-card">
                            <h2 className="about-subtitle">Our Team</h2>
                            <p>
                                Our team combines experienced educators and innovative developers passionate about creating exceptional learning experiences. We continuously improve our platform and expand content based on student needs and feedback.
                            </p>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;