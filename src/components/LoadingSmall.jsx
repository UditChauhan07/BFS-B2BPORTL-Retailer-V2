import React from "react";

const LoadingSmall = ({height}) => {
  let minHeight=height??"100px"
  // console.log(minHeight);
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: `${minHeight}`  }}
    >
      <div className="spinner-border smallLoader "   role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSmall;