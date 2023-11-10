import Carousel from "react-bootstrap/Carousel";

function ServicesCarousel() {
  return (
    <div className="carousel">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/500"
            alt="first slide"
          ></img>
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://placedog.net/500"
            alt="first slide"
          ></img>
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default ServicesCarousel;
