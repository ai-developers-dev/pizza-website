'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 192;
const TOTAL_FRAMES = FRAME_COUNT + (FRAME_COUNT - 1); // 192 + 191 = 383 frames for the round trip

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

  // Map scroll progress (0-1) to frame index (1-383)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, TOTAL_FRAMES]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preload = () => {
      const uniqueImages: HTMLImageElement[] = [];
      let uniqueLoadedCount = 0;

      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `/images/pizza-images-no-background/frame_${i}.png`;

        const handleLoad = () => {
          // Store the image directly without any processing
          uniqueImages[i] = img;

          uniqueLoadedCount++;
          if (uniqueLoadedCount === FRAME_COUNT) {
            const fullSequence: HTMLImageElement[] = [];
            for (let j = 1; j <= FRAME_COUNT; j++) {
              fullSequence[j] = uniqueImages[j];
            }
            for (let j = 1; j < FRAME_COUNT; j++) {
              fullSequence[FRAME_COUNT + j] = uniqueImages[FRAME_COUNT - j];
            }
            setImages(fullSequence);
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
        // Fill white background before drawing (to ensure pure white experience)
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Responsive scaling: Contain everything within viewport with margins
        const isMobile = canvas.width < 768;
        const widthRatio = canvas.width / img.naturalWidth;
        const heightRatio = canvas.height / img.naturalHeight;

        // Use Math.min to ensure the pizza is always fully visible
        // marginFactor adds the requested small margins on the sides
        const marginFactor = isMobile ? 0.92 : 0.88;
        const scale = Math.min(widthRatio, heightRatio) * marginFactor;

        const destWidth = img.naturalWidth * scale;
        const destHeight = img.naturalHeight * scale;
        const destX = (canvas.width / 2) - (destWidth / 2);
        const destY = (canvas.height / 2) - (destHeight / 2) + (isMobile ? 20 : 40);

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
        // Set canvas to full viewport size with integer values to prevent sub-pixel artifacts
        canvasRef.current.width = Math.ceil(window.innerWidth);
        canvasRef.current.height = Math.ceil(window.innerHeight);
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
            <div className="relative w-24 h-24 mb-6">
              <img
                src="/images/pizza-slice.png"
                alt="Loading..."
                className="w-full h-full object-contain animate-spin-slow"
              />
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
              opacity: useTransform(scrollYProgress, [0, 0.15, 0.3], [1, 1, 0]),
              scale: useTransform(scrollYProgress, [0, 0.3], [1, 0.8]),
              y: useTransform(scrollYProgress, [0, 0.3], [0, -50])
            }}
            className="text-center z-10"
          >
            <h1 className="text-[clamp(4rem,15vw,12rem)] leading-[0.85] font-black text-primary tracking-tighter uppercase drop-shadow-sm">
              Freshly<br /><span className="text-dark">Baked</span>
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
