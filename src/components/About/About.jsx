// src/components/About.js

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiMail,
  FiLinkedin,
  FiGithub,
  FiCheck,
  FiTarget,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { CiUser } from "react-icons/ci";

gsap.registerPlugin(ScrollTrigger);

// Custom component to handle floating orbs
const FloatingOrb = ({ size, top, left, delay, color }) => {
  const orbRef = useRef(null);
  useEffect(() => {
    gsap.to(orbRef.current, {
      x: "+=25",
      y: "-=25",
      rotation: 360,
      repeat: -1,
      yoyo: true,
      duration: 6,
      delay: delay,
      ease: "power1.inOut",
    });
  }, [delay]);

  return (
    <div
      ref={orbRef}
      className={`absolute rounded-full opacity-15 ${color}`}
      style={{ width: size, height: size, top: top, left: left }}
    />
  );
};

// Custom component for a scroll-triggered list item
const AnimatedListItem = ({ children, icon: Icon, delay = 0, className = "" }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;

    const ctx = gsap.context(() => {
      gsap.set(item, {
        opacity: 0,
        y: 50,
      });

      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, item);

    const hoverTl = gsap.timeline({ paused: true });
    hoverTl.to(item, {
      scale: 1.02,
      boxShadow: "0 15px 40px rgba(79, 70, 229, 0.15)",
      y: -5,
      duration: 0.3,
      ease: "power2.out",
    });

    item.addEventListener("mouseenter", () => hoverTl.play());
    item.addEventListener("mouseleave", () => hoverTl.reverse());

    return () => {
      item.removeEventListener("mouseenter", () => hoverTl.play());
      item.removeEventListener("mouseleave", () => hoverTl.reverse());
      ctx.revert();
    };
  }, [delay]);

  return (
    <div
      ref={itemRef}
      className={`relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:border-blue-200/50 transition-all duration-300 cursor-pointer group ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-gray-700 leading-relaxed font-medium">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};

// Custom component for a team member card
const TeamMemberCard = ({ name, role, photo, linkedin, github, mail }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white/30 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center hover:scale-105 transition-transform duration-500"
      style={{ boxShadow: '6px 6px 0px 0px #000' }}
    >
      <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-gray-900 text-white">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <CiUser size={48} />
        )}
      </div>
      <h3 className="font-semibold text-xl mb-1">{name}</h3>
      <p className="text-gray-500 text-sm mb-4 text-center">{role}</p>
      <div className="flex gap-4">
        <a href={mail} target="_blank" rel="noopener noreferrer">
          <FiMail className="text-gray-700 hover:text-gray-900 cursor-pointer text-lg transition-colors" />
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer">
          <FiLinkedin className="text-gray-700 hover:text-gray-900 cursor-pointer text-lg transition-colors" />
        </a>
        <a href="https://github.com/arshopsy" target="_blank" rel="noopener noreferrer">
          <FiGithub className="text-gray-700 hover:text-gray-900 cursor-pointer text-lg transition-colors" />
        </a>
      </div>
    </div>
  );
};

// Custom component for an animated skill bar
const SkillBar = ({ title, percentage, color }) => {
  const barRef = useRef(null);
  const textRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, {
        width: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(textRef.current, {
        textContent: 0,
        duration: 1.5,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        onUpdate: function() {
          if (textRef.current) {
            textRef.current.textContent = Math.round(this.progress() * percentage) + "%";
          }
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [percentage]);

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span
          ref={textRef}
          className="text-sm font-semibold text-gray-700"
        >
          0%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          ref={barRef}
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const About = () => {
  const sectionRefs = useRef([]);
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const currentStatus = [
    "Integrated E-commerce products with 3D models for 360° viewing.",
    "Developed photorealistic 3D models for immersive shopping experiences.",
    "Implemented a 360° viewer for detailed inspection of items like chairs and cars.",
    "Enabled augmented reality for users to explore products in their own space.",
    "Optimized models and scenes for fast loading and smooth performance on the web.",
  ];

  const futureGoals = [
    "Build a full-scale e-commerce platform providing a seamless immersive shopping experience.",
    "Incorporate machine learning and AI to make products interactive in a real environment.",
    "Expand our product catalog to include a wide range of industries, from furniture to fashion.",
    "Develop a backend system for personalized AR shopping recommendations.",
    "Add social features, allowing users to share AR product placements with friends.",
  ];

  const team = [
    {
      name: "Satyam Kumar",
      role: "3D Modelling & Optimization",
      linkedin: "https://www.linkedin.com/in/satyam-kumar-singh-03099b251",
      github: "https://github.com/satyam-12345",
      mail: "mailto:satyam_k@example.com",
    },
    {
      name: "Shashwat Singh",
      role: "UI/UX Designer",
      linkedin: "https://www.linkedin.com/in/shashwatt",
      github: "https://github.com/shashwatt",
      mail: "mailto:shashwatt@example.com",
    },
    {
      name: "Shivang Verma",
      role: "Frontend Developer",
      linkedin: "https://www.linkedin.com/in/shivanang",
      github: "https://github.com/shivanang",
      mail: "mailto:shivanang@example.com",
    },
    {
      name: "Jatin",
      role: "Backend Developer",
      linkedin: "https://www.linkedin.com/in/jatin",
      github: "https://github.com/jatin",
      mail: "mailto:jatin@example.com",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Section Animation
      gsap.from(".hero-text", {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power4.out",
        stagger: 0.2,
        delay: 0.5,
      });

      // Animate all sections as they scroll into view
      sectionRefs.current.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen font-inter bg-gradient-to-br from-white via-slate-50 to-blue-50/50 overflow-hidden p-8">
      {/* Floating Orbs */}
      <FloatingOrb size="6rem" top="10%" left="15%" delay={0} color="bg-purple-400" />
      <FloatingOrb size="8rem" top="60%" left="70%" delay={1} color="bg-blue-400" />
      <FloatingOrb size="4rem" top="40%" left="40%" delay={2} color="bg-green-400" />
      <FloatingOrb size="5rem" top="85%" left="20%" delay={1.5} color="bg-pink-400" />
      <FloatingOrb size="7rem" top="20%" left="80%" delay={2.5} color="bg-indigo-400" />

      {/* Hero Section */}
      <div className="text-center mb-24 pt-16">
        <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-500 to-purple-600 mb-4">
          AR Shopsy
        </h1>
        <p className="hero-text text-gray-600 text-xl md:text-2xl max-w-2xl mx-auto">
          Building the next generation of e-commerce through immersive augmented reality experiences.
        </p>
      </div>

      {/* Problem & Solution */}
      <div ref={addToRefs} className="max-w-6xl mx-auto mb-20 space-y-12 text-gray-700">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]" style={{ boxShadow: '6px 6px 0px 0px #000' }}>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Problem</h2>
            <p className="leading-relaxed">
              Traditional e-commerce platforms fail to deliver immersive product experiences, leaving customers uncertain about the look, fit, and functionality of items. This lack of visualization leads to higher return rates as products may not meet expectations. Customer engagement also suffers due to the limited ability to interact with products online.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]" style={{ boxShadow: '6px 6px 0px 0px #000' }}>
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Solution</h2>
            <p className="leading-relaxed">
              With AR-Shopsy, customers can visualize products in their own spaces and view all the virtual features more clearly. This empowers them to make informed decisions, reduces return rates, and enhances engagement, resulting in a more satisfying and immersive shopping journey.
            </p>
          </div>
        </div>
      </div>

      {/* Our Vision */}
      <div ref={addToRefs} className="max-w-6xl mx-auto mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">Our Vision</h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          We envision a world where the line between online and in-person shopping is blurred. Our goal is to create a frictionless, magical experience that brings products to life, making every purchase a confident and delightful discovery.
        </p>
      </div>

      {/* Current Status */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">What We've Built</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentStatus.map((item, idx) => (
            <AnimatedListItem key={idx} icon={FiCheck} delay={idx * 0.1}>
              {item}
            </AnimatedListItem>
          ))}
        </div>
      </div>

      {/* Future Goals */}
      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">Our Roadmap</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureGoals.map((goal, idx) => (
            <AnimatedListItem
              key={idx}
              icon={FiTarget}
              delay={idx * 0.15}
              className="bg-gradient-to-r from-blue-50/70 to-purple-50/70"
            >
              {goal}
            </AnimatedListItem>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div ref={addToRefs} className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">
          Meet the Team
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <TeamMemberCard key={idx} {...member} />
          ))}
        </div>
      </div>

      {/* Core Technology & Skills Section */}
      <div ref={addToRefs} className="max-w-4xl mx-auto mb-20">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Core Technologies
        </h2>
        <div className="grid md:grid-cols-2 gap-8 bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Frontend & Rendering</h3>
            <div className="space-y-4">
              <SkillBar title="React.js" percentage={95} color="bg-blue-500" />
              <SkillBar title="Three.js & React Three Fiber" percentage={90} color="bg-green-500" />
              <SkillBar title="WebXR" percentage={80} color="bg-indigo-500" />
              <SkillBar title="GSAP & ScrollTrigger" percentage={85} color="bg-purple-500" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Backend & Tools</h3>
            <div className="space-y-4">
              <SkillBar title="Node.js & Express" percentage={80} color="bg-red-500" />
              <SkillBar title="MongoDB" percentage={75} color="bg-teal-500" />
              <SkillBar title="Blender & glTF" percentage={90} color="bg-orange-500" />
              <SkillBar title="Cloud Services" percentage={70} color="bg-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={addToRefs} className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="text-4xl font-bold mb-8 text-gray-800">
          What Our Clients Say
        </h2>
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20" style={{ boxShadow: '6px 6px 0px 0px #000' }}>
          <FiStar className="text-yellow-400 text-4xl mx-auto mb-4" />
          <p className="text-xl md:text-2xl italic text-gray-700 leading-relaxed mb-4">
            "AR Shopsy's solution has transformed how we present our products. The AR feature has significantly increased customer confidence and reduced returns. It's truly a game-changer!"
          </p>
          <p className="text-gray-500 font-semibold">- Ujjwal Tomar</p>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={addToRefs}
        className="mt-24 text-center bg-gray-900 rounded-3xl p-16 text-white shadow-xl"
      >
        <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
        <p className="text-lg mb-8">
          We're always looking for new challenges. Reach out to collaborate!
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="mailto:contact@arshopsy.com" className="px-8 py-4 rounded-full font-bold bg-white text-gray-900 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
            <FiMail /> Contact Us
          </a>
          <a href="https://www.linkedin.com/company/arshopsy" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full font-bold bg-white text-gray-900 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
            <FiLinkedin /> LinkedIn
          </a>
          <a href="https://github.com/arshopsy" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full font-bold bg-white text-gray-900 hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
            <FiGithub /> GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;