import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";

// backgroundColor: "#1E90FF",
export default function Header() {
  let location = useLocation();
  const backgroundColor = location.pathname === "/" ? "white" : "#50CB93";

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{ backgroundSize: "0", height: "70px", backgroundColor }}
    >
      <Container>
        <Navbar.Brand href="/" style={{ color: "black" }}>
          <img
            alt=""
            src="/images/logo.png"
            width="30"
            height="28"
            style={{ marginRight: "1%" }}
            className="d-inline-block align-top"
          />
          {"  "}답변 받았습니다!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{ backgroundColor }}>
            <Nav.Link className="text text-center" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="text text-center" href="/about">
              About
            </Nav.Link>
            <Nav.Link className="text text-center" href="/courses">
              Courses
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
