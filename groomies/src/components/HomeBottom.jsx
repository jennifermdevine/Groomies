import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomeBottom.css";

const HomeBottom = ({ title, text, imageSrc }) => {
  return (
    <Container className="home-bottom">
      <Row>
        <Col md={6}>
          <div className="home-content">
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
            <Link to="/register">
              <Button id="register-link" variant="primary" size="lg">
                Register Here!
              </Button>
            </Link>
          </div>
        </Col>

        <Col md={6}>
          <div className="register-image">
            <img src="https://placedog.net/600" alt="Dog" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeBottom;
