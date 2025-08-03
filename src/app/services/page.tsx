import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import ServicesGridSection from '@/components/sections/ServicesGridSection';
import ServicesCTASection from '@/components/sections/ServicesCTASection';

export default function ServicesPage(): JSX.Element {

  return (
    <div>
      {/* Services Hero Section */}
      <ServicesHeroSection />
      
      {/* Services Grid & Implementation Process Section */}
      <ServicesGridSection />
      
      {/* Enhanced CTA Section */}
      <ServicesCTASection />
    </div>
  );
}