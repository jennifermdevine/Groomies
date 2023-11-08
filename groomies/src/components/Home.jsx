import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <div className="Home">
      <Helmet>
        <title>Home | Groomies</title>
      </Helmet>
      <h1>Home</h1>
      <div class="banner">
        <img src="https://placedog.net/500" alt=""></img>
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
      <div class="services-div">
        <div class="service-card">
          <h3>
            <strong>Bathing and Shampooing</strong>
          </h3>
          <p class="service-info">
            Our soothing and cleansing baths will leave your furry friend
            feeling fresh and revitalized. We use only the finest, pet-friendly
            shampoos to give your dog's coat a lustrous shine and their skin a
            gentle touch
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
      </div>
    </div>
  );
}
