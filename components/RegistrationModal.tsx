import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Course, RegistrationData } from '../types';

interface RegistrationModalProps {
  course: Course;
  onClose: () => void;
  onSubmit: (formData: Omit<RegistrationData, 'courseTitle'>) => Promise<void>;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ course, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    discountCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await onSubmit(formData);
      setSuccess('تم تسجيلك بنجاح! سنتواصل معك قريبًا.');
      setFormData({ name: '', phone: '', email: '', discountCode: '' }); // Reset form
      setTimeout(() => {
        onClose();
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-lg shadow-2xl p-8 w-full max-w-md relative text-white border border-slate-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="إغلاق"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-2 text-amber-500">تسجيل في دورة</h2>
        <p className="text-lg text-slate-300 mb-6">{course.title}</p>
        
        {success ? (
          <div className="text-center p-4 bg-green-500/20 text-green-300 rounded-md">
            {success}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">الاسم بالكامل</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>
            <div>
              <label htmlFor="discountCode" className="block text-sm font-medium text-slate-300 mb-1">كود الخصم (اختياري)</label>
              <input
                type="text"
                id="discountCode"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-amber-600 transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;