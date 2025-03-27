import MainLayout from "@/components/layouts/main-layout";
import HeroSection from "@/components/sections/hero-section";
import CategoriesSection from "@/components/sections/categories-section";
import FeaturedEventsSection from "@/components/sections/featured-events-section";
import HowItWorksSection from "@/components/sections/how-it-works-section";
import TestimonialSection from "@/components/sections/testimonial-section";
import NewsletterSection from "@/components/sections/newsletter-section";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedEventsSection />
      <HowItWorksSection />
      <TestimonialSection />
      <NewsletterSection />
    </MainLayout>
  );
}
