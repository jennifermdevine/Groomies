import Carousel from "react-bootstrap/Carousel";
import "./HeroHome.css";

function HeroHome() {
  return (
    <div className="hero">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/300"
            alt="first slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>
              Mobile Grooming at Your Doorstep: Tailored Pet Care, Effortless
              Grooming
            </h1>
            <p>
              Welcome to Groomies, where convenience meets care. We're dedicated
              to delivering top-notch grooming services right to your doorstep,
              ensuring your pets look and feel their best without the hassle of
              leaving your home. Whether you're a pet owner looking for
              stress-free grooming or a talented groomer seeking opportunities
              to shine, our platform is the ultimate destination for tailored
              pet care and thriving careers. Join us in creating a world where
              happy pets and passionate groomers come together seamlessly!
            </p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/200"
            alt="second slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>Second slide label</h1>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/400"
            alt="second slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>Third slide label</h1>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroHome;
