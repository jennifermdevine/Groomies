import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./Services.css";

const ServiceSection = () => {
  return (
    <div id="services">
      <Container>
        {/* section header */}
        <Row>
          <Col>
            <h2>Our Services</h2>
            <p>Explore our range of services below.</p>
          </Col>
        </Row>

        {/* first row of cards */}
        <Row className="service-cards-row">
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Bathing and Shampooing</Card.Title>
                <Card.Text>
                  Our soothing and cleansing baths will leave your furry friend
                  feeling fresh and revitalized. We use only the finest,
                  pet-friendly shampoos to give your dog's coat a lustrous shine
                  and their skin a gentle touch.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Haircut and Styling</Card.Title>
                <Card.Text>
                  Transform your dog's appearance with our professional grooming
                  and styling services. From breed-specific cuts to creative and
                  personalized styles, we'll have your pup looking their best.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Nail Trimming</Card.Title>
                <Card.Text>
                  Keep those nails in tip-top shape with our safe and
                  stress-free nail trimming service. Regular nail maintenance
                  not only enhances your dog's comfort but also protects your
                  floors and furniture.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* second row of cards */}
        <Row className="service-cards-row">
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Teeth Brushing and Oral Care</Card.Title>
                <Card.Text>
                  Don't neglect your dog's dental health. Our teeth brushing and
                  oral care services will give your pup fresh breath and prevent
                  dental issues. A bright smile is just a brush away!
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Ear Cleaning and Maintenance</Card.Title>
                <Card.Text>
                  Healthy ears are happy ears. Our gentle ear cleaning and
                  maintenance services ensure your dog's ears stay clean, free
                  from infections, and itch-free. Say goodbye to those pesky ear
                  problems!
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="service-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Flea and Tick Treatments</Card.Title>
                <Card.Text>
                  Protect your pet from those tiny nuisances with our effective
                  flea and tick treatments. Our expert groomers are well-versed
                  in the latest methods to keep your dog itch-free and
                  comfortable all year round.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ServiceSection;
