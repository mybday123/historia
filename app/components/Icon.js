import React from "react";

function Icon({
  name,
  color = "inherit",
  size = 24,
  weight = "400",
  grade = "0",
  fill = "0",
  className = "",
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: size,
        color: color,
        fontVariationSettings: `"FILL" ${fill}, "wght" ${weight}, "GRAD" ${grade}, "opsz" ${size}`,
      }}
    >
      {name}
    </span>
  );
}

export default Icon;
