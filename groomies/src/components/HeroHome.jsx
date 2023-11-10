import Carousel from "react-bootstrap/Carousel";
import "./HeroHome.css";

function HeroHome() {
  return (
    <div className="hero">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/500"
            alt="first slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>First slide label</h1>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/600"
            alt="second slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>Second slide label</h1>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroHome;
