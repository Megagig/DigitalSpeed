'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// Sample skills data
const skills = [
  {
    id: 1,
    name: 'JavaScript',
    image: '/skills/javascript.png',
    proficiency: 90,
  },
  {
    id: 2,
    name: 'TypeScript',
    image: '/skills/typescript.png',
    proficiency: 85,
  },
  {
    id: 3,
    name: 'React',
    image: '/skills/react.png',
    proficiency: 90,
  },
  {
    id: 4,
    name: 'Next.js',
    image: '/skills/nextjs.png',
    proficiency: 85,
  },
  {
    id: 5,
    name: 'Node.js',
    image: '/skills/nodejs.png',
    proficiency: 80,
  },
  {
    id: 6,
    name: 'PostgreSQL',
    image: '/skills/postgresql.png',
    proficiency: 75,
  },
  {
    id: 7,
    name: 'MongoDB',
    image: '/skills/mongodb.png',
    proficiency: 70,
  },
  {
    id: 8,
    name: 'MySQL',
    image: '/skills/mysql.png',
    proficiency: 75,
  },
  {
    id: 9,
    name: 'Git',
    image: '/skills/git.png',
    proficiency: 85,
  },
  {
    id: 10,
    name: 'GitHub',
    image: '/skills/github.png',
    proficiency: 85,
  },
];

const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            My Skills
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {skills.map((skill, index) => (
            <div 
              key={skill.id}
              className={`flex flex-col items-center transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4">
                <Image
                  src={skill.image}
                  alt={skill.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {skill.name}
              </h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-purple-600 dark:bg-purple-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: isVisible ? `${skill.proficiency}%` : '0%',
                    transitionDelay: `${index * 100 + 300}ms`
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {skill.proficiency}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
