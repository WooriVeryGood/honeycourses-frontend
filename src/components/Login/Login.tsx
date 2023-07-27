import { useEffect } from "react";
import { Authenticator, useAuthenticator, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useNavigate, useLocation } from "react-router";
import PageView from "../PageView/PageView";
import Container from "react-bootstrap/esm/Container";

export function Login() {
  const { route } = useAuthenticator((context) => [context.route]);
  const location = useLocation();
  const navigate = useNavigate();
  let from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (route === "authenticated") {
      navigate(from, { replace: true });
    }
  }, [route, navigate, from]);
  return (
    <PageView>
        <Container
          fluid
          className="justify-content-center align-items-start"
        >
      <View className="auth-wrapper">
        <Authenticator></Authenticator>
      </View>
      </Container>
    </PageView>
  );
}
