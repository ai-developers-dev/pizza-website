'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MENU_ITEMS = [
    {
        id: 1,
        name: 'Classic Margherita',
        description: 'San Marzano tomatoes, fresh buffalo mozzarella, basil, EVOO.',
        price: '$22',
        image: '/images/menu/margherita.png',
        tag: 'Classic'
    },
    {
        id: 2,
        name: 'Spicy Hot Honey',
        description: 'Crispy pepperoni, spicy honey drizzle, fresh chillies, mozzarella.',
        price: '$26',
        image: '/images/menu/pepperoni.png',
        tag: 'Spicy'
    },
    {
        id: 3,
        name: 'Black Truffle',
        description: 'Wild mushrooms, black truffle shavings, rosemary, white base.',
        price: '$32',
        image: '/images/menu/truffle.png',
        tag: 'Premium'
    },
    {
        id: 4,
        name: 'Creamy Burrata',
        description: 'Whole burrata, pesto swirls, toasted pine nuts, fresh basil.',
        price: '$28',
        image: '/images/menu/burrata.png',
        tag: 'Signature'
    }
];

const MenuHighlights: React.FC = () => {
    return (
        <section className="py-24 px-4 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-dark tracking-tighter uppercase mb-4">
                            Signature<br /><span className="text-primary">Selections</span>
                        </h2>
                        <p className="text-xl text-dark/40 max-w-lg font-medium">
                            Handcrafted with 48-hour fermented dough and the finest artisan ingredients.
                        </p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 md:mt-0 px-8 py-4 border-2 border-dark text-dark font-bold rounded-full hover:bg-dark hover:text-white transition-colors uppercase tracking-widest text-sm"
                    >
                        View Full Menu
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MENU_ITEMS.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative bg-white border border-dark/5 rounded-3xl p-4 transition-shadow hover:shadow-2xl"
                        >
                            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-4 ring-white">
                                    {item.tag}
                                </div>
                            </div>

                            <div className="px-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-dark group-hover:text-primary transition-colors leading-tight">
                                        {item.name}
                                    </h3>
                                    <span className="text-xl font-black text-dark">{item.price}</span>
                                </div>
                                <p className="text-dark/40 text-sm font-medium leading-relaxed mb-6">
                                    {item.description}
                                </p>
                                <button className="w-full py-3 bg-dark/5 text-dark font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all transform active:scale-95 uppercase tracking-tighter text-sm">
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MenuHighlights;
