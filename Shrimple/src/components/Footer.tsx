import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

interface FooterProps { }

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-light py-3">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            &copy; {new Date().getFullYear()} Shrimple. All rights reserved
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item ms-3">
                <a href="/contact" className="text-muted">Contact Us</a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
