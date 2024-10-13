import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import "../Styles/PrivacyPolicy.css";
import axios from "axios";
import toast from "react-hot-toast";

const PrivacyPolicy = () => {
  const [siteTitle, setSiteTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const getTitle = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/title/get-title"
      );
      setSiteTitle(data.titles[0]?.siteTitle || "Y-Ads");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTitle();
  }, []);

  return (
    <Container className="mt-5 mb-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Privacy Policy</Card.Title>
              <Card.Text>
                <h2>Introduction</h2>
                <p>
                  Welcome to {siteTitle ? siteTitle : "Our Website"}. This
                  Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website
                  [https://earn-tube-pk.netlify.app/]. Please read this privacy
                  policy carefully.
                </p>

                <h2>Information We Collect</h2>
                <p>
                  We may collect information about you in a variety of ways. The
                  information we may collect includes:
                </p>
                <ListGroup>
                  <ListGroup.Item>
                    <strong>Personal Data:</strong> Personally identifiable
                    information, such as your name, email address, phone number,
                    and other contact details.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Derived Data:</strong> Information our servers
                    automatically collect when you access the website, such as
                    your IP address, browser type, and operating system.
                  </ListGroup.Item>
                </ListGroup>

                <h2>Use of Your Information</h2>
                <p>We may use the information we collect to:</p>
                <ListGroup>
                  <ListGroup.Item>
                    Provide, operate, and maintain our website.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Improve, personalize, and expand our website.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Understand and analyze how you use our website.
                  </ListGroup.Item>
                </ListGroup>

                <h2>Sharing Your Information</h2>
                <p>We may share your information with third parties to:</p>
                <ListGroup>
                  <ListGroup.Item>
                    Comply with legal obligations.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Protect and defend our rights and property.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    With your consent, for other purposes.
                  </ListGroup.Item>
                </ListGroup>

                <h2>Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security
                  measures to help protect your personal information. While we
                  have taken reasonable steps to secure the personal information
                  you provide to us, please be aware that despite our efforts,
                  no security measures are perfect or impenetrable.
                </p>

                <h2>Your Data Protection Rights</h2>
                <p>
                  Depending on your location, you may have the following rights:
                </p>
                <ListGroup>
                  <ListGroup.Item>
                    <strong>The right to access:</strong> You have the right to
                    request copies of your personal data.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>The right to rectification:</strong> You have the
                    right to request that we correct any information you believe
                    is inaccurate or complete information you believe is
                    incomplete.
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>The right to erasure:</strong> You have the right to
                    request that we erase your personal data, under certain
                    conditions.
                  </ListGroup.Item>
                </ListGroup>

                <h2>GDPR Compliance</h2>
                <p>
                  If you are in the European Union (EU) or European Economic
                  Area (EEA), you have additional rights under the General Data
                  Protection Regulation (GDPR). These include the right to
                  access, rectify, or delete your personal data, as well as the
                  right to object to or restrict processing.
                </p>

                <h2>CPRA Compliance</h2>
                <p>
                  If you are a resident of California, you have rights under the
                  California Privacy Rights Act (CPRA), including the right to
                  know what personal information we collect, the right to
                  request deletion of your data, and the right to opt-out of the
                  sale of your personal information.
                </p>

                <h2>Google-served Ads and Content</h2>
                <p>
                  We strive to ensure that all content on our website is high
                  quality and valuable to our users. We do not display
                  Google-served ads on pages that lack sufficient
                  publisher-generated content. Our goal is to provide an
                  excellent user experience by presenting relevant and
                  substantial content alongside advertisements.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <ListGroup>
                  <ListGroup.Item>Email: [an8274885@gmail.com]</ListGroup.Item>
                  <ListGroup.Item>
                    Address: [skyland goasee garden phase 3]
                  </ListGroup.Item>
                </ListGroup>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PrivacyPolicy;
