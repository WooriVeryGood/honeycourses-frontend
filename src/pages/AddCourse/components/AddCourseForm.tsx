import { Button, Col, Form, InputGroup } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import majors from "../../../constants/majors.json";
import { useEffect, useState } from "react";
import { useAddCourses } from "../../../API/courses/useAddCourses";
import "./AddCourseForm.css";
export default function AddCourseForm() {
  const { Formik } = formik;
  const [courseCategory, setCourseCat] = useState("");
  const [kaikeYuanxi, setYuanxi] = useState("");
  const { createCourse } = useAddCourses();

  const schema = yup.object().shape({
    course_name: yup.string().required("강의명을 입력해 주세요"),
    course_credit: yup
      .number()
      .max(6, "최댓값은 6입니다.")
      .min(1, "최솟값은 1입니다.")
      .required("학점을 입력해 주세요"),
  });

  useEffect(() => {
    if (courseCategory === "体育课") {
      setYuanxi("体育教研部");
    } else if (courseCategory === "英语课") {
      setYuanxi("英语语言文学系");
    } else {
      setYuanxi("");
    }
  }, [courseCategory, setYuanxi]);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(data) => {
        const courseData = Object.assign({}, data, {
          course_category: courseCategory,
          kaike_yuanxi: kaikeYuanxi,
        });
        createCourse(courseData);
      }}
      validateOnChange={false}
      initialValues={{
        course_name: "",
        course_credit: "",
        is_youguan: 0,
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
        isValidating,
        isSubmitting,
      }) => (
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text
              id="inputGroup-sizing-lg"
              style={{ flexWrap: "nowrap" }}
            >
              강의명
            </InputGroup.Text>
            <Form.Control
              name="course_name"
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={values.course_name}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.course_name && !errors.course_name}
              isInvalid={touched.course_name && !!errors.course_name}
            />
            {touched.course_name && errors.course_name && (
              <Form.Control.Feedback type="invalid">
                {errors.course_name}
              </Form.Control.Feedback>
            )}
          </InputGroup>

          <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
            <InputGroup.Text id="inputGroup-sizing-lg">학점</InputGroup.Text>
            <Form.Control
              as="textarea"
              type="string"
              name="course_credit"
              rows={1}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={values.course_credit}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.course_credit && !errors.course_credit}
              isInvalid={touched.course_credit && !!errors.course_credit}
            />
            {touched.course_credit && errors.course_credit && (
              <Form.Control.Feedback type="invalid">
                {errors.course_credit}
              </Form.Control.Feedback>
            )}
          </InputGroup>
          <br></br>

          <Form.Select
            className="mx-auto"
            aria-label="수업 종류 선택기"
            name="course_category"
            value={courseCategory}
            onChange={(event) => setCourseCat(event.target.value)}
            required
          >
            <option value="">수업 종류</option>
            <option value="通选课">通选课</option>
            <option value="体育课">体育课</option>
            <option value="专业课">专业课</option>
            <option value="英语课">英语课</option>
            <option value="公选课">公选课</option>
          </Form.Select>
          <br></br>
          <Form.Select
            required
            className="mx-auto"
            name="kaike_yuanxi"
            aria-label="카이커웬시 선택기"
            value={kaikeYuanxi}
            onChange={(event) => setYuanxi(event.target.value)}
          >
            {courseCategory === "体育课" ? (
              <option value="体育教研部">体育教研部</option>
            ) : courseCategory === "英语课" ? (
              <option value="英语语言文学系">英语语言文学系</option>
            ) : (
              <option value="">开课院系</option>
            )}
            {majors.map((major) => {
              return major.childrens.map((child, index) => (
                <option key={index} value={child.title}>
                  {child.title}
                </option>
              ));
            })}
          </Form.Select>
          <br></br>
          <br></br>
          <Form.Select
            className="mx-auto"
            aria-label="유관여부 선택기"
            name="is_youguan"
            value={values.is_youguan}
            onChange={handleChange}
          >
            <option value={0} disabled>
              중국유관 여부: 아니오
            </option>
            <option value={1}>중국유관 여부: 예</option>
          </Form.Select>

          <div className="d-flex justify-content-end mt-4 mr-3">
            <Button type="submit" disabled={isSubmitting}>
              제출
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
