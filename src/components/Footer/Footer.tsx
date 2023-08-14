import "./Footer.css";

export default function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1 border-top">
        <div className="col-md-10 d-flex align-items-center">
          <span className="text-muted">
            &copy; 2023 답변 받았습니다! by 우리잘했조. <br></br>
            honeycourses-frontend <strong>v.1.1.0b_20230814</strong>
            <br></br>
            honeycourses-backend-express <strong>v.1.1.0b_20230814</strong>
          </span>
        </div>
        <ul className="nav col-md-1 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a
              className="text-muted"
              href="https://github.com/WooriVeryGood"
              target="_blank"
              rel="noreferrer"
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
