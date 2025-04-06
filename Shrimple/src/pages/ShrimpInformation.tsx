const ShrimpInformation = () => {
  return (
    <div id="carouselExampleCaptions" className="carousel slide">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="Black Tiger Shrimp.jpg" className="d-block w-100" alt="Black Tiger Shrimp" />
          <div className="carousel-caption d-none d-md-block">
            <h5>
              <a
                href="https://en.wikipedia.org/wiki/Penaeus_monodon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none">
                Black Tiger Shrimp
              </a></h5>
            <p>Also known as Penaeus Monodon, a shrimp variety that is widely farmed for food.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="Vannamei Shrimp.jpg" className="d-block w-100" alt="Vannamei Shrimp" />
          <div className="carousel-caption d-none d-md-block">
            <h5>
              <a
                href="https://en.wikipedia.org/wiki/Whiteleg_shrimp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none">
                Vannamei Shrimp
              </a></h5>
            <p>Also known as the Whiteleg shrimp. A variety of shrimp which makes up a bulk of Sri Lankan shrimp production</p>
          </div>
        </div>
        <div className="carousel-item">
          <img src="Atyopsis cute shrimp.JPG" className="d-block w-100" alt="Atyopsis" />
          <div className="carousel-caption d-none d-md-block">
            <h5>
              <a
                href="https://en.wikipedia.org/wiki/Atyopsis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none">
                Atyopsis Shrimp
              </a></h5>
            <p>Also known as Atyopsis! Now this a unique one since they're not eaten for human nutrition nor pleasure (usually), instead they're kept in aquariums!</p>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div >
  )
};

export default ShrimpInformation;
