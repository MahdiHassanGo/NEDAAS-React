import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { getPublicationsPublic } from "../api/adminApi";
import brainImg from "/Images/Brain2.png";

function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function BrainChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M9 3a3 3 0 0 0-3 3v.5A3.5 3.5 0 0 0 4 10a3.5 3.5 0 0 0 1.2 6.78A3 3 0 0 0 8 21h1" />
      <path d="M15 3a3 3 0 0 1 3 3v.5A3.5 3.5 0 0 1 20 10a3.5 3.5 0 0 1-1.2 6.78A3 3 0 0 1 16 21h-1" />
      <path d="M12 3v18" />
      <path d="M9 7h1a2 2 0 0 1 2 2v1" />
      <path d="M15 7h-1a2 2 0 0 0-2 2v1" />
      <path d="M8 13h1a3 3 0 0 1 3 3v1" />
      <path d="M16 13h-1a3 3 0 0 0-3 3v1" />
    </svg>
  );
}

function CpuChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
      <path d="M10 10h4v4h-4z" />
    </svg>
  );
}

function AiChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" />
    </svg>
  );
}

function SearchChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ChartChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V5" />
      <path d="M17 16v-7" />
    </svg>
  );
}

function HealthChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M12 21s-6.7-4.35-9-8.17C1.07 9.7 3 6 6.7 6c2.04 0 3.2 1.08 4.3 2.3C12.1 7.08 13.26 6 15.3 6 19 6 20.93 9.7 21 12.83 18.7 16.65 12 21 12 21Z" />
      <path d="M10 10h4M12 8v4" />
    </svg>
  );
}

function CityChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M5 21V8l6-3v16" />
      <path d="M11 21V3l8 4v14" />
      <path d="M8 11h.01M8 14h.01M8 17h.01M14 10h.01M14 13h.01M14 16h.01M17 10h.01M17 13h.01M17 16h.01" />
    </svg>
  );
}

function LeafChipIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M5 19c8 0 14-6 14-14C11 5 5 11 5 19Z" />
      <path d="M5 19c0-5 4-9 9-9" />
    </svg>
  );
}

function FileDocIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6M9 9h2" />
    </svg>
  );
}

function AlertIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path d="M12 3 2.8 19a1 1 0 0 0 .87 1.5h16.66A1 1 0 0 0 21.2 19L12 3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 22v-8h2.6l.4-3h-3V9.1c0-.87.25-1.46 1.5-1.46H16.7V5.02c-.3-.04-1.34-.12-2.54-.12-2.5 0-4.21 1.52-4.21 4.32V11H7.1v3h2.84v8h3.56Z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6.94 8.5H3.56V20h3.38V8.5Zm-1.7-5.38A1.96 1.96 0 0 0 3.3 5.08c0 1.1.81 1.96 1.9 1.96h.02c1.12 0 1.96-.86 1.96-1.96-.02-1.12-.84-1.96-1.94-1.96ZM20.7 12.62c0-3.37-1.8-4.93-4.2-4.93-1.94 0-2.8 1.06-3.28 1.8V8.5H9.84c.04.66 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.12-.92.27-.67.89-1.36 1.93-1.36 1.36 0 1.9 1.02 1.9 2.5V20H20.7v-7.38Z" />
    </svg>
  );
}

const researchThemes = [
  {
    name: "Neural Engineering",
    icon: BrainChipIcon,
    blurb:
      "Neural signal processing, neurophysiology-inspired models and brain–machine interfaces.",
  },
  {
    name: "Brain–Computer Interfaces",
    icon: CpuChipIcon,
    blurb:
      "Non-invasive BCIs for assistive communication and human–machine interaction.",
  },
  {
    name: "Machine Learning & AI",
    icon: AiChipIcon,
    blurb:
      "Supervised, unsupervised, and deep learning applied to complex real-world data.",
  },
  {
    name: "Explainable AI",
    icon: SearchChipIcon,
    blurb:
      "Model transparency, algorithmic fairness, and human-interpretable decision support.",
  },
  {
    name: "Data Analytics",
    icon: ChartChipIcon,
    blurb:
      "Descriptive, predictive, and prescriptive analytics on high-dimensional datasets.",
  },
  {
    name: "Healthcare & Well-being",
    icon: HealthChipIcon,
    blurb:
      "Clinical decision support, digital health systems, and remote well-being monitoring.",
  },
  {
    name: "Smart Cities & Mobility",
    icon: CityChipIcon,
    blurb:
      "Urban data intelligence, intelligent transport, and sustainable infrastructure.",
  },
  {
    name: "Sustainable Development",
    icon: LeafChipIcon,
    blurb:
      "Energy, climate, and SDG-aligned socio-technical solutions for a better world.",
  },
];

const teamMembers = {
  director: [
    {
      name: "Md. Mortuza Ahmmed",
      role: "Lab Director & Founder",
      affiliation:
        "Associate Professor, Department of Mathematics, American International University-Bangladesh",
      image: "/Images/Leader.png",
    },
    {
      name: "K M Tahsin Kabir",
      role: "Deputy Director",
      affiliation:
        "Lecturer, Department of Computer Science and Engineering, Asian University of Bangladesh",
      image: "/Images/Tahsin.png",
    },
  ],
  advisors: [
    {
      name: "Dr Syed Mohammed Shamsul Islam",
      role: "Senior Advisor",
      affiliation:
        "Senior Lecturer, Discipline of Computing and Security, School of Science, Edith Cowan University, Perth, Western Australia\n\nAdjunct Senior Lecturer, Department of Computer Science and Software Engineering, The University of Western Australia",
        
      image: "/Images/senior 1.jpeg",
    },
     
    {
      name: "Dr. Md. Obaidur Rahaman",
      role: "Senior Advisor",
      affiliation:
        "Professor, Department of Computer Science and Engineering, Uttara University, Dhaka, Bangladesh",
      image: "/Images/senior 2.jpeg",
    },
    {
      name: "Dr. Md. Ashraful Babu",
      role: "Senior Advisor",
      affiliation:
        "Assistant Professor, Department of Physical Sciences, Independent University, Bangladesh",
      image: "/Images/advisor2.jpg",
    },
   

  ],
  leads: [
    {
      name: "Mahin Montasir Afif",
      role: "CVPR & Bioinformatics",
      image: "/Images/passport-size_photo.jpg",
    },
    {
      name: "Sunipun Seemanta",
      role: "NLP & Applied Science",
      image: "/Images/Sunipun.png",
    },
    {
      name: "Hasin Almas Sifat",
      role: "Deep Learning",
      image: "/Images/SIFAT.jpg",
    },
    {
      name: "Md. Moynul Islam",
      role: "Machine Learning",
      image: "/Images/MOYNUL.png",
    },
    {
      name: "Koushik Biswas Arko",
      role: "IoT, Robotics & Signal Processing",
      image: "/Images/Arko.png",
    },
  ],
  hrm: [
    {
      name: "Tamim Hasan Apurbo",
      role: "Human Resource Management & Events",
      image: "/Images/tamim.png",
    },
  ],
  designer: [
    {
      name: "Arizit Chaki Artha",
      role: "Public Relations",
      image: "/Images/chaki.jpeg",
    },
  ],
  it: [
    {
      name: "Mahdi Hassan Noor Asif",
      role: "Information Technology",
      image: "/Images/Asif.png",
    },
  ],
};

const chipVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.03 * i + 0.08,
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function FadeInSection({ children, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function GridOverlay({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(rgba(45,212,191,0.12) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    />
  );
}

function GlowRule() {
  return (
    <div className="relative h-px min-w-0 flex-1">
      <div className="absolute inset-0 bg-gradient-to-r from-accentTeal/50 via-midTeal/30 to-transparent" />
    </div>
  );
}

function SectionHeading({ label, title, sub }) {
  return (
    <div className="mb-10 sm:mb-14">
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="mb-4 flex items-center gap-2"
      >
        <div className="h-5 w-[3px] rounded-full bg-gradient-to-b from-accentTeal to-midTeal" />
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accentTeal sm:tracking-[0.28em]">
          {label}
        </span>
        <div className="h-px w-10 bg-gradient-to-r from-accentTeal/50 to-transparent" />
      </motion.div>

      <h2 className="text-3xl font-bold leading-tight text-deepTeal sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {sub && (
        <p className="mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">{sub}</p>
      )}

      <div className="mt-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-midTeal to-accentTeal" />
    </div>
  );
}

function ThemeChip({ theme, index = 0 }) {
  const Icon = theme.icon;

  return (
    <motion.div
      custom={index}
      variants={chipVariants}
      initial="hidden"
      animate="visible"
      title={theme.blurb}
      className="group flex min-w-0 items-center gap-3 rounded-full border border-white/60 bg-white/70 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accentTeal/40 hover:bg-white hover:shadow-lg"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-midTeal/10 to-accentTeal/10 text-midTeal ring-1 ring-inset ring-midTeal/10">
        <Icon className="h-4 w-4" />
      </div>

      <span className="min-w-0 text-left text-[11px] font-bold leading-tight text-deepTeal sm:text-xs">
        {theme.name}
      </span>
    </motion.div>
  );
}

function NeuronPath({ top, left, width, rotation, delay }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="absolute"
      style={{
        top,
        left,
        width,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "0 50%",
      }}
    >
      <div className="h-[1px] w-full bg-gradient-to-r from-cyan-300/45 via-emerald-300/30 to-sky-300/0" />
      <motion.div
        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-200/90"
        animate={
          reduceMotion
            ? { opacity: 0.7 }
            : { x: ["0%", "100%"], opacity: [0, 0.9, 0.15] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }
        }
      />
    </div>
  );
}

function BrainOrbit() {
  const reduceMotion = useReducedMotion();

  const neuronNodes = [
    { top: "35%", left: "30%" },
    { top: "32%", left: "60%" },
    { top: "42%", left: "44%" },
    { top: "52%", left: "70%" },
    { top: "60%", left: "52%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] xl:max-w-[390px]"
    >
      <motion.div
        animate={reduceMotion ? {} : { y: [0, -6, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ willChange: "transform" }}
        className="relative h-full w-full overflow-hidden rounded-[2rem] border border-accentTeal/35 bg-gradient-to-br from-deepTeal via-slate-950 to-black transition-transform duration-300 transform-gpu"
      >
        <div className="absolute inset-0 opacity-65 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.22),transparent_60%),radial-gradient(circle_at_bottom,rgba(20,184,166,0.18),transparent_55%)]" />
        <div className="absolute inset-0 opacity-35 bg-[linear-gradient(115deg,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(205deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[length:26px_26px]" />

        <motion.div
          animate={reduceMotion ? {} : { scale: [1, 1.015, 1] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
          className="absolute inset-[14%] flex items-center justify-center rounded-[45%] border border-white/20 bg-gradient-to-br from-cyan-300/20 via-accentTeal/30 to-violet-500/25 backdrop-blur-[3px]"
        >
          <motion.img
            src={brainImg}
            alt="NEDAAS neural engineering visualisation"
            fetchPriority="high"
            decoding="async"
            className="relative z-10 w-full mix-blend-screen transform-gpu"
            style={{ willChange: "transform" }}
            animate={reduceMotion ? {} : { rotate: [-2, 2, -2] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        {neuronNodes.map((node, idx) => (
          <motion.div
            key={idx}
            className="absolute h-3 w-3 rounded-full border border-white/60 bg-cyan-200"
            style={{ top: node.top, left: node.left }}
            animate={
              reduceMotion
                ? { opacity: 0.85 }
                : { scale: [1, 1.25, 1], opacity: [0.75, 1, 0.75] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.2,
                  }
            }
          />
        ))}

        <NeuronPath top="28%" left="28%" width="42%" rotation={10} delay={0} />
        <NeuronPath top="40%" left="34%" width="38%" rotation={-18} delay={0.4} />
        <NeuronPath top="55%" left="38%" width="40%" rotation={16} delay={0.8} />

        <motion.div
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 18, repeat: Infinity, ease: "linear" }
          }
          style={{ willChange: "transform" }}
          className="absolute inset-[8%] rounded-full border border-cyan-400/15 transform-gpu"
        >
          <motion.span
            className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan-300/90"
            animate={reduceMotion ? {} : { scale: [1, 1.15, 1] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        <motion.div
          animate={reduceMotion ? {} : { rotate: -360 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 26, repeat: Infinity, ease: "linear" }
          }
          style={{ willChange: "transform" }}
          className="absolute inset-[18%] rounded-full border border-accentTeal/15 transform-gpu"
        >
          <motion.span
            className="absolute left-1 top-[12%] h-2.5 w-2.5 rounded-full bg-accentTeal"
            animate={reduceMotion ? {} : { y: [0, -4, 0] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        <motion.div
          animate={reduceMotion ? {} : { rotate: 360 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 32, repeat: Infinity, ease: "linear" }
          }
          style={{ willChange: "transform" }}
          className="absolute inset-[28%] rounded-full border border-sky-400/15 transform-gpu"
        >
          <motion.span
            className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-300"
            animate={reduceMotion ? {} : { x: [0, 3, 0] }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2 text-[9px] text-cyan-100/70 sm:inset-x-6 sm:flex-row sm:items-end sm:justify-between sm:text-[10px]">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase tracking-[0.18em] text-cyan-200/80 sm:text-[9px]">
              
            </span>
            <span className="font-mono">
              Neural Engineering ·
              <br />
              Data Analytics &amp; Applied Science
            </span>
          </div>

          <div className="flex flex-col gap-1 sm:items-end">
            <span className="text-[8px] uppercase tracking-[0.18em] text-emerald-200/80 sm:text-[9px]">
              Lab Status
            </span>
            <div className="flex items-center gap-1.5 font-mono text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <span>ACTIVE</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TiltCard({ children, className = "", disabled = false }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-0.5, 0.5], [4, -4]);
  const rotY = useTransform(mx, [-0.5, 0.5], [-4, 4]);

  const onMove = (e) => {
    if (disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={
        disabled
          ? undefined
          : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }
      }
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MemberCard({ member, size = "md", index = 0, enableTilt = false }) {
  const isLg = size === "lg";
  const imgCls = isLg ? "h-24 w-24 sm:h-28 sm:w-28" : "h-20 w-20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        delay: index * 0.04,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <TiltCard className="h-full" disabled={!enableTilt}>
        <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md transition-shadow duration-300 hover:shadow-xl sm:p-6">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accentTeal to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className={`${imgCls} relative mb-4 shrink-0`}>
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              decoding="async"
              className={`${imgCls} rounded-full object-cover ring-2 ring-accentTeal/20 ring-offset-2 transition-all duration-300 group-hover:ring-accentTeal/55`}
            />
          </div>

          <h3
            className={`mb-1 break-words font-bold leading-snug text-deepTeal ${
              isLg ? "text-base sm:text-[17px]" : "text-sm"
            }`}
          >
            {member.name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-center">
            <div className="h-1 w-1 shrink-0 rounded-full bg-accentTeal" />
            <span className="break-words text-[9px] font-black uppercase tracking-[0.14em] text-midTeal sm:text-[10px] sm:tracking-[0.2em]">
              {member.role}
            </span>
          </div>

          {member.affiliation && (
            <p className="mt-2 max-w-full text-[11px] leading-relaxed text-gray-400 whitespace-pre-line">
              {member.affiliation}
            </p>
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}

function renderAuthors(authorsStr) {
  let parsed = [];
  try {
    if (authorsStr && authorsStr.trim().startsWith("[")) {
      parsed = JSON.parse(authorsStr);
    } else if (authorsStr) {
      parsed = authorsStr.split(",").map(name => ({ name: name.trim(), scholarLink: "" }));
    }
  } catch (e) {
    parsed = authorsStr ? authorsStr.split(",").map(name => ({ name: name.trim(), scholarLink: "" })) : [];
  }

  return parsed.map((author, index) => {
    const isLast = index === parsed.length - 1;
    return (
      <span key={index}>
        {author.scholarLink ? (
          <a
            href={author.scholarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-midTeal text-gray-400 font-semibold cursor-pointer transition-colors"
          >
            {author.name}
          </a>
        ) : (
          <span>{author.name}</span>
        )}
        {!isLast && <span className="text-gray-400 mr-1.5">,</span>}
      </span>
    );
  });
}

function PublicationCard({ pub, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-midTeal/30 hover:shadow-xl sm:p-6"
    >
      <div className="absolute left-0 top-0 h-0 w-[4px] rounded-full bg-gradient-to-b from-accentTeal to-midTeal/50 transition-all duration-500 group-hover:h-full" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accentTeal/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {pub.meta && (
        <span className="mb-3 inline-flex w-fit self-start rounded-full border border-midTeal/12 bg-midTeal/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.22em] text-midTeal">
          {pub.meta}
        </span>
      )}

      <h3 className="mb-2 flex-1 text-sm font-bold leading-snug text-deepTeal">
        {pub.title}
      </h3>

      <p className="mb-3 text-[11px] font-semibold text-gray-400">
        {renderAuthors(pub.authors)}
      </p>

      {pub.description && (
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-500">
          {pub.description}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {pub.publisher && pub.publisher !== "Other" && (
            <span className="inline-flex w-fit rounded-full border border-accentTeal/15 bg-gradient-to-r from-midTeal/8 to-accentTeal/8 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-accentTeal">
              {pub.publisher}
            </span>
          )}
          {pub.quarter && pub.quarter !== "Other" && (
            <span className="inline-flex w-fit rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700">
              {pub.quarter}
            </span>
          )}
          {pub.scopusIndexed && (
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-700">
              Scopus
            </span>
          )}
          {pub.tag && (
            <span className="inline-flex w-fit rounded-full border border-accentTeal/15 bg-gradient-to-r from-midTeal/8 to-accentTeal/8 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-accentTeal">
              {pub.tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/publications/${pub._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-midTeal transition-colors hover:text-accentTeal"
          >
            View details
          </Link>
          {pub.link && (
            <>
              <span className="text-gray-200 text-xs">|</span>
              <a
                href={pub.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/lnk inline-flex items-center gap-1.5 text-xs font-bold text-midTeal transition-colors hover:text-accentTeal"
              >
                {pub.linkLabel || "Read article"}
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5" />
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PillarCard({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 px-4 py-5 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:border-midTeal/40 hover:-translate-y-1 hover:shadow-xl sm:px-5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-midTeal/5 to-accentTeal/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-2xl font-black text-transparent">
        {value}
      </div>
      <div className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400 sm:tracking-[0.22em]">
        {label}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

  const [publications, setPublications] = useState([]);
  const [pubLoading, setPubLoading] = useState(true);
  const [pubError, setPubError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedQuarter, setSelectedQuarter] = useState("All");
  const [selectedPublisher, setSelectedPublisher] = useState("All");
  const [scopusFilter, setScopusFilter] = useState("All");

  const itemsPerPage = 6;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const handleChange = () => setCanTilt(mediaQuery.matches);
    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPublications = async () => {
      try {
        setPubLoading(true);
        setPubError(null);
        const data = await getPublicationsPublic();

        if (!isMounted) return;
        setPublications(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!isMounted) return;
        setPubError(err?.message || "Failed to load publications.");
      } finally {
        if (isMounted) setPubLoading(false);
      }
    };

    loadPublications();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesQuarter =
        selectedQuarter === "All" || pub.quarter === selectedQuarter;
      const matchesPublisher =
        selectedPublisher === "All" || pub.publisher === selectedPublisher;
      const matchesScopus =
        scopusFilter === "All" ||
        (scopusFilter === "Scopus" && pub.scopusIndexed) ||
        (scopusFilter === "Non-Scopus" && !pub.scopusIndexed);
      return matchesQuarter && matchesPublisher && matchesScopus;
    });
  }, [publications, selectedQuarter, selectedPublisher, scopusFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredPublications.length / itemsPerPage)),
    [filteredPublications.length]
  );

  const paginatedPublications = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredPublications.slice(start, start + itemsPerPage);
  }, [page, filteredPublications]);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    document.getElementById("publications")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const enableTilt = canTilt && !reduceMotion;

  return (
    <div className="relative overflow-x-clip">
      <GridOverlay className="absolute opacity-45 z-0 pointer-events-none" />

      <section
  id="home"
  className="relative isolate flex min-h-[calc(100svh-76px)] items-center overflow-hidden py-10 sm:py-16 lg:py-20"
>
 <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-0 text-center text-[18vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-deepTeal/[0.06] to-transparent select-none font-outfit"
>
  NEDAAS
</div>
        <div className="pointer-events-none absolute -left-40 -top-48 h-[420px] w-[420px] rounded-full bg-cyan-300/12 blur-[100px] sm:h-[480px] sm:w-[480px]" />
        <div className="pointer-events-none absolute -bottom-48 -right-20 h-[420px] w-[420px] rounded-full bg-teal-400/12 blur-[100px] sm:h-[480px] sm:w-[480px]" />

        {!reduceMotion && (
          <motion.div
            animate={{ y: ["0vh", "100vh"] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 6,
            }}
            className="pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accentTeal/30 to-transparent"
          />
        )}

        <Container className="relative z-10">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,390px)] xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] xl:gap-12">
            <div className="min-w-0 max-w-[760px] space-y-7 sm:space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex max-w-full items-center gap-3 rounded-full border border-accentTeal/25 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-md"
              >
                {!reduceMotion && (
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-accentTeal"
                  />
                )}

                {reduceMotion && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accentTeal" />
                )}

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-accentTeal sm:text-[10px] sm:tracking-[0.24em]">
                  Interdisciplinary Research Lab · Bangladesh
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  delay: 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="max-w-3xl text-3xl font-bold leading-[1.08] tracking-tight text-deepTeal sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[3.3rem]"
              >
                Where{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                    research
                  </span>
                  {!reduceMotion && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.45, delay: 0.45 }}
                      className="absolute bottom-0.5 left-0 right-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-midTeal to-accentTeal"
                    />
                  )}
                </span>{" "}
                becomes meaningful,{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                    creativity
                  </span>
                  {!reduceMotion && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.45, delay: 0.6 }}
                      className="absolute bottom-0.5 left-0 right-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-midTeal to-accentTeal"
                    />
                  )}
                </span>{" "}
                becomes science, and{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                    science
                  </span>
                  {!reduceMotion && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.45, delay: 0.75 }}
                      className="absolute bottom-0.5 left-0 right-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-midTeal to-accentTeal"
                    />
                  )}
                </span>{" "}
                becomes service to humanity.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 }}
                className="max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base"
              >
                Neural engineering, data analytics, and applied science for
                real-world impact across health, intelligence, and sustainable
                systems.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.18 }}
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-accentTeal/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-accentTeal/30 active:scale-[0.98] sm:w-auto sm:px-7"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Explore Our Mission
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>

                  {!reduceMotion && (
                    <motion.div
                      animate={{ x: ["110%", "-110%"] }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                      className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("publications")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-midTeal px-6 py-3.5 text-sm font-black text-midTeal transition-all duration-200 hover:border-transparent hover:bg-midTeal hover:text-white sm:w-auto sm:px-7"
                >
                  View Research Outputs
                  <ArrowUpRightIcon className="h-4 w-4" />
                </button>
              </motion.div>

              
            </div>

            <div className="flex min-w-0 items-center justify-center lg:justify-end">
              <BrainOrbit />
            </div>
          </div>
        </Container>
      </section>

      <FadeInSection delay={0.04}>
        <section id="about" className="relative overflow-hidden py-20 sm:py-24">
          <div className="pointer-events-none absolute -top-28 left-0 h-80 w-80 rounded-full bg-cyan-300/8 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-300/8 blur-[80px]" />

          <Container>
            <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <div>
                <SectionHeading
                  label="About the Lab"
                  title={
                    <>
                      Where{" "}
                      <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                        neural engineering
                      </span>
                      , data science &amp; applied research converge.
                    </>
                  }
                />

                <div className="max-w-xl space-y-4 text-[15px] leading-relaxed text-gray-600">
                  <p>
                    NEDAAS — Neural Engineering, Data Analytics &amp; Applied
                    Science — is a research-driven community where students and
                    faculty explore the intersection of{" "}
                    <span className="font-bold text-deepTeal">
                      brain science, artificial intelligence, and sustainable
                      development
                    </span>
                    . We design experiments, build prototypes, and produce
                    impactful work that bridges advanced technology with real
                    human, social, and environmental challenges.
                  </p>
                  <p>
                    From brain–computer interfaces and healthcare analytics to
                    smart-city intelligence and renewable-energy forecasting,
                    our mission is to turn{" "}
                    <span className="font-bold text-deepTeal">
                      creativity into science
                    </span>{" "}
                    and{" "}
                    <span className="font-bold text-deepTeal">
                      science into service for humanity
                    </span>
                    .
                  </p>
                </div>

                <div className="relative mt-10 overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-deepTeal via-slate-900 to-black" />
                  <GridOverlay className="opacity-35" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,211,238,0.18),transparent_65%)]" />

                  {!reduceMotion && (
                    <motion.div
                      animate={{ y: ["0%", "100%"] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 3,
                      }}
                      className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accentTeal/40 to-transparent"
                    />
                  )}

                  <div className="relative p-6 sm:p-7">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-px w-3 bg-accentTeal" />
                      <span className="text-[9px] font-black uppercase tracking-[0.24em] text-accentTeal sm:tracking-[0.28em]">
                        Research Philosophy
                      </span>
                    </div>

                    <p className="text-base font-semibold leading-relaxed text-white/90 sm:text-lg">
                      We build research that is technically rigorous, socially
                      relevant, and deeply connected to the future of intelligent
                      systems.
                    </p>

                    <div className="mt-5 h-px bg-gradient-to-r from-accentTeal/50 via-midTeal/30 to-transparent" />
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-1">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "AI", label: "Intelligence" },
                    { value: "BCI", label: "Interfaces" },
                    { value: "XAI", label: "Transparency" },
                    { value: "SDG", label: "Global Impact" },
                  ].map((item) => (
                    <PillarCard key={item.label} {...item} />
                  ))}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  {researchThemes.map((t, i) => {
                    const Icon = t.icon;

                    return (
                      <motion.div
                        key={t.name}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.03, duration: 0.28 }}
                        className="group flex cursor-default items-start gap-4 border-b border-gray-50 px-4 py-4 transition-colors duration-200 last:border-0 hover:bg-gradient-to-r hover:from-midTeal/4 hover:to-transparent sm:px-5"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-midTeal/10 to-accentTeal/10 text-midTeal ring-1 ring-inset ring-midTeal/10">
                          <Icon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-deepTeal transition-colors group-hover:text-midTeal">
                            {t.name}
                          </div>
                          <div className="mt-1 text-[11px] leading-relaxed text-gray-400">
                            {t.blurb}
                          </div>
                        </div>

                        <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-accentTeal/50 opacity-0 transition-opacity group-hover:opacity-100" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.04}>
        <section id="publications" className="py-20">
          <Container>
            <SectionHeading
              label="Research Outputs"
              title="Publications"
              sub="Peer-reviewed contributions across neural engineering, AI, and applied data science."
            />

            {pubLoading && (
              <div className="flex items-center gap-3 py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-accentTeal border-t-transparent"
                />
                <span className="text-sm font-medium text-gray-400">
                  Loading publications…
                </span>
              </div>
            )}

            {pubError && !pubLoading && (
              <div className="mb-6 flex max-w-lg items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm">
                <AlertIcon className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-red-500">
                  {pubError} Please try again later.
                </span>
              </div>
            )}

            {!pubLoading && publications.length === 0 && !pubError && (
              <div className="py-14 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-midTeal/8 text-midTeal">
                    <FileDocIcon className="h-7 w-7" />
                  </div>
                </div>
                <p className="mb-1 font-bold text-deepTeal">No publications yet</p>
                <p className="text-sm text-gray-400">
                  New research is in progress — check back soon.
                </p>
              </div>
            )}

            {!pubLoading && publications.length > 0 && (
              <>
                <div className="mb-6 grid gap-4 rounded-3xl border border-gray-200 bg-white/80 px-4 py-4 sm:grid-cols-[minmax(200px,1fr)_minmax(200px,1fr)_minmax(160px,1fr)]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-midTeal">
                      Quarter
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['All', 'Q1', 'Q2', 'Q3', 'Q4'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSelectedQuarter(option); setPage(1); }}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                            selectedQuarter === option
                              ? 'border-midTeal bg-midTeal/10 text-midTeal'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-midTeal/40 hover:text-midTeal'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-midTeal">
                      Publisher
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['All', 'IEEE', 'Elsevier', 'ACM Library', 'AIP', 'Springer', 'Taylor Francis'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setSelectedPublisher(option); setPage(1); }}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                            selectedPublisher === option
                              ? 'border-midTeal bg-midTeal/10 text-midTeal'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-midTeal/40 hover:text-midTeal'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-midTeal">
                      Scopus
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['All', 'Scopus', 'Non-Scopus'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => { setScopusFilter(option); setPage(1); }}
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                            scopusFilter === option
                              ? 'border-midTeal bg-midTeal/10 text-midTeal'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-midTeal/40 hover:text-midTeal'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredPublications.length === 0 ? (
                  <div className="py-14 text-center text-sm text-gray-500">
                    No publications match the selected filters.
                  </div>
                ) : (
                  <>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={page}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.22 }}
                        className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                      >
                        {paginatedPublications.map((pub, i) => (
                          <PublicationCard
                            key={pub._id || `${pub.title}-${i}`}
                            pub={pub}
                            index={i}
                          />
                        ))}
                      </motion.div>
                    </AnimatePresence>

                    {totalPages > 1 && (
                      <div className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <button
                          type="button"
                          onClick={() => goToPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="inline-flex items-center justify-center rounded-full border border-midTeal px-5 py-2.5 text-sm font-black text-midTeal transition-all duration-200 hover:bg-midTeal hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          Previous
                        </button>

                        <span className="text-center text-sm font-medium text-gray-400">
                          Page <strong className="text-deepTeal">{page}</strong> / <strong className="text-deepTeal">{totalPages}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => goToPage(Math.min(totalPages, page + 1))}
                          disabled={page === totalPages}
                          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-5 py-2.5 text-sm font-black text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accentTeal/20 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          Next
                        </button>
                      </div>
                    )}

                    <div className="mt-10 flex justify-center border-t border-gray-100 pt-6">
                      <button
                        type="button"
                        onClick={() => navigate("/publications")}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-8 py-3 text-sm font-black text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-accentTeal/20"
                      >
                        See All Publications
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </Container>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.04}>
        <section id="team" className="py-20">
          <Container>
            <SectionHeading
              label="Our People"
              title="Meet the Team"
              sub="The researchers, advisors, and operators behind NEDAAS."
            />

            {[
              {
                key: "director",
                label: "Lab Leadership",
                members: teamMembers.director,
                cols: "md:grid-cols-2",
                size: "lg",
              },
              {
                key: "advisors",
                label: "Scientific Advisors",
                members: teamMembers.advisors,
                cols: "md:grid-cols-2",
                size: "lg",
              },
              {
                key: "leads",
                label: "Research Leads",
                members: teamMembers.leads,
                cols: "sm:grid-cols-2 lg:grid-cols-3",
                size: "md",
              },
            ].map(({ key, label, members, cols, size }) => (
              <div key={key} className="mb-14">
                <div className="mb-6 flex items-center gap-3">
                  <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
                    {label}
                  </span>
                  <GlowRule />
                </div>

                <div className={`grid gap-5 ${cols}`}>
                  {members.map((m, i) => (
                    <MemberCard
                      key={`${m.name}-${i}`}
                      member={m}
                      size={size}
                      index={i}
                      enableTilt={enableTilt}
                    />
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
                  Operations & Support
                </span>
                <GlowRule />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {[
                  {
                    label: "Human Resource & Events",
                    members: teamMembers.hrm,
                  },
                  {
                    label: "Public Relations",
                    members: teamMembers.designer,
                  },
                  {
                    label: "Information Technology",
                    members: teamMembers.it,
                  },
                ].map((group, gi) => (
                  <div key={gi}>
                    <div className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 sm:tracking-widest">
                      {group.label}
                    </div>
                    {group.members.map((m, i) => (
                      <MemberCard
                        key={`${m.name}-${i}`}
                        member={m}
                        size="md"
                        index={i}
                        enableTilt={enableTilt}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.04}>
        <section id="contact" className="py-20">
          <Container>
            <SectionHeading
              label="Get in Touch"
              title="Contact Us"
              sub="We welcome inquiries from students, researchers, and industry partners alike."
            />

            <div className="grid max-w-3xl gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
                <div className="space-y-3">
                  {[
                    {
                      href: "https://www.facebook.com/nedaas.lab",
                      label: "Facebook",
                      sub: "facebook.com/nedaas.lab",
                      icon: FacebookIcon,
                      color: "bg-[#1877F2]/10 text-[#1877F2]",
                    },
                    {
                      href: "https://www.linkedin.com/company/nedaas",
                      label: "LinkedIn",
                      sub: "linkedin.com/company/nedaas",
                      icon: LinkedinIcon,
                      color: "bg-[#0A66C2]/10 text-[#0A66C2]",
                    },
                  ].map(({ href, label, sub, icon: Icon, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-200 hover:border-midTeal/25 hover:bg-midTeal/3"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-bold text-deepTeal transition-colors group-hover:text-midTeal">
                          {label}
                        </div>
                        <div className="break-all text-[11px] text-gray-400 sm:break-normal">
                          {sub}
                        </div>
                      </div>

                      <ArrowUpRightIcon className="ml-auto h-4 w-4 text-gray-200 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accentTeal" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-deepTeal via-slate-900 to-black" />
                <GridOverlay className="opacity-35" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(45,212,191,0.18),transparent_65%)]" />

                {!reduceMotion && (
                  <motion.div
                    animate={{ y: ["0%", "100%"] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 4,
                    }}
                    className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-accentTeal/35 to-transparent"
                  />
                )}

                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div className="mb-5 flex items-center gap-2">
                    <div className="h-px w-3 bg-accentTeal" />
                    <span className="text-[9px] font-black uppercase tracking-[0.24em] text-accentTeal sm:tracking-[0.28em]">
                      Open to Collaboration
                    </span>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-slate-300">
                    We actively partner with universities, hospitals, NGOs, and
                    technology organisations on research that creates measurable
                    scientific and social impact.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {["Joint Research", "Student Exchange", "Industry Projects"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-200/80 sm:tracking-widest"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <footer className="mt-20 border-t border-gray-100 pt-8">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-[3px] rounded-full bg-gradient-to-b from-accentTeal to-midTeal" />
                  <div>
                    <div className="text-sm font-black tracking-wide text-deepTeal">
                      NEDAAS Lab
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Neural Engineering · Data Analytics · Applied Science
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5 text-center text-[11px] text-gray-400 sm:text-right">
                  <p>Built for research, creativity, and service to humanity.</p>
                  <p>© {new Date().getFullYear()} NEDAAS. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </Container>
        </section>
      </FadeInSection>
    </div>
  );
}