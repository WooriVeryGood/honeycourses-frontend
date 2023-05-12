import "./Footer.css";

export default function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1 border-top">
        <div className="col-md-6 d-flex align-items-center">
          <span className="text-muted">
            &copy; 2023 답변 받았습니다! by @railgunOfPku. <strong>현재 개발이 진행중인 웹사이트입니다.</strong>
            <br></br>
            project-railgun-frontend <strong>v.1.0.0-dev</strong>
            <br></br>
            project-railgun-backend <strong>v.1.0.0-dev</strong>
          </span>
        </div>
        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a className="text-muted" href="https://github.com/timingsniper">
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
