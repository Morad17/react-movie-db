import React from "react";
import { PuffLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <p className="loading-text">Loading...</p>
      <PuffLoader color="#12504a" />
    </div>
  );
};

export default LoadingSpinner;
