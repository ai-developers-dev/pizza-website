'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { Pizza } from 'lucide-react';

const FRAME_COUNT = 192;

const ParallaxHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Create a progress value that only increases (locks the animation on scroll up)
  const constrainedProgress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (val: number) => {
    if (val > constrainedProgress.get()) {
      constrainedProgress.set(val);
    }
  });

  // Map constrainedProgress (one-way) to frame index
  const frameIndex = useTransform(constrainedProgress, [0, 0.45, 0.85, 1], [1, 125, 1, 1]);

  // Quick fade out at the START of scroll to clear the way for the pizza
  // Force full opacity if collapsed (reset state)
  const h1Opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const h1Scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.8]);
  const h1Y = useTransform(scrollYProgress, [0, 0.15], [0, -100]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preload = () => {
      const uniqueImages: HTMLImageElement[] = [];
      let uniqueLoadedCount = 0;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `/images/pepperoni-pizza-no-background/frame_${i}.png`;

        const handleLoad = () => {
          // Store the image directly without any processing
          uniqueImages[i] = img;

          uniqueLoadedCount++;
          if (uniqueLoadedCount === FRAME_COUNT) {
            setImages(uniqueImages);
            setIsLoaded(true);
          }
        };

        const handleError = () => {
          console.error(`Failed to load frame ${i}`);
          handleLoad();
        };

        img.onload = handleLoad;
        img.onerror = handleError;
      }
    };

    preload();
  }, []);

  // Draw function
  const drawImage = (index: number) => {
    const img = images[index];
    if (canvasRef.current && img && img.complete && img.naturalWidth > 0) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        const dpr = window.devicePixelRatio || 1;

        // Clear canvas with white background (using CSS pixels for clearRect because of context.scale)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        // Quality settings
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        // Responsive scaling: Contain everything within viewport with margins
        const isMobile = (canvas.width / dpr) < 768;

        // --- ADAPTIVE SAFE ZONE CALCULATION ---
        // 1. Define guaranteed clearance for header vs bottom
        const headerGap = isMobile ? 20 : 40; // Reduced clearance
        const bottomPadding = 10; // Minimal space at bottom

        // 2. Calculate available vertical space
        const canvasHeight = canvas.height / dpr;
        const canvasWidth = canvas.width / dpr;
        const availableHeight = canvasHeight - headerGap - bottomPadding;
        const availableWidth = canvasWidth * 1.0; // Minimal horizontal safety margin

        // 3. Calculate Adaptive Scale
        // Use a "Balanced Maximum" strategy:
        // Large but contained within viewport width
        const maxSafeWidth = canvasWidth * 1.0; // Full width - allow edge-to-edge
        const widthFitScale = maxSafeWidth / img.naturalWidth;
        const heightFitScale = availableHeight / img.naturalHeight;

        // Dynamic boost based on viewport width - MAXIMUM IMPACT
        let boostFactor = 2.5; // Maximum impact for desktop
        if (canvasWidth < 768) {
          boostFactor = 2.0; // Large size for mobile
        } else if (canvasWidth < 1024) {
          boostFactor = 2.2; // Strong impact for tablet
        }

        // Use height-based scale with boost, but cap by width to prevent overflow
        let scale = Math.min(heightFitScale * boostFactor, widthFitScale);

        const destWidth = img.naturalWidth * scale;
        const destHeight = img.naturalHeight * scale;

        // Center horizontally
        const destX = (canvasWidth / 2) - (destWidth / 2);

        // --- RESPONSIVE POSITIONING ---
        // Position the pizza to overlap with the H1 text in the center
        // Responsive uplift - less on mobile to keep pizza vertically centered
        let upliftOffset = availableHeight * 0.35; // Desktop default
        if (canvasWidth < 768) {
          upliftOffset = availableHeight * 0.05; // Mobile - keep centered lower
        } else if (canvasWidth < 1024) {
          upliftOffset = availableHeight * 0.28; // Tablet middle ground
        }
        let destY = (headerGap + (availableHeight / 2)) - (destHeight / 2) - upliftOffset;

        // Clamp to header gap to prevent going too high
        if (destY < headerGap) {
          destY = headerGap;
        }

        // Clamp to prevent bottom from being cut off
        const maxDestY = canvasHeight - destHeight - bottomPadding;
        if (destY > maxDestY) {
          destY = maxDestY;
        }

        context.drawImage(
          img,
          destX,
          destY,
          destWidth,
          destHeight
        );
      }
    }
  };

  // Sync frame with scroll
  useMotionValueEvent(frameIndex, "change", (latest) => {
    drawImage(Math.floor(latest));
  });

  // Handle Resize and Scroll Reset
  useEffect(() => {
    // Force scroll to top on refresh/load
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Set display size (css pixels)
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;

        // Set actual size in memory (scaled by DPR)
        canvasRef.current.width = Math.floor(width * dpr);
        canvasRef.current.height = Math.floor(height * dpr);

        // Scale the context once to account for DPR
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.scale(dpr, dpr);
        }

        // Immediate draw on resize to prevent flickering
        if (images[Math.floor(frameIndex.get())]) {
          drawImage(Math.floor(frameIndex.get()));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, images]);

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full bg-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-50">
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Pizza size={64} className="text-primary" />
              </motion.div>
            </div>
            <p className="text-dark/50 font-medium tracking-wide">Preheating the oven...</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-full block bg-white"
          style={{ border: 'none', outline: 'none' }}
        />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
          <motion.div
            style={{
              opacity: h1Opacity,
              scale: h1Scale,
              y: h1Y
            }}
            className="text-center z-20"
          >
            <h1
              className="text-[clamp(4rem,15vw,12rem)] leading-[0.85] font-black text-primary tracking-tighter uppercase flex flex-col items-center"
              style={{
                textShadow: '0 2px 8px rgba(255,255,255,0.9), 0 4px 20px rgba(255,255,255,0.7)'
              }}
            >
              <motion.span
                initial={{ x: -120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Freshly
              </motion.span>
              <motion.span
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="text-dark block"
              >
                Baked
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            style={{
              opacity: useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]),
              y: useTransform(scrollYProgress, [0.6, 1], [50, 0])
            }}
            className="absolute bottom-12 md:bottom-20 text-center w-full px-6"
          >
            <h2 className="text-[clamp(1.75rem,4vw+1rem,3.5rem)] font-bold text-dark mb-6 tracking-tight uppercase">
              Perfection in<br className="md:hidden" /> Every Slice
            </h2>
            <button className="bg-primary text-white px-8 py-4 md:px-10 md:py-5 rounded-full text-lg md:text-xl font-bold hover:scale-105 transition-transform cursor-pointer pointer-events-auto shadow-xl">
              ORDER NOW
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxHero;
