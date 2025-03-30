import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaEnvelope, FaPhone, FaHome, FaInfoCircle, FaServicestack } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0268fd] text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: About Us */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Us</h3>
                        <p className="text-gray-200">
                            Một team kì cục gồm 3 thành viên. Gồm Nguyễn Văn Lợi, Nguyễn Hải Nam, Phạm Thanh Tươi, và thành viên dự bị Nguyễn Anh Dũng
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                                    <FaHome />
                                    <Link to="/" className="text-white font-medium transition">
                                        Trang chủ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                                    <FaInfoCircle />
                                    <Link to="/student-management" className="text-white font-medium transition">
                                        Quản lí sinh viên
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                                    <FaServicestack />
                                    <Link to="/device-management" className="text-white font-medium transition">
                                        Quản lí thiết bị
                                    </Link>
                                </div>
                            </li>

                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                                <FaMapMarkerAlt /> 31 Dịch Vọng, Cầu Giấy, Hà Nội
                            </li>
                            <li className="flex items-center gap-2">
                                <FaEnvelope /> nam75417@gmail.com
                            </li>
                            <li className="flex items-center gap-2">
                                <FaPhone /> +0961 805 129
                            </li>
                        </ul>
                    </div>

                    <div className='gap-6'>
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex space-x-4 text-xl">
                            <div>
                                <a href="https://www.facebook.com/nguyen.anh.dung.214470" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                                    <FaFacebook />
                                </a>
                            </div>
                            <div>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                                    <FaX />
                                </a>
                            </div>
                            <div>
                                <a href="https://www.instagram.com/_ptt.0710_/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{ marginLeft: '20%' }} className="border-t border-gray-500 mt-8 pt-4 text-center text-gray-200">
                    &copy; {new Date().getFullYear()} My Finger System. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
