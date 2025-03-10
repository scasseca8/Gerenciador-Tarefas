import React from "react";

export default function Spinner({ size = "medium", overlay = false }) {
  const sizeClass = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large"
  }[size];

  if (overlay) {
    return (
      <div className="spinner-overlay">
        <div className={`spinner ${sizeClass}`}></div>
      </div>
    );
  }

  return <div className={`spinner ${sizeClass}`}></div>;
}