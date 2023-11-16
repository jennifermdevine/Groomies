import React from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import dogGroom from "../assets/dog-groom.jpg";
import horse from "../assets/tackingUp.jpg";
import teddy from "../assets/teddyBear.png";
import "./HeroHome.css";

function HeroHome() {
  const carouselItems = [
    {
      id: 1,
      imageSrc: dogGroom,
      header: "Welcome to Groomies!",
      paragraph:
        "Welcome to Groomies, your go-to destination for top-notch pet grooming services. Our team of experienced groomers is dedicated to providing the utmost care and attention to your furry friends. Join us in creating a world where pets look and feel their best!",
    },
    {
      id: 2,
      imageSrc: teddy,
      header: "Unleash the Beauty with Specialized Pet Cuts!",
      paragraph:
        "From trendy trims to breed-specific cuts, we tailor each grooming session to highlight the distinct charm of your pets. Whether your pup prefers a chic modern look or your cat adores a classic, we have the expertise to bring your vision to life",
    },
    {
      id: 3,
      imageSrc: horse,
      header: "Embracing Our Roots: Introducing Horse Care at Groomies!",
      paragraph:
        "At Groomies, we're thrilled to announce a return to our roots with the introduction of specialized horse care services! With a rich history rooted in equestrian care, we're bringing our passion for grooming to the magnificent world of horses.",
    },
  ];

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={12}>
          <Carousel fade>
            {carouselItems.map((item) => (
              <Carousel.Item key={item.id}>
                <img
                  className="d-block w-100 resized-image"
                  src={item.imageSrc}
                  alt={`Carousel Item ${item.id}`}
                />
                <div className="gradient-overlay"></div>
                <Carousel.Caption>
                  <h3>{item.header}</h3>
                  <p>{item.paragraph}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
}

export default HeroHome;
