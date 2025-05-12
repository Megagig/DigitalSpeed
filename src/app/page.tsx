import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import RecentWorkSection from '@/components/RecentWorkSection';
import ExperienceSection from '@/components/ExperienceSection';
import SkillsSection from '@/components/SkillsSection';
import RecentBlogSection from '@/components/RecentBlogSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <RecentWorkSection />
      <ExperienceSection />
      <SkillsSection />
      <RecentBlogSection />
    </>
  );
}
