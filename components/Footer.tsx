
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 py-6">
      <div className="container mx-auto text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Menofia Courses Academy. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;