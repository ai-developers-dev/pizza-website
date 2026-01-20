'use client';

import ParallaxHero from "@/components/ParallaxHero";
import MenuHighlights from "@/components/MenuHighlights";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <ParallaxHero />

      {/* About Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-dark tracking-tighter">
              BORN IN ITALY,<br />MADE IN THE CITY.
            </h2>
            <p className="text-xl text-dark/60 leading-relaxed mb-10">
              We use 48-hour fermented dough, San Marzano tomatoes, and the finest Fior di Latte mozzarella. Each pizza is a masterpiece of tradition and innovation, baked at 900°F in our custom wood-fired oven.
            </p>
            <div className="flex gap-4">
              <div className="border-l-4 border-primary pl-6">
                <span className="block text-3xl font-bold">100%</span>
                <span className="text-dark/40 uppercase tracking-widest text-sm">Wood Fired</span>
              </div>
              <div className="border-l-4 border-primary pl-6">
                <span className="block text-3xl font-bold">48H</span>
                <span className="text-dark/40 uppercase tracking-widest text-sm">Fermentation</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image
              src="/images/about/process.png"
              alt="Artisan pizza being pulled from wood-fired oven"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <MenuHighlights />
    </main>
  );
}

