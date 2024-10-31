import Link from 'next/link';
import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="  text-black py-10">
      <div className="max-w-6xl mx-auto text-center px-6">
        <h3 className="text-2xl font-bold mb-6">Pirate Social</h3>

        <div className="flex justify-center space-x-8 mb-6">
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            Terms of Service
          </Link>
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            Contact Us
          </Link>
        </div>

        <div className="flex justify-center space-x-6 mb-8">
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            <FaFacebookF />
          </Link>
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            <FaTwitter />
          </Link>
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            <FaLinkedinIn />
          </Link>
          <Link href="#" className=" hover:text-teal-200 transition-colors duration-300">
            <FaInstagram />
          </Link>
        </div>

        <p className="text-sm">&copy; 2024 Pirate Social. All rights reserved.</p>
      </div>
    </footer>
  );
}
