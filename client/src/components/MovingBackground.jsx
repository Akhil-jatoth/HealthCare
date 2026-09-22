import React from "react";
import "../styles/MovingBackground.css";

const MovingBackground = () => {
  return (
    <div className="moving-background-canvas" aria-hidden="true">
      {/* Floating luminous aura orbs */}
      <div className="ambient-orb orb-primary" />
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-emerald" />
      <div className="ambient-orb orb-center" />

      {/* Floating subtle grid pattern */}
      <div className="moving-grid-overlay" />

      {/* Luminous top ambient beam */}
      <div className="ambient-light-beam" />
    </div>
  );
};

export default MovingBackground;
