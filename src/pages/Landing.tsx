import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, TrendingUp, GraduationCap } from 'lucide-react';
import { HeroCanvas } from '../components/3d/HeroCanvas';
import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">

      <HeroCanvas />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-0" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >

          {/* Tag */}
          <div className="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 backdrop-blur-md">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Empowering Rural Entrepreneurs
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Smart Financial Decisions, <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Simplified.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
            Your intelligent partner for loan management, financial literacy, and business growth.
            Access government schemes, track EMIs, and learn to manage money better.
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">

            {/* CHANGED BUTTON */}
            <Link
              to="/login"
              className="group flex w-full items-center justify-center rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] sm:w-auto"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              to="/training"
              className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 sm:w-auto"
            >
              Explore Training
            </Link>

          </div>

        </motion.div>


        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-3"
        >

          {[
            {
              icon: TrendingUp,
              title: 'Smart Loan Management',
              desc: 'Track EMIs, compare bank offers, and manage your debt effectively.'
            },
            {
              icon: GraduationCap,
              title: 'Financial Literacy',
              desc: 'Interactive modules to learn budgeting, saving, and investing.'
            },
            {
              icon: ShieldCheck,
              title: 'Govt. Scheme Explorer',
              desc: 'Find and apply for subsidies tailored to your business profile.'
            },
          ].map((feature, i) => (

            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1"
            >

              <div className="mb-4 rounded-full bg-indigo-500/20 p-4 text-indigo-400">
                <feature.icon className="h-8 w-8" />
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {feature.title}
              </h3>

              <p className="text-sm text-slate-400">
                {feature.desc}
              </p>

            </div>

          ))}

        </motion.div>

      </div>
    </div>
  );
};