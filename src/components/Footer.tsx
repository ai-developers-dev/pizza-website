'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-dark/5 pt-24 pb-12 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand & Socials */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center rotate-3">
                                <span className="text-white font-black text-lg">A</span>
                            </div>
                            <span className="text-xl font-black tracking-tighter text-dark uppercase">
                                Artisan<span className="text-dark/40">Pizza</span>
                            </span>
                        </div>
                        <p className="text-dark/60 text-sm leading-relaxed max-w-xs">
                            Crafting authentic wood-fired masterpieces with 48-hour fermented dough and the finest imported ingredients.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                <motion.a
                                    key={i}
                                    href="#"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-dark/5 flex items-center justify-center text-dark hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-dark">Explore</h4>
                        <ul className="space-y-4">
                            {['Our Menu', 'Our Story', 'Locations', 'Book a Table', 'Gift Cards'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-dark/60 hover:text-primary text-sm font-bold transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div className="space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-dark">Opening Hours</h4>
                        <ul className="space-y-4 text-sm font-bold text-dark/60">
                            <li className="flex justify-between items-center bg-dark/[0.02] p-3 rounded-xl">
                                <span>Mon — Thu</span>
                                <span className="text-dark">12PM — 10PM</span>
                            </li>
                            <li className="flex justify-between items-center bg-primary/5 p-3 rounded-xl">
                                <span>Fri — Sat</span>
                                <span className="text-primary">12PM — 11PM</span>
                            </li>
                            <li className="flex justify-between items-center bg-dark/[0.02] p-3 rounded-xl">
                                <span>Sunday</span>
                                <span className="text-dark">1PM — 9PM</span>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-8">
                        <h4 className="text-sm font-black uppercase tracking-widest text-dark">Get in Touch</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center text-primary shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black uppercase tracking-widest text-dark/40 mb-1">Location</span>
                                    <span className="text-sm font-bold text-dark">123 Artisan Way, Brooklyn, NY</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center text-primary shrink-0">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black uppercase tracking-widest text-dark/40 mb-1">Phone</span>
                                    <span className="text-sm font-bold text-dark"> (555) 123-4567</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center text-primary shrink-0">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <span className="block text-xs font-black uppercase tracking-widest text-dark/40 mb-1">Email</span>
                                    <span className="text-sm font-bold text-dark">hello@artisanpizza.co</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-dark/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-dark/40 text-xs font-bold tracking-widest uppercase">
                        © 2026 ARTISAN PIZZA CO. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((link) => (
                            <a key={link} href="#" className="text-dark/30 hover:text-dark text-[10px] font-black uppercase tracking-widest transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
