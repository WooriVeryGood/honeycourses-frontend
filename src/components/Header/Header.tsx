import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
  return (
    <Navbar
      expand="lg"
      fixed="top"
      style={{
        backgroundSize: "0",
        height: "70px",
        backgroundColor: "#1E90FF",
      }}
    >
      <Container>
        <Navbar.Brand href="/" style={{ color: "white" }}>
          <img
            alt=""
            src="/images/bootstrap-logo.svg"
            width="30"
            height="28"
            className="d-inline-block align-top"
          />{" "}
          답변 받았습니다!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" style={{backgroundColor: "#1E90FF"}}>
            <Nav.Link className="text-light text-center" href="/">Home</Nav.Link>
            <Nav.Link className="text-light text-center" href="/about">About</Nav.Link>
            <Nav.Link className="text-light text-center" href="/courses">Courses</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}