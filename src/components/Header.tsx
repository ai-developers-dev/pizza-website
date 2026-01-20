'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerHeight * 3;
            setIsScrolled(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-12 py-3 md:py-4 ${isScrolled
                ? 'bg-white/80 backdrop-blur-lg border-b border-dark/5 py-2 md:py-3'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform">
                        <span className="text-white font-black text-xl">A</span>
                    </div>
                    <span className={`text-2xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-dark' : 'text-primary'
                        }`}>
                        ARTISAN<span className={`${isScrolled ? 'text-dark/40' : 'text-dark'}`}>PIZZA</span>
                    </span>
                </div>

                {/* Navigation - Optional but added for style */}
                <nav className="hidden md:flex items-center gap-8">
                    {['Menu', 'Process', 'Reviews', 'Locations'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors ${isScrolled ? 'text-dark/60' : 'text-dark'
                                }`}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                {/* Action Button */}
                <button className="bg-primary text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-lg active:scale-95">
                    Order Now
                </button>
            </div>
        </motion.header>
    );
};

export default Header;
