import React from 'react';

const Home = () => {
  return (
    <>
      <body>
        <header>
          <div className="main">
            <ul>
              <li className="active">
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="title">
            <h1>Predict Best Shrimp Farming Grounds</h1>
          </div>
          <div className="des">
            <h3>
              Shrimple helps identify the most suitable locations for shrimp
              farming using environmental data and geospatial analysis. By
              analyzing key factors like water quality, environmental factors,
              and historical farming data, our system provides accurate insights
              to optimize shrimp farm site selection.
            </h3>
          </div>
          <div className="button">
            <a href="#" className="btn">
              Get Started
            </a>
          </div>
        </header>
      </body>
    </>
  );
};

export default Home;
