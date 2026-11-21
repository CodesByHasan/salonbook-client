import CategorySection from "@/components/home/CategorySection";
import FeaturedServices from "@/components/home/FeaturedServices";
import HeroSection from "@/components/home/HeroSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
      <CategorySection />
      <WhyChooseUs />
    </>
  );
}