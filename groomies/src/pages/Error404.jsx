import React from "react";

const Error404 = () => {
  return (
    <div>
      <img
        src={`${process.env.PUBLIC_URL}/silly-astronaut-cat-404-error-delf-design.jpg`}
        alt="Cat 404"
        style={{
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          marginBottom: "20px",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <h1>404 - Not Found</h1>
        <p>Sorry, the page you are looking for does not exist!</p>
      </div>
    </div>
  );
};

export default Error404;
