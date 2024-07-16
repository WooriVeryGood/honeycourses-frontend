import { Button, Form, InputGroup } from "react-bootstrap";
import majors from "../../../constants/majors.json";
import { useEffect } from "react";

interface AddCourseFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  course_name: string;
  setCourseName: (name: string) => void;
  course_credit: string;
  setCourseCredit: (credit: string) => void;
  course_category: string;
  setCourseCat: (category: string) => void;
  kaikeYuanxi: string;
  setYuanxi: (yuanxi: string) => void;
  isYouguan: number;
  setYouGuanStat: (stat: number) => void;
}

export default function AddCourseForm({
  handleSubmit,
  course_name,
  setCourseName,
  course_credit,
  setCourseCredit,
  course_category,
  setCourseCat,
  kaikeYuanxi,
  setYuanxi,
  isYouguan,
  setYouGuanStat,
}: AddCourseFormProps) {
  useEffect(() => {
    if (course_category === "体育课") {
      setYuanxi("体育教研部");
    } else if (course_category === "英语课") {
      setYuanxi("英语语言文学系");
    }
  }, [course_category, setYuanxi]);
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
        <InputGroup.Text
          id="inputGroup-sizing-lg"
          style={{ flexWrap: "nowrap" }}
        >
          강의명
        </InputGroup.Text>
        <Form.Control
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          value={course_name}
          onChange={(event) => setCourseName(event.target.value)}
          required
        />
      </InputGroup>
      <InputGroup className="mb-3 mx-auto" style={{ flexWrap: "nowrap" }}>
        <InputGroup.Text id="inputGroup-sizing-lg">학점</InputGroup.Text>
        <Form.Control
          as="textarea"
          type="number"
          rows={1}
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          value={course_credit}
          onChange={(event) => setCourseCredit(event.target.value)}
          required
        />
      </InputGroup>
      <br></br>
      <Form.Select
        className="mx-auto"
        aria-label="수업 종류 선택기"
        value={course_category}
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
        className="mx-auto"
        aria-label="카이커웬시 선택기"
        value={kaikeYuanxi}
        onChange={(event) => setYuanxi(event.target.value)}
        required
      >
        {course_category === "体育课" ? (
          <option value="体育教研部">体育教研部</option>
        ) : course_category === "英语课" ? (
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
        value={isYouguan}
        onChange={(event) => setYouGuanStat(parseInt(event.target.value))}
        required
      >
        <option value="0" disabled>
          중국유관 여부: 아니오
        </option>
        <option value="1">중국유관 여부: 예</option>
      </Form.Select>

      <div className="d-flex justify-content-end mt-4 mr-3">
        <Button variant="success" type="submit">
          제출
        </Button>
      </div>
    </Form>
  );
}
