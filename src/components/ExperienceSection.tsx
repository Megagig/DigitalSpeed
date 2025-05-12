'use client';

import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

// Sample experience data
const experiences = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    period: '2021 - Present',
    description: 'Leading development of web applications using Next.js, React, and PostgreSQL. Implementing CI/CD pipelines and mentoring junior developers.',
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'Digital Solutions Ltd.',
    period: '2018 - 2021',
    description: 'Developed and maintained multiple client websites and applications. Worked with React, Node.js, and MongoDB.',
  },
  {
    id: 3,
    title: 'Frontend Developer',
    company: 'Creative Web Agency',
    period: '2016 - 2018',
    description: 'Created responsive and interactive user interfaces using HTML, CSS, and JavaScript. Collaborated with designers to implement pixel-perfect designs.',
  },
];

// Sample education data
const education = [
  {
    id: 1,
    degree: 'Master of Computer Science',
    institution: 'University of Technology',
    period: '2014 - 2016',
    description: 'Specialized in web technologies and software engineering. Graduated with distinction.',
  },
  {
    id: 2,
    degree: 'Bachelor of Computer Science',
    institution: 'State University',
    period: '2010 - 2014',
    description: 'Focused on programming fundamentals, data structures, and algorithms. Participated in coding competitions.',
  },
  {
    id: 3,
    degree: 'Web Development Bootcamp',
    institution: 'Code Academy',
    period: '2015',
    description: 'Intensive 12-week program covering full stack web development with modern JavaScript frameworks.',
  },
];

const ExperienceSection = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Experience & Education
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            My professional journey and educational background that have shaped my skills and expertise.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Experience Section */}
          <div>
            <div className="flex items-center mb-8">
              <FaBriefcase className="text-3xl text-purple-600 dark:text-purple-400 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Work Experience
              </h3>
            </div>
            
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-800">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {exp.title}
                  </h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {exp.company}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education Section */}
          <div>
            <div className="flex items-center mb-8">
              <FaGraduationCap className="text-3xl text-purple-600 dark:text-purple-400 mr-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Education
              </h3>
            </div>
            
            <div className="space-y-8">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-8 border-l-2 border-purple-200 dark:border-purple-800">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-600 dark:bg-purple-400"></div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {edu.degree}
                  </h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      {edu.institution}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
