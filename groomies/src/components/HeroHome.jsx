import Carousel from "react-bootstrap/Carousel";
import "./HeroHome.css";
import teddyBear from "../assets/teddyBear.png";
import tackingUp from "../assets/horsepic.png";
import pugNugget from "../assets/pugpic.jpg"
function HeroHome() {
  return (
    <div className="hero">
      <Carousel>
        <Carousel.Item>
          <img
            class="h-75 d-inline-block"
            src={pugNugget}
            alt="first slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>
              Mobile Grooming at Your Doorstep: Tailored Pet Care, Effortless
              Grooming
            </h1>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            src={teddyBear}
            alt="second slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>Teddy Bear Cut</h1>
            <p>As the name suggests, this cut makes your Puppy look just like your first best friend. We can't think of a better way to take your pup's cute-and-cuddliness to a whole new level than with this medium-length haircut.</p>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="h-75 d-inline-block"
            src={tackingUp}
            alt="second slide"
          />
          <Carousel.Caption className="custom-caption">
            <h1>Tacking Up</h1>
            <p>Rubbing down a horse is simply the act of using a brush to clean your horse’s coat. It’s usually done after a ride to remove any dirt, sweat, or debris that may be clinging to his coat.
</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroHome;
