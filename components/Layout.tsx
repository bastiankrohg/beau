import React, { ReactNode } from 'react';
import Navbar from "@/Navbar";
import Footer from "@/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main> {/* Page content goes here */}
      <Footer />
    </div>
  );
};

export default Layout;
