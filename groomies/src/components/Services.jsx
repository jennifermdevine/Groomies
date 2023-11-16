import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { TbChartBubble } from "react-icons/tb";
import {
  FaScissors,
  FaPaw,
  FaTooth,
  FaEyeDropper,
  FaBugSlash,
} from "react-icons/fa6";
import "./Services.css";

const servicesData = [
  {
    id: 1,
    icon: TbChartBubble,
    title: "Bathing and Shampooing",
    description:
      "Our soothing and cleansing baths will leave your furry friend feeling fresh and revitalized. We use only the finest, pet-friendly shampoos to give your dog's coat a lustrous shine and their skin a gentle touch!",
  },
  {
    id: 2,
    icon: FaScissors,
    title: "Haircut and Styling",
    description:
      "Transform your dog's appearance with our professional grooming and styling services. From breed-specific cuts to creative and personalized styles, we'll have your pup looking their best!",
  },
  {
    id: 3,
    icon: FaPaw,
    title: "Nail Trimming",
    description:
      "Keep those nails in tip-top shape with our safe and stress-free nail trimming service. Regular nail maintenance not only enhances your dog's comfort but also protects your floors and furniture!",
  },
  {
    id: 4,
    icon: FaTooth,
    title: "Teeth Brushing and Oral Care",
    description:
      "Don't neglect your dog's dental health. Our teeth brushing and oral care services will give your pup fresh breath and prevent dental issues. A bright smile is just a brush away!",
  },
  {
    id: 5,
    icon: FaEyeDropper,
    title: "Ear Cleaning and Maintenance",
    description:
      "Healthy ears are happy ears. Our gentle ear cleaning and maintenance services ensure your dog's ears stay clean, free from infections, and itch-free!",
  },
  {
    id: 6,
    icon: FaBugSlash,
    title: "Flea and Tick Treatments",
    description:
      "Protect your pet from those tiny nuisances with our effective flea and tick treatments. Our expert groomers are well-versed in the latest methods to keep your dog itch-free and comfortable all year round!",
  },
];

function Services() {
  return (
    <div id="services">
      <div className="section-header text-center mb-4">
        <h2>Our Services</h2>
        <p>
          Explore our range of professional grooming services to keep your furry
          friend happy and healthy.
        </p>
      </div>
      <Row xs={1} md={2} className="g-4 service-cards">
        {servicesData.map((service) => (
          <Col key={service.id} className="mb-3">
            <Card className="service-card">
              <Card.Img
                variant="top"
                as={service.icon}
                className="service-icon"
              />
              <Card.Body className="card-body">
                <Card.Title className="service-title">
                  {service.title}
                </Card.Title>
                <Card.Text className="text-center">
                  <p className="text-wrap">{service.description}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Services;
