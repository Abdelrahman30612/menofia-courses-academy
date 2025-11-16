import React from 'react';
import { Tab } from '../App';

interface HeaderProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const getLinkClass = (tab: Tab) => {
    return `cursor-pointer transition-colors duration-300 ${
      activeTab === tab ? 'text-amber-500 font-bold' : 'hover:text-amber-500'
    }`;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: Tab) => {
    e.preventDefault();
    setActiveTab(tab);
    // Scroll to top when changing tabs for better UX on mobile
    window.scrollTo(0, 0);
  };
  
  return (
    <header className="bg-slate-900/90 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4 text-white">
        <div>
            <a onClick={(e) => handleNavClick(e, 'home')} href="#" className="text-2xl font-bold text-amber-500">
                Menofia Courses Academy
            </a>
        </div>
        <nav>
          <ul className="flex space-x-6 rtl:space-x-reverse">
            <li><a onClick={(e) => handleNavClick(e, 'home')} href="#" className={getLinkClass('home')}>الرئيسية</a></li>
            <li><a onClick={(e) => handleNavClick(e, 'courses')} href="#" className={getLinkClass('courses')}>التدريبات</a></li>
            <li><a onClick={(e) => handleNavClick(e, 'team')} href="#" className={getLinkClass('team')}>فريق العمل</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;