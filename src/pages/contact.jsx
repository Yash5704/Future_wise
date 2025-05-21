import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { FaEnvelope, FaInstagram } from 'react-icons/fa';

function Contact() {
   const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData(event.target);
      formDataToSend.append("access_key", "2e4924e1-4d6e-477a-9fe9-6147b0b092d4");

      const object = Object.fromEntries(formDataToSend);
      const json = JSON.stringify(object);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        Swal.fire({
          title: "Success!",
          text: "We received your Message!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: "swal-button-success",
          buttonsStyling: false,
          background: "#007bff",
          color: "white",
          timer: 2000,
        });

        setFormData({
          name: '',
          email: '',
          message: ''
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  }, []);


  return (
    <main className="contact-page">
      <section className="contact-section">
        <div className="contact-container">
          <header className="contact-header">
            <h1 className="contact-title">Contact Us</h1>
            <p className="contact-intro">
              Get in touch with our team for questions, feedback, or support
            </p>
          </header>

          <div className="contact-content">
            <article className="contact-info">
              <h2 className="contact-subtitle">About the Creator</h2>
              <p>
                Hello! I'm <strong>Yash Bhoraniya</strong>, the creator of this educational platform. 
                I'm passionate about helping students succeed through accessible, engaging learning resources.
              </p>
              <p>
                Your feedback helps us improve. Whether you have questions, suggestions, or just want to connect, 
                I'd love to hear from you!
              </p>

              <div className="contact-methods">
                <h3 className="contact-methods-title">Direct Contact</h3>
                <ul className="contact-list">
                  <li className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <a href="mailto:yashpatel07052004@gmail.com" className="contact-link">
                      yashpatel07052004@gmail.com
                    </a>
                  </li>
                  <li className="contact-item">
                    <FaInstagram className="contact-icon" />
                    <a href="https://www.instagram.com/yashhhhh75/" target="_blank" rel="noopener noreferrer" className="contact-link">
                      @yashhhhh75
                    </a>
                  </li>
                </ul>
              </div>
            </article>

            <article className="contact-form-container">
              <h2 className="contact-subtitle">Send Us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="form-input" 
                    placeholder="Enter your name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="form-input" 
                    placeholder="Enter your email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    className="form-textarea" 
                    rows="5" 
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="contact-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;