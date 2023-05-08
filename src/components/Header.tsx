

export default function Header() {
    return (
        <nav
        className="navbar sticky-top"
        style={{ backgroundColor: "#1E90FF", height: "70px" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="/">
            <img
              src="/images/bootstrap-logo.svg"
              alt="Logo"
              width="30"
              height="28"
              className="d-inline-block align-text-top"
            />
            <span style={{paddingLeft: "10px"}}>답변 받았습니다!</span>
          </a>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="검색"
              aria-label="Search"
            />
            <button className="btn btn-success" type="submit" style={{minWidth: "70px"}}>
              검색
            </button>
          </form>
        </div>
      </nav>
    )
  }