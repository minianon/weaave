"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsDiscord,
  BsYoutube,
} from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { FOOTER_NAV, SOCIALS, FOOTER_IMAGES } from "./data";
import type { SocialLink } from "./types";

const SocialIcons: Record<SocialLink["icon"], React.ComponentType> = {
  linkedin: BsLinkedin,
  instagram: BsInstagram,
  twitter: BsTwitter,
  discord: BsDiscord,
  youtube: BsYoutube,
};

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = sectionRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(
          new CustomEvent("footer-visibility", {
            detail: { isVisible: entry.isIntersecting },
          })
        );
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="
    relative
    bg-transparent md:bg-[#252525]
    overflow-hidden
    font-sans
  "
    >
      {/* =========================
         EXACT WEAVY SVG NODE (TOPMOST)
         ========================= */}
      {/* <img
  src="https://cdn.prod.website-files.com/681b040781d5b5e278a69989/682231a73b5be7ff98f935ac_footer%20Node.svg"
  alt=""
  aria-hidden
  className="
    pointer-events-none
    absolute
    z-[49]
    w-[22.5rem]
    max-w-none
    right-[7rem]
    bottom-[5%]
    top-[45vh]
    h-[85vh]
    hidden md:block
  "
/> */}

      {/* ========================= */}

      <div
        className="
  relative
  bg-[#A8B1A5]
  max-w-[1290px]
  max-h-[900px]
  rounded-none md:rounded-tr-[60px]
  mt-0 md:mt-24
  mr-0 md:mr-16
  pt-6 md:pt-24
  pb-8 md:pb-12
  px-4 md:px-[5%]
"
      >
        <div className="max-w-[1440px] mx-auto relative z-10">
          <HeroStatement />

          <div className="flex items-center justify-between mb-8 md:hidden">
            <img
              src={FOOTER_IMAGES.logo}
              alt="Weavy Artistic Intelligence"
              className="h-[32px] w-auto"
            />
            <Link
              href="/workflows"
              className="bg-[#f7ff9e] text-black py-2.5 px-7 rounded-md text-[14px] transition-all hover:scale-[1.02] active:scale-95"
            >
              START NOW
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-10 md:mb-14">
            <div className="flex flex-col md:flex-row md:max-w-[80%] gap-4 md:gap-10">
              <img
                src={FOOTER_IMAGES.logo}
                alt="Weavy Artistic Intelligence"
                className="h-[40px] w-auto hidden md:block"
              />
              <p className="text-white text-[13px] leading-[1.7] font-light">
                <span className="font-normal">Weavy</span> is a new way to
                create. We&apos;re bridging the gap between AI capabilities and
                human creativity, to continue the tradition of craft in artistic
                expression. We call it Artistic Intelligence.
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 mb-10 md:mb-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {FOOTER_NAV.map((column) => (
                <div key={column.title}>
                  <span className="text-white/80 text-[11px] uppercase tracking-[0.1em] mb-4 block">
                    {column.title}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {column.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-white text-[12px] uppercase hover:opacity-60 transition"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:flex gap-6 pt-1">
              {SOCIALS.map((social) => {
                const Icon = SocialIcons[social.icon];
                return (
                  <a
                    key={social.platform}
                    href={social.href}
                    className="text-white text-lg hover:opacity-60"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={FOOTER_IMAGES.soc2Badge}
              alt="SOC2"
              className="w-[50px]"
            />
            <div>
              <p className="text-[#1A1A1A] text-[12px]">
                SOC 2 Type <strong>II</strong> Certified
              </p>
              <p className="text-[#1A1A1A]/70 text-[11px]">
                Your data is protected with industry-standard security controls.
              </p>
            </div>
          </div>

          <div className="text-[10px] uppercase tracking-[0.12em] text-[#1A1A1A]/80 flex gap-4">
            <span>WEAVY © 2025</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/workflows"
        className="
    hidden md:flex
    group
    absolute bottom-0 right-0
    bg-[#f7ff9e]
    px-8 pr-8 pt-10 pb-7 pl-18
    rounded-tl-[40px]
    z-[55]
    transition-all duration-300
    hover:bg-white
    hover:scale-[1.02]
    active:scale-95
  "
      >
        <span
          className="
      text-[40px] md:text-[80px]
      font-light
      leading-none
      text-black
      transition-colors duration-300
    "
        >
          Start Now
        </span>
      </Link>
    </footer>
  );
};

const HeroStatement = () => (
  <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 mb-12 md:mb-32">
    <h2 className="text-white text-[clamp(3rem,12vw,6.5rem)] font-light leading-[0.95] tracking-[-0.03em]">
      Artificial
      <br />
      Intelligence
    </h2>

    <GoPlus className="text-white w-[70px] h-[70px] md:w-[100px] md:h-[100px]" />

    <h2 className="text-white text-[clamp(3rem,12vw,6.5rem)] font-light leading-[0.95] tracking-[-0.03em]">
      Human
      <br />
      Creativity
    </h2>
  </div>
);

export default Footer;
