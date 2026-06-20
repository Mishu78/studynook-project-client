"use client";

import Link from "next/link";
// Standard utility icons
import { BookOpen, Mail, Phone } from "lucide-react";
// Gravity UI icons (100% stable basic brand exports across all versions)
import { LogoFacebook, LogoLinkedin, LogoGithub } from "@gravity-ui/icons";


export default function Footer() {
  return (
    <footer className="bg-[#FAF8F5] text-stone-800 border-t border-stone-200/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200/60">
          
          {/* Brand Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-blue-600 rounded-xl transition-transform group-hover:rotate-6">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-stone-900">
                StudyNook
              </span>
            </Link>
            <p className="text-sm text-stone-600 font-medium max-w-sm leading-relaxed">
             Any room in which a child sits with a book is a nursery of all the pleasures and powers of the world.
            </p>
          </div>

          {/* Useful Links Column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">Useful Links</h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium text-stone-600">
              <li>
                <Link href="/" className="hover:text-emerald-800 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-emerald-800 transition-colors">Rooms</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-800 transition-colors">About</Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm font-medium text-stone-600">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <a href="mailto:hello@studynook.app" className="hover:text-emerald-800 transition-colors">
                  hello@studynook.app
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <a href="tel:+14155550142" className="hover:text-emerald-800 transition-colors">
                  +1 (415) 555-0142
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-900">Follow</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all flex items-center justify-center"
                aria-label="Facebook"
              >
                <LogoFacebook width={16} height={16} />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all flex items-center justify-center"
                aria-label="X (formerly Twitter)"
              >
                {/* Inline SVG of the modern X logo - completely independent of icon library versions */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <LogoLinkedin width={16} height={16} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="p-2 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-emerald-800 hover:border-emerald-800 hover:bg-emerald-50/30 transition-all flex items-center justify-center"
                aria-label="GitHub"
              >
                <LogoGithub width={16} height={16} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Utility Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-stone-500">
          <p>© 2026 StudyNook. All rights reserved.</p>
          <p className="italic text-stone-400">Crafted for focused minds.</p>
        </div>

      </div>
    </footer>
  );
}