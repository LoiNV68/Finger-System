import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="w-full" style={{ minHeight: "calc(100vh - 120px)" }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};



export default Layout; 