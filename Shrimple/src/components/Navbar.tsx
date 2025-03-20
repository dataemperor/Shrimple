import {Link} from "react-router-dom";

function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src="/shrimple.png" alt="logo" width="30" height="30" className="d-inline-block align-text-top"/>
            Shrimple
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item-home">
                <Link className="nav-link active" aria-current="page" to="/Home">Home</Link>
              </li>
              <li className="nav-item-about">
                <Link className="nav-link active" aria-current="page" to="/About">About</Link>
              </li>
              <li className="nav-item-predict">
                <Link className="nav-link active" aria-current="page" to="/Predict">Predict Ground</Link>
              </li>
              <li className="nav-item-insights">
                <Link className="nav-link active" aria-current="page" to="/insights">Data Insights</Link>
              </li>
              <li className="nav-item-contact">
                <Link className="nav-link active" aria-current="page" to="/Contact">Contact</Link>
              </li>
            </ul>
            <div className="nav-item-contact">
              <Link className="btn btn-primary" to="/CustomSignUp">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;