import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Predict Best Shrimp Farming Grounds</h1>
        <p className="home-description">
          Shrimple helps identify the most suitable locations for shrimp farming
          using environmental data and geospatial analysis. By analyzing key
          factors like water quality, environmental conditions, and historical
          farming data, our system provides accurate insights to optimize shrimp
          farm site selection.
        </p>
        <p className="home-aim">
          Our aim is to increase the profitability of the Shrimp Aquaculture business through industry related predictions that can be used to make better decisions.
        </p>
      </div>
    </div>
  );
};

export default Home;
