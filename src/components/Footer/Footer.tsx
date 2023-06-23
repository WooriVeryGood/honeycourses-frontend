import "./Footer.css";

export default function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1 border-top">
        <div className="col-md-10 d-flex align-items-center">
          <span className="text-muted">
            &copy; 2023 답변 받았습니다! by 팀 꿀수업.{" "}
            <strong>현재 개발이 진행중인 웹사이트입니다.</strong>
            <br></br>
            honeycourses-frontend <strong>v.1.0.0-dev</strong>
            <br></br>
            honeycourses-backend-express <strong>v.1.0.0-dev</strong>
          </span>
        </div>
        <ul className="nav col-md-1 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a
              className="text-muted"
              href="https://github.com/orgs/Honeycourse/repositories"
            >
              <img
                src="/images/github.svg"
                className="bi"
                width="24"
                height="24"
                alt="github-icon"
              />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
