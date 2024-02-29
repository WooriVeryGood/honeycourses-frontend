import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import styles from "./Header.module.css";
import { useState } from "react";

export default function Header() {
  const [expanded, setExpanded] = useState(false);
  const { signOut } = useAuthenticator((context) => [
    context.user,
    context.route,
  ]);
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  let location = useLocation();
  const backgroundColor = location.pathname === "/" ? "white" : "#50CB93";
  const logoImage =
    location.pathname === "/" ? "/images/logo.png" : "/images/logowhite.png";
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
    setExpanded(false);
  }

  return (
    <nav>
      <Navbar
        className={styles.navBar}
        expand="lg"
        fixed="top"
        style={{
          backgroundColor,
        }}
        expanded={expanded}
      >
        <Container fluid className="p-0" style={{maxWidth: "100vw"}}>
          <Navbar.Brand href="/" className={styles.navBarBrand}>
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
            style={{ marginRight: "5%" }}
            onClick={() => setExpanded(!expanded)}
          />
          <Navbar.Collapse>
            <Nav className="me-auto" style={{ backgroundColor }}>
              <Nav.Link className="text text-center" onClick={() => handleNavigate('/')}>
                Home
              </Nav.Link>
              <Nav.Link className="text text-center" onClick={() => handleNavigate('/about')}>
                About
              </Nav.Link>
              <Nav.Link className="text text-center" onClick={() => handleNavigate('/courses')}>
                Courses
              </Nav.Link>
              <Nav.Link className="text text-center" onClick={() => handleNavigate('/community')}>
                Community
              </Nav.Link>
              <Nav.Link
                className="text text-center"
                href="https://scores.honeycourses.com"
              >
                Scores
              </Nav.Link>
              <Nav.Link className="text text-center" onClick={() => handleNavigate('/support')}>
                Support Us!
              </Nav.Link>
            </Nav>
            <div className={styles.buttonArea} style={{ backgroundColor }}>
              {authStatus !== "authenticated" ? (
                <>
                  <p className="d-inline me-3 text text-center">
                    로그인해주세요.
                  </p>
                  <Button
                    className="text text-center"
                    variant="success"
                    onClick={() => handleNavigate('/login')}
                  >
                    로그인
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="text text-center"
                    variant="secondary"
                    onClick={() => handleNavigate('/myinfo')}
                    style={{ marginRight: "10px", backgroundColor: '#0d6efd', borderColor: '#0d6efd'}}
                  >
                    내 정보
                  </Button>
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
    </nav>
  );
}
