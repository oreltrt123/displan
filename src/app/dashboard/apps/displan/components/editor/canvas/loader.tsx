import React from "react";
import "@/styles/loader.css"; // Optional: include CSS if needed

export const Loader: React.FC = () => {
  return (
   <div>
<div className="spinner">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
   </div>
  );
};

export default Loader;
