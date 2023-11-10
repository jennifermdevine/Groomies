import { Helmet } from "react-helmet-async";
import { Jumbotron, Button } from "react-bootstrap";

export default function Home() {
  return (
    <div className="Home">
      <Helmet>
        <title>Home | Groomies</title>
      </Helmet>
      <div class="section">
        <img src="https://placedog.net/500" alt="Dog Image"></img>
        <h1>
          Mobile Grooming at Your Doorstep: Tailored Pet Care, Effortless
          Grooming
        </h1>
        <p>
          Welcome to groomies, where convenience meets care. We're dedicated to
          delivering top-notch grooming services right to your doorstep,
          ensuring your pets look and feel their best without the hassle of
          leaving your home. Whether you're a pet owner looking for stress-free
          grooming or a talented groomer seeking opportunities to shine, our
          platform is the ultimate destination for tailored pet care and
          thriving careers. Join us in creating a world where happy pets and
          passionate groomers come together seamlessly!
        </p>
      </div>

      <div class="section">
        <div class="services-div">
          <h1>
            Welcome to Groomies: Where Passionate Groomers and Pet Lovers Unite!
          </h1>
          <p>
            Discover a grooming haven that transcends boundaries. PetGroomHub is
            not just a platform; it's a vibrant community where skilled groomers
            craft personalized experiences and pet owners find unparalleled
            convenience. From doorstep services to flexible scheduling, our hub
            is the epicenter of modern pet care. Whether you're seeking a
            talented groomer or ready to showcase your skills, PetGroomHub is
            your gateway to a world where pets receive top-tier pampering and
            groomers flourish in their passion. Join us on this transformative
            journey – because every pet deserves the best, and every groomer
            deserves the spotlight
          </p>
          <div class="service-card">
            <h3>
              <strong>Bathing and Shampooing</strong>
            </h3>
            <p class="service-info">
              Our soothing and cleansing baths will leave your furry friend
              feeling fresh and revitalized. We use only the finest,
              pet-friendly shampoos to give your dog's coat a lustrous shine and
              their skin a gentle touch
            </p>
          </div>
          <div class="service-card">
            <h3>
              <strong>Haircut and Styling</strong>
            </h3>
            <p class="service-info">
              Transform your dog's appearance with our professional grooming and
              styling services. From breed-specific cuts to creative and
              personalized styles, we'll have your pup looking their best.
            </p>
          </div>
          <div class="service-card">
            <h3>
              <strong>Nail Trimming</strong>
            </h3>
            <p class="service-info">
              Keep those nails in tip-top shape with our safe and stress-free
              nail trimming service. Regular nail maintenance not only enhances
              your dog's comfort but also protects your floors and furniture.
            </p>
          </div>
          <div class="service-card">
            <h3>
              <strong>Ear Cleaning and Maintenance</strong>
            </h3>
            <p class="service-info">
              Healthy ears are happy ears. Our gentle ear cleaning and
              maintenance services ensure your dog's ears stay clean, free from
              infections, and itch-free. Say goodbye to those pesky ear
              problems!
            </p>
          </div>
          <div class="service-card">
            <h3>
              <strong>Teeth Brushing and Oral Care</strong>
            </h3>
            <p class="service-info">
              Don't neglect your dog's dental health. Our teeth brushing and
              oral care services will give your pup fresh breath and prevent
              dental issues. A bright smile is just a brush away!
            </p>
          </div>
          <div class="service-card">
            <h3>
              <strong>Flea and Tick Treatments</strong>
            </h3>
            <p class="service-info">
              Protect your pet from those tiny nuisances with our effective flea
              and tick treatments. Our expert groomers are well-versed in the
              latest methods to keep your dog itch-free and comfortable all year
              round.
            </p>
          </div>
        </div>
      </div>

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
        <img src="https://placedog.net/600" alt="Dog Image"></img>
      </div>
    </div>
  );
}
