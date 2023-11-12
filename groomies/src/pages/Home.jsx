import { Helmet } from "react-helmet-async";
import HeroHome from "../components/HeroHome";
import Services from "../components/Services";

export default function Home() {
  return (
    <div className="Home">
      <Helmet>
        <title>Home | Groomies</title>
      </Helmet>
      <HeroHome />
      <Services />

      <div class="section">
        <div class="groomer-register">
          <h2>Join Our Dynamic Groomer Network Today!</h2>
          <p>
            Calling all talented groomers! Take control of your career and
            connect with pet owners seeking your expertise. Our freelance
            grooming platform empowers groomers like you to build a thriving
            business, set your own schedule, and create lasting relationships
            with furry clients. Register today to embark on a grooming journey
            that's as flexible as it is rewarding. Your skills, your rules -
            because every pet deserves the touch of a dedicated freelance
            groomer.
          </p>
        </div>
        <img src="https://placedog.net/600"></img>
      </div>
    </div>
  );
}
