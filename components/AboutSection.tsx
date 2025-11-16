import React from 'react';
import { Accreditation } from '../types';

interface AboutSectionProps {
  accreditations: Accreditation[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ accreditations }) => {
  return (
    <section id="about" className="py-16 animate-fade-in-up">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <img 
          src="https://i.ibb.co/wZW4zgyp/mca.png" 
          alt="Menofia Courses Academy Logo" 
          className="mx-auto mb-12 h-96 w-auto main-logo-glow"
        />
        <h2 className="text-4xl font-bold mb-6 text-amber-500">من نحن؟</h2>
        <p className="text-lg text-slate-300 leading-relaxed mb-12 max-w-4xl mx-auto">
          في Menofia Courses Academy، نحن نؤمن بأن التعليم لا ينتهي عند بوابة الجامعة. نحن منصة تعليمية وتدريبية رائدة في قلب المنوفية، تأسست بهدف واحد: تمكين الطلاب والخريجين من أدوات المستقبل. نسعى لسد الفجوة بين الدراسة النظرية ومتطلبات سوق العمل المتسارعة، من خلال تقديم دورات تدريبية عملية ومكثفة في مجالات البرمجة، التصميم، التسويق الرقمي، والمهارات الشخصية. لا نقدم مجرد محاضرات، بل نقدم تجربة تعلم حقيقية على يد نخبة من المتخصصين، لنضمن لك الانتقال من مرحلة "التعلم" إلى مرحلة "الاحتراف" والجاهزية الوظيفية. شعارنا: نتعلم لنعمل، ونتطور لنقود.
        </p>

        {accreditations.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold mb-10 text-amber-500">اعتماداتنا</h3>
            <div className="flex justify-center items-center flex-wrap gap-8 md:gap-12 bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-slate-700/50">
              {accreditations.map((accreditation, index) => (
                <img 
                  key={index}
                  src={accreditation.imageUrl} 
                  alt={accreditation.altText} 
                  className="h-28 w-auto object-contain"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
