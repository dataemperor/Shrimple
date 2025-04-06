import ShrimpInformation from "./ShrimpInformation";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Shrimple</h1>
      <p className="lead">
        Shrimping made Simple
      </p>
      <div className="row mt-5 d-flex justify-content-center">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Water Quality Prediction</h5>
            <p>Predictions on whether shrimp can grow in your chosen location</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Historical Shrimp Catch Data</h5>
            <p>Utilization of past catch records to predict the future catch</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Shrimp Information</h5>
            <p>Learn about the most common types of Shrimp in Sri Lanka</p>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};

export default Home;
