import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";

export default function Header() {
  let location = useLocation();
  const backgroundColor = location.pathname === "/" ? "white" : "#50CB93";
  const logoImage = location.pathname === "/" ? "/images/logothree.png" : "/images/logowhite.png"

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
            src={logoImage}
            width="50"
            height="50"
            style={{ marginRight: "5%" }}
            className="d-inline-block align-top"
          />
          <span>답변 받았습니다!</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ marginRight: "10%" }}/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav style={{ backgroundColor, marginRight: "10%" }}>
            <Nav.Link className="text text-center" href="/">
              Home
            </Nav.Link>
            <Nav.Link className="text text-center" href="/about">
              About
            </Nav.Link>
            <Nav.Link className="text text-center" href="/courses">
              Courses
            </Nav.Link>
            <Nav.Link className="text text-center" href="/support">
              Support Us!
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
