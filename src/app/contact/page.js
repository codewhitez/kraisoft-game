import React from 'react';
import ContactForm from './contactForm';
import './contact.scss';

const ContactPage = () => {
  return (
    <div className='contact-us'>
      <h1>Contact Us</h1>
      <ContactForm />
    </div>
  );
};

export default ContactPage;