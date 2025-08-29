// Home.jsx - Tailwind version
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Shery from "sheryjs";
import gsap from "gsap";

function Home() {
  const textRefs = useRef([]);
  const buttonRef = useRef();
  const bgRef = useRef();

  useEffect(() => {
    // Shery.js effects
    Shery.mouseFollower();
    Shery.makeMagnet(".magnet-target", {
      ease: "cubic-bezier(0.23, 1, 0.32, 1)",
      duration: 0.8,
      scale: 1.05,
    });
    Shery.textAnimate(".text-item");

    // Animate text items
    gsap.from(textRefs.current, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.9,
      ease: "power3.out",
    });

    // Animate CTA button
    gsap.from(buttonRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.95,
      duration: 0.9,
      delay: 0.7,
      ease: "back.out(1.2)",
    });

    // Animate floating shapes
    const shapes = bgRef.current.querySelectorAll(".floating-shape");
    shapes.forEach((shape) => {
      gsap.to(shape, {
        x: gsap.utils.random(-30, 30),
        y: gsap.utils.random(-30, 30),
        rotation: gsap.utils.random(-45, 45),
        duration: gsap.utils.random(5, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        opacity: gsap.utils.random(0.1, 0.2),
      });
    });
  }, []);

  const floatingShapes = [...Array(5)].map(() => ({
    top: `${gsap.utils.random(0, 90)}%`,
    left: `${gsap.utils.random(0, 90)}%`,
    size: gsap.utils.random(40, 80),
    color: `rgba(59, 130, 246, ${gsap.utils.random(0.1, 0.2)})`,
  }));

  return (
    <div
      className="relative w-full h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gray-50 font-sans pt-4"
      ref={bgRef}
    >
      {/* Floating shapes */}
      {floatingShapes.map((shape, i) => (
        <div
          key={i}
          className="floating-shape absolute rounded-full pointer-events-none"
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            top: shape.top,
            left: shape.left,
            background: shape.color,
          }}
        />
      ))}

      {/* Text items */}
      <div className="relative z-20 mt-8 px-8 md:px-20 flex flex-col items-center">
        {["Experience", "AR Shopping"].map((item, index) => (
          <div key={index} className="overflow-hidden mb-2 w-full flex justify-center">
            <h1
              ref={(el) => (textRefs.current[index] = el)}
              className="text-item magnet-target text-white font-bold uppercase text-[9vw] md:text-[7vw] lg:text-[7.5vw] tracking-tighter text-center leading-none"
              style={{
                textShadow: "1px 1px 0 #000, 2px 2px 0 #000, 3px 3px 0 #000",
                WebkitTextStroke: "1px #000",
              }}
            >
              {item}
            </h1>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div ref={buttonRef} className="mt-8">
        <button
          className="cta-button magnet-target px-12 py-5 rounded-full flex items-center gap-2 transform transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white"
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            color: "black",
            fontWeight: "bold",
            fontSize: "1.125rem", // equivalent to text-lg
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // 3D box shadow
          }}
        >
          <Link to="/product" className="flex items-center gap-2">
            Shop Now <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </button>
      </div>
    </div>
  );
}

export default Home;