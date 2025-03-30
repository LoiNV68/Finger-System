import React, { useState } from 'react';
import Logo from '../../assets/sv_header_login.png';
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope, FaUserPlus, FaBars, FaUserAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
        navigate('/login'); // Điều hướng đến trang đăng nhập
    };
    return (
        <header className="bg-[#0268fd] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-white ">
                            <img src={Logo} alt="Logo" className='h-14 w-96' />
                        </Link>
                    </div>


                    <nav className="hidden md:flex gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                            <FaHome />
                            <Link to="/" className="text-white font-medium transition">
                                Trang chủ
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                            <FaInfoCircle />
                            <Link to="/student-management" className="text-white font-medium transition">
                                Quản lí sinh viên
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition">
                            <FaServicestack />
                            <Link to="/device-management" className="text-white font-medium transition">
                                Quản lí thiết bị
                            </Link>
                        </div>

                    </nav>

                    <div style={{ padding: '20px' }} className="hidden md:flex items-center ml-auto ">
                        <Button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-white text-[#0268fd] px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition shadow-md border-2 border-white"
                        >
                            <FaUserAlt /> Đăng xuất
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <FaBars className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu (Dropdown) */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white shadow-md rounded-md p-4 mt-2">
                        <div className="flex flex-col space-y-4">
                            <Link to="/" className="flex items-center gap-2 text-[#0268fd] font-medium hover:opacity-80 transition px-3 py-2">
                                <FaHome /> Trang chủ
                            </Link>
                            <Link to="/student-management" className="flex items-center gap-2 text-[#0268fd] font-medium hover:opacity-80 transition px-3 py-2">
                                <FaInfoCircle /> Quản lí sinh viên
                            </Link>
                            <Link to="/device-management" className="flex items-center gap-2 text-[#0268fd] font-medium hover:opacity-80 transition px-3 py-2">
                                <FaServicestack /> Quản lí thiết bị
                            </Link>
                            <Button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-blue-300 text-[#0268fd]  font-semibold hover:bg-gray-200 transition shadow-md border-2 border-white"
                            >
                                <FaUserAlt /> Đăng xuất
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;