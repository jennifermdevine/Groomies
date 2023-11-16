import { Helmet } from "react-helmet-async";
import HeroHome from "../components/HeroHome";
import Services from "../components/Services";
import HomeBottom from "../components/HomeBottom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="Home">
      <Helmet>
        <title>Home | Groomies</title>
      </Helmet>
      <HeroHome />
      <Services />
      <HomeBottom />
      <Footer />
    </div>
  );
}
