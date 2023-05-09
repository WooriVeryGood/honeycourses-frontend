import "./Footer.css";

export default function Footer() {
  return (
    <div className="container">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-1 border-top">
        <div className="col-md-6 d-flex align-items-center">
          <span className="text-muted">
            &copy; 2023 답변 받았습니다! by @railgunOfPku.
            <br></br>
            project-railgun-frontend <strong>Ver. Dev</strong>, Source code
            available{" "}
            <a href="https://github.com/timingsniper/project-railgun-frontend">
              here
            </a>
            .
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
