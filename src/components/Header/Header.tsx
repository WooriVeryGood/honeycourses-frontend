import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { useLocation } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Header.module.css";

export default function Header() {
  const { user, signOut } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  let location = useLocation();
  const backgroundColor = location.pathname === "/" ? "white" : "#50CB93";
  const logoImage =
    location.pathname === "/" ? "/images/logo.png" : "/images/logowhite.png";

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
      className={styles.headerBody}
    >
      <Container fluid className="p-0">
        <Navbar.Brand
          href="/"
          style={{ color: "black", display: "flex", alignItems: "center" }}
        >
          <img
            alt=""
            src={logoImage}
            width="50"
            height="50"
            style={{ marginRight: "2%" }}
            className="d-inline-block align-top"
          />
          <span>답변 받았습니다!</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ marginRight: "10%" }}
        />
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
            <Nav.Link className="text text-center" href="/community">
              Community
    </Nav.Link>
            <Nav.Link className="text text-center" href="/support">
              Support Us!
            </Nav.Link>
          </Nav>
          <div
            className="text text-center"
            style={{ marginRight: "5%", backgroundColor }}
          >
            {authStatus !== "authenticated" ? (
              <>
                <p className="d-inline me-3 text text-center">
                  로그인해주세요.
                </p>
                <Button
                  className="text text-center"
                  variant="success"
                  href="/login"
                >
                  로그인
                </Button>
              </>
            ) : (
              <>
                <p className="d-inline me-3 text text-center">
                  안녕하세요, {user?.attributes?.email}님!
                </p>
                <Button
                  className="text text-center"
                  variant="danger"
                  onClick={signOut}
                >
                  로그아웃
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
