import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PageView from "../PageView/PageView";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Auth } from "aws-amplify";

const apiUrl = process.env.REACT_APP_API_URL;

export default function AddCourse() {
  const [courseName, setCourseName] = useState("");
  const [courseCredit, setCourseCredit] = useState("");
  const [courseCategory, setCourseCat] = useState("");
  const [yuanxi, setYuanxi] = useState("");
  const [youGuanStat, setYouGuanStat] = useState(0);

  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userSession = await Auth.currentSession();
    const jwtToken = userSession.getIdToken().getJwtToken();

    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    const data = {
      courseName,
      courseCredit,
      courseCategory,
      yuanxi,
      youGuanStat,
    };
    axios
      .post(`${apiUrl}/courses`, data, { headers })
      .then((response) => {
        console.log(response.data);
        alert("수업 등록에 성공했습니다!");
        navigate(`/courses`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <PageView>
      <Container fluid className="justify-content-center align-items-center">
        <Row>
          <Col xs={8}>
            <h2 style={{ marginLeft: "14%" }}>강의 추가</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <p className="fw-light" style={{ marginLeft: "14%" }}>
              주의: 강의를 추가할때는 꼭 수업명을 줄이지 않고 选课系统에
              뜨는대로 풀네임으로 입력하고, 수업 종류가 올바른지 꼭
              확인해주세요. 올바르게 입력하지 않으면 다른 학우들이 찾는데
              어려움을 겪을 수도 있어요.<br></br>
              <a
                href="https://dean.pku.edu.cn/service/web/courseSearch.php"
                target="_blank"
                rel="noreferrer"
              >
                이곳
              </a>
              에서 수업 이름, 분류, 중국유관 여부를 확인해주세요!
            </p>
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">강의명</InputGroup.Text>
            <Form.Control
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              required
            />
          </InputGroup>
          <InputGroup
            className="mb-3 mx-auto"
            style={{ width: "80%", marginTop: "30px", marginBottom: "30px" }}
          >
            <InputGroup.Text id="inputGroup-sizing-lg">학점</InputGroup.Text>
            <Form.Control
              as="textarea"
              rows={1}
              aria-label="Large"
              aria-describedby="inputGroup-sizing-sm"
              value={courseCredit}
              onChange={(event) => setCourseCredit(event.target.value)}
              required
            />
          </InputGroup>
          <br></br>
          <Form.Select
            className="mx-auto"
            style={{ width: "80%" }}
            aria-label="수업 종류 선택기"
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
            className="mx-auto"
            style={{ width: "80%" }}
            aria-label="카이커웬시 선택기"
            value={yuanxi}
            onChange={(event) => setYuanxi(event.target.value)}
            required
          >
            <option value="">开课院系</option>
            <option value="数学科学学院">数学科学学院</option>
            <option value="物理学院">物理学院</option>
            <option value="化学与分子工程学院">化学与分子工程学院</option>
            <option value="生命科学学院">生命科学学院</option>
            <option value="地球与空间科学学院">地球与空间科学学院</option>
            <option value="心理与认知科学学院">心理与认知科学学院</option>
            <option value="新闻与传播学院">新闻与传播学院</option>
            <option value="中国语言文学系">中国语言文学系</option>
            <option value="历史学系">历史学系</option>
            <option value="考古文博学院">考古文博学院</option>
            <option value="哲学系">哲学系</option>
            <option value="国际关系学院">国际关系学院</option>
            <option value="经济学院">经济学院</option>
            <option value="光华管理学院">光华管理学院</option>
            <option value="法学院">法学院</option>
            <option value="信息管理系">信息管理系</option>
            <option value="社会学系">社会学系</option>
            <option value="政府管理学院">政府管理学院</option>
            <option value="英语语言文学系">英语语言文学系</option>
            <option value="外国语学院">外国语学院</option>
            <option value="马克思主义学院">马克思主义学院</option>
            <option value="体育教研部">体育教研部</option>
            <option value="艺术学院">艺术学院</option>
            <option value="元培学院">元培学院</option>
            <option value="信息科学技术学院">信息科学技术学院</option>
            <option value="国家发展研究院">国家发展研究院</option>
            <option value="工学院">工学院</option>
            <option value="城市与环境学院">城市与环境学院</option>
            <option value="环境科学与工程学院">环境科学与工程学院</option>
            <option value="医学部教学办">医学部教学办</option>
            <option value="北京大学教务部">北京大学教务部</option>
            <option value="教育学院">教育学院</option>
            <option value="歌剧研究院">歌剧研究院</option>
            <option value="现代农学院（筹）">现代农学院（筹）</option>
            <option value="建筑与景观设计学院">建筑与景观设计学院</option>
            <option value="软件与微电子学院">软件与微电子学院</option>
            <option value="对外汉语教育学院">对外汉语教育学院</option>
            <option value="产业技术研究院">产业技术研究院</option>
            <option value="中国社会科学调查中心">中国社会科学调查中心</option>
            <option value="创新创业学院">创新创业学院</option>
            <option value="前沿交叉学科研究院">前沿交叉学科研究院</option>
            <option value="学生工作部人民武装部">学生工作部人民武装部</option>
            <option value="中国共产主义青年团北京大学委员会">
              中国共产主义青年团北京大学委员会
            </option>
            <option value="人口研究所">人口研究所</option>
          </Form.Select>
          <br></br>
          <br></br>
          <Form.Select
            className="mx-auto"
            style={{ width: "80%" }}
            aria-label="유관여부 선택기"
            value={youGuanStat}
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
      </Container>
    </PageView>
  );
}
