import { ChangeEvent, useEffect, useState } from "react";
import {
  Authenticator,
  useAuthenticator,
  View,
  TextField,
  CheckboxField,
} from "@aws-amplify/ui-react";
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

  const formFields = {
    signUp: {
      email: {
        label: "북경대 이메일 주소 (학번@(stu.)pku.edu.cn)",
        placeholder: "이메일 입력",
        descriptiveText: "올바른 형식으로 입력하셔야 가입버튼이 활성화됩니다.",
      },
    },
    resetPassword: {
        username: {
          placeholder: '이메일을 입력해주세요 (학번@(stu.)pku.edu.cn)',
        },
      },
  };

  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-start">
        <View className="auth-wrapper">
          <Authenticator
            formFields={formFields}
            components={{
              SignUp: {
                FormFields() {
                  const { validationErrors } = useAuthenticator();
                  return (
                    <>
                      <Authenticator.SignUp.FormFields />
                      <p style={{ color: "red" }}>
                        {validationErrors.acknowledgement as string}<br />
                        {validationErrors.descriptiveText as string}
                      </p>
                    </>
                  );
                },
              },
            }}
            services={{
              async validateCustomSignUp(formData) {
                if (
                  !/^\d{10}@(pku\.edu\.cn|stu\.pku\.edu\.cn)$/.test(
                    formData.email
                  )
                ) {
                  return {
                    acknowledgement:
                      "올바른 학번@pku.edu.cn 이메일을 입력해주세요",
                    descriptiveText: "(20학번부터는 학번@stu.pku.edu.cn 형식입니다)"
                  };
                }
              },
            }}
          ></Authenticator>
        </View>
      </Container>
    </PageView>
  );
}
