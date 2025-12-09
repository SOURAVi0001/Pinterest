import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
      return (
            <div className="privacy-policy-container">
                  <header className="privacy-header">
                        <div className="container">
                              <Link to="/" className="back-link">← Back to Home</Link>
                              <h1>Privacy Policy</h1>
                              <p className="last-updated">Last Updated: December 9, 2024</p>
                        </div>
                  </header>

                  <main className="privacy-content">
                        <div className="container">
                              <section className="privacy-section">
                                    <h2>1. Introduction</h2>
                                    <p>
                                          Welcome to PrintPress ("we," "us," "our," or "Company"). PrintPress is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                                    </p>
                              </section>

                              <section className="privacy-section">
                                    <h2>2. Information We Collect</h2>
                                    <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
                                    <ul>
                                          <li><strong>Personal Data:</strong> When you perform certain actions on our Site, such as creating an account, searching for images, or contacting us, we may ask you to provide certain information about yourself, including but not limited to your name, email address, and search preferences.</li>
                                          <li><strong>Device Information:</strong> We may collect information about the device you use to access our Site, including the hardware model, operating system and version, unique device identifiers, mobile network information, and device settings.</li>
                                          <li><strong>Usage Data:</strong> We automatically collect information about your interactions with our Site, such as the searches you perform, images you view, and pages you visit.</li>
                                          <li><strong>Cookies and Similar Tracking Technologies:</strong> We use cookies and similar tracking technologies to track activity on our Site and hold certain information.</li>
                                    </ul>
                              </section>

                              <section className="privacy-section">
                                    <h2>3. Use of Your Information</h2>
                                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
                                    <ul>
                                          <li>Generate a personal profile about you so that future visits to the Site will be personalized</li>
                                          <li>Increase the efficiency and operation of the Site</li>
                                          <li>Monitor and analyze usage and trends to improve your experience with the Site</li>
                                          <li>Notify you of updates to the Site</li>
                                          <li>Offer new products, services, and/or recommendations to you</li>
                                          <li>Perform other business activities as needed</li>
                                    </ul>
                              </section>

                              <section className="privacy-section">
                                    <h2>4. Disclosure of Your Information</h2>
                                    <p>We may share information we have collected about you in certain situations:</p>
                                    <ul>
                                          <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to comply with the law, enforce our Site policies, or protect ours or others' rights, property, and safety.</li>
                                          <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                                          <li><strong>Pinterest API:</strong> Our service uses the Pinterest API to fetch images. Please review Pinterest's privacy policy for information about how they handle your data.</li>
                                    </ul>
                              </section>

                              <section className="privacy-section">
                                    <h2>5. Security of Your Information</h2>
                                    <p>
                                          We use administrative, technical, and physical security measures to protect your personal information. However, perfect security does not exist on the Internet. You are responsible for maintaining the confidentiality of any password you use to access the Site and for restricting access to your device.
                                    </p>
                              </section>

                              <section className="privacy-section">
                                    <h2>6. Third-Party Websites</h2>
                                    <p>
                                          The Site may contain links to third-party websites. This Privacy Policy applies only to the Site. When you click on links to other websites, you leave the Site and are subject to the privacy policies of those third-party websites. We are not responsible for the privacy practices or contents of third-party websites.
                                    </p>
                              </section>

                              <section className="privacy-section">
                                    <h2>7. Contact Us</h2>
                                    <p>
                                          If you have questions or comments about this Privacy Policy, please contact us at:
                                    </p>
                                    <div className="contact-info">
                                          <p><strong>Email:</strong> privacy@printpress.com</p>
                                          <p><strong>Address:</strong> PrintPress, Inc.</p>
                                          <p>Your City, Your State, Your Country</p>
                                    </div>
                              </section>

                              <section className="privacy-section">
                                    <h2>8. Changes to This Privacy Policy</h2>
                                    <p>
                                          We reserve the right to modify this Privacy Policy at any time. Changes and clarifications will take effect immediately upon their posting to the Site. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under which circumstances, if any, we use and/or disclose it.
                                    </p>
                              </section>
                        </div>
                  </main>

                  <footer className="privacy-footer">
                        <div className="container">
                              <p>&copy; 2024 PrintPress - All Rights Reserved</p>
                        </div>
                  </footer>
            </div>
      );
}

export default PrivacyPolicy;
