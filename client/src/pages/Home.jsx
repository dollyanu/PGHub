import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularCities from "../components/PopularCities";
import FeaturedProperties from "../components/FeaturedProperties";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <Hero />

      <PopularCities />

      <FeaturedProperties />

      <Footer />
    </>
  );
};

export default Home;