import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  HardHat,
  Users,
  Award,
} from "lucide-react";

const HeroSection = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Simple parallax effect
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "20%"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    [1, 0]
  );

  // Update screen dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Floating service icons
  const serviceIcons = [
    {
      Icon: HardHat,
      delay: 0.5,
      position: {
        top: "30%",
        right: "15%",
      },
    },
    {
      Icon: Users,
      delay: 1,
      position: {
        top: "50%",
        right: "8%",
      },
    },
    {
      Icon: Award,
      delay: 1.5,
      position: {
        top: "70%",
        right: "12%",
      },
    },
  ];

  // Responsive title size
  const getTitleClasses = () => {
    if (dimensions.width < 360) return "text-3xl mt-1";
    if (dimensions.width < 400) return "text-4xl mt-1.5";
    if (dimensions.width < 480) return "text-5xl mt-2";
    if (dimensions.width < 640) return "text-6xl mt-2.5";
    if (dimensions.width < 768) return "text-6xl mt-3";
    if (dimensions.width < 1024) return "text-7xl mt-3.5";
    if (dimensions.width < 1280) return "text-7xl mt-4";

    return "text-8xl mt-4";
  };

  // Container padding
  const getContainerPadding = () => {
    if (dimensions.width < 360) return "px-3";
    if (dimensions.width < 400) return "px-4";
    if (dimensions.width < 480) return "px-5";
    if (dimensions.width < 640) return "px-6";
    if (dimensions.width < 768) return "px-7";
    if (dimensions.width < 1024) return "px-8";

    return "px-8 lg:px-12";
  };

  // Description size
  const getDescriptionClasses = () => {
    if (dimensions.width < 360) return "text-xs";
    if (dimensions.width < 480) return "text-sm";
    if (dimensions.width < 640) return "text-base";
    if (dimensions.width < 768) return "text-lg";

    return "text-xl";
  };

  // Button size
  const getButtonClasses = () => {
    if (dimensions.width < 360) {
      return "px-5 py-2.5 text-xs";
    }

    if (dimensions.width < 480) {
      return "px-6 py-3 text-sm";
    }

    if (dimensions.width < 640) {
      return "px-7 py-3.5 text-base";
    }

    if (dimensions.width < 768) {
      return "px-8 py-4 text-base";
    }

    return "px-8 md:px-10 py-3 md:py-4 text-base md:text-lg";
  };

  // Particle count
  const particleCount =
    dimensions.width < 360
      ? 5
      : dimensions.width < 480
      ? 8
      : dimensions.width < 640
      ? 12
      : dimensions.width < 768
      ? 15
      : dimensions.width < 1024
      ? 20
      : 30;

  // Icon size
  const getIconSize = () => {
    if (dimensions.width < 1280) return "w-12 h-12";
    if (dimensions.width < 1536) return "w-14 h-14";

    return "w-16 h-16";
  };

  // Inner icon size
  const getIconInnerSize = () => {
    if (dimensions.width < 1280) return "w-6 h-6";
    if (dimensions.width < 1536) return "w-7 h-7";

    return "w-8 h-8";
  };

  // Main spacing
  const getMainSpacing = () => {
    if (dimensions.width < 360) return "mt-4";
    if (dimensions.width < 480) return "mt-5";
    if (dimensions.width < 640) return "mt-6";
    if (dimensions.width < 768) return "mt-7";

    return "mt-8 md:mt-10";
  };

  // Description spacing
  const getDescriptionSpacing = () => {
    if (dimensions.width < 360) return "mt-4";
    if (dimensions.width < 480) return "mt-5";
    if (dimensions.width < 640) return "mt-6";

    return "mt-6 md:mt-8";
  };

  // Description padding
  const getDescriptionPadding = () => {
    if (dimensions.width < 360) return "pl-4";
    if (dimensions.width < 480) return "pl-8";
    if (dimensions.width < 640) return "pl-12";
    if (dimensions.width < 768) return "pl-16";
    if (dimensions.width < 1024) return "pl-20";

    return "pl-20";
  };

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] min-h-[600px] overflow-hidden bg-[#502d13]"
    >
      {/* Background Image */}

      {/*
        IMPORTANT:
        Put hero-construction.jpg inside:
        
        public/hero-construction.jpg
        
        Then use:
        /hero-construction.jpg
      */}

      <motion.div
        style={{ y }}
        className="absolute inset-0 transform-gpu"
      >
        <img
          src="/hero-construction.jpg"
          alt="Construction site"
          className="h-full w-full object-cover"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#502d13] via-[#502d13]/20 to-[#502d13]/40" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#502d13] via-transparent to-transparent" />
      </motion.div>

      {/* Animated particles */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-[#e9ddc8]/20"
            initial={{
              x: Math.random() * (dimensions.width || 1000),
              y: Math.random() * (dimensions.height || 1000),
            }}
            animate={{
              y: [null, -100],
              x: Math.random() * 20 - 10,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating service icons */}

      <div
        className={`pointer-events-none absolute inset-0 ${
          dimensions.width >= 1024 ? "block" : "hidden"
        }`}
      >
        {serviceIcons.map(
          ({ Icon, delay, position }, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={position}
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 1 + delay,
                duration: 0.5,
              }}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay,
                }}
              >
                <div
                  className={`${getIconSize()} flex items-center justify-center rounded-2xl border border-[#e9ddc8]/20 bg-[#e9ddc8]/10 backdrop-blur-sm`}
                >
                  <Icon
                    className={`${getIconInnerSize()} text-[#e9ddc8]`}
                  />
                </div>
              </motion.div>
            </motion.div>
          )
        )}
      </div>

      {/* Main content */}

      <div
        className={`container relative z-10 mx-auto flex h-full items-center ${getContainerPadding()}`}
      >
        <div className="mx-auto w-full max-w-5xl">
          {/* Main Heading */}

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className={`text-center ${
              dimensions.width >= 1024
                ? "lg:text-left"
                : ""
            }`}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.5,
              }}
              className={`${getTitleClasses()} font-display font-bold leading-tight text-[#e9ddc8]`}
            >
              The Construction
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.7,
              }}
              className="relative inline-block"
            >
              <span
                className={`${getTitleClasses()} bg-gradient-to-r from-[#e9ddc8] to-[#d4c4a8] bg-clip-text font-display font-bold text-transparent`}
              >
                Marketplace
              </span>
            </motion.div>
          </motion.h1>

          {/* Description */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 1.2,
            }}
            className={`relative ${getDescriptionSpacing()}`}
          >
            <motion.p
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`max-w-2xl mx-auto leading-relaxed text-[#e9ddc8]/80 ${getDescriptionClasses()} text-center ${
                dimensions.width >= 1024
                  ? "lg:mx-0 lg:text-left"
                  : ""
              } ${getDescriptionPadding()}`}
            >
              Rental • Contractors • Materials
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 1.4,
            }}
            className={`flex ${
              dimensions.width >= 480
                ? "flex-row"
                : "flex-col"
            } ${
              dimensions.width < 360
                ? "gap-2"
                : dimensions.width < 480
                ? "gap-3"
                : "gap-4"
            } justify-center ${
              dimensions.width >= 1024
                ? "lg:justify-start"
                : ""
            } ${getMainSpacing()}`}
          >
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`group ${getButtonClasses()} flex items-center justify-center gap-2 rounded-xl bg-[#e9ddc8] font-display font-semibold text-[#502d13] transition-all duration-300 hover:shadow-2xl hover:shadow-[#e9ddc8]/30`}
            >
              Explore Services

              <ArrowRight
                className={`${
                  dimensions.width < 360
                    ? "h-3 w-3"
                    : dimensions.width < 480
                    ? "h-3.5 w-3.5"
                    : "h-4 w-4 md:h-5 md:w-5"
                } transition-transform group-hover:translate-x-1`}
              />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}

      <motion.div
        style={{ opacity }}
        className={`absolute left-1/2 -translate-x-1/2 ${
          dimensions.width < 360
            ? "bottom-2"
            : dimensions.width < 480
            ? "bottom-3"
            : dimensions.width < 640
            ? "bottom-4"
            : dimensions.width < 768
            ? "bottom-4"
            : "bottom-4 md:bottom-8"
        }`}
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="group flex cursor-pointer flex-col items-center gap-1 md:gap-2"
          onClick={() => {
            document
              .getElementById("services")
              ?.scrollIntoView({
                behavior: "smooth",
              });
          }}
        >
          <span
            className={`${
              dimensions.width < 360
                ? "text-[8px]"
                : dimensions.width < 480
                ? "text-[9px]"
                : "text-[10px] md:text-xs"
            } uppercase tracking-widest text-[#e9ddc8]/40 transition-colors group-hover:text-[#e9ddc8]`}
          >
            Scroll
          </span>

          <ChevronDown
            className={`${
              dimensions.width < 360
                ? "h-3 w-3"
                : dimensions.width < 480
                ? "h-3.5 w-3.5"
                : "h-4 w-4 md:h-5 md:w-5"
            } text-[#e9ddc8]/60 transition-colors group-hover:text-[#e9ddc8]`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;