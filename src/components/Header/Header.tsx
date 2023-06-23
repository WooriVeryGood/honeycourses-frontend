import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";

export default function Header() {
  let location = useLocation();
  const backgroundColor = location.pathname === "/" ? "white" : "#50CB93";

  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundSize: "0",
        height: "70px",
        backgroundColor,
        paddingLeft: "5%",
        paddingRight: "0",
      }}
    >
      <Container fluid className="p-0">
        <Navbar.Brand href="/" style={{ color: "black", display: "flex", alignItems: "center" }}>
          <img
            alt=""
            src="/images/logo.png"
            width="30"
            height="28"
            style={{ marginRight: "1%" }}
            className="d-inline-block align-top"
          />
          <span>답변 받았습니다!</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ marginRight: "10%" }}/>
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
