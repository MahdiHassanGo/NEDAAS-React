import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

const foundingData = {
  director: {
    name: "Md. Mortuza Ahmmed",
    role: "Lab Director & Founder",
    affiliation:
      "Associate Professor, Department of Mathematics, American International University-Bangladesh",
    image: "/Images/Leader.png",
  },
  deputyDirector: {
    name: "K M Tahsin Kabir",
    role: "Deputy Director",
    affiliation:
      "Lecturer, Department of Computer Science and Engineering, Uttara University",
    image: "/Images/Tahsin.png",
  },
  leads: [
    {
      name: "Mahin Montasir Afif",
      role: "CVPR & Bioinformatics",
      image: "/Images/Afif.jpeg",
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

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

function GlowRule() {
  return (
    <div className="relative h-px min-w-0 flex-1">
      <div className="absolute inset-0 bg-gradient-to-r from-accentTeal/50 via-midTeal/30 to-transparent" />
    </div>
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

function FoundingMemberCard({ member, isFeatured = false, index = 0 }) {
  const imgCls = isFeatured
    ? "h-28 w-28 sm:h-32 sm:w-32"
    : "h-20 w-20 sm:h-24 sm:w-24";

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
      <TiltCard className="h-full">
        <div className="group relative flex h-full flex-col items-center overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 text-center shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl sm:p-6">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accentTeal to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Founding Member Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accentTeal/20 bg-accentTeal/10 px-2.5 py-0.5 text-[8.5px] font-black uppercase tracking-[0.18em] text-midTeal">
              <span className="h-1.5 w-1.5 rounded-full bg-accentTeal animate-pulse" />
              Founding Member
            </span>
          </div>

          <div className={`${imgCls} relative mb-4 shrink-0`}>
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              decoding="async"
              className={`${imgCls} rounded-full object-cover ring-2 ring-accentTeal/25 ring-offset-2 transition-all duration-300 group-hover:ring-accentTeal/60 group-hover:scale-105`}
            />
          </div>

          <h3
            className={`mb-1 break-words font-bold leading-snug text-deepTeal ${
              isFeatured ? "text-base sm:text-lg" : "text-sm sm:text-base"
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
            <p className="mt-2.5 max-w-full text-[11px] leading-relaxed text-gray-400 whitespace-pre-line sm:text-xs">
              {member.affiliation}
            </p>
          )}
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function FoundingMembers() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.title = "Founding Members | NEDAAS Research Lab";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-lightBg via-white to-lightBg/50 py-12 sm:py-16">
      {/* Background Neural Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(33,182,197,0.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-midTeal transition-colors hover:text-deepTeal"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
          </Link>
        </div>

        {/* Hero Section Heading */}
        <div className="mb-14 sm:mb-20">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-4 flex items-center gap-2"
          >
            <div className="h-5 w-[3px] rounded-full bg-gradient-to-b from-accentTeal to-midTeal" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-accentTeal sm:tracking-[0.28em]">
              Origin & Foundation
            </span>
            <div className="h-px w-12 bg-gradient-to-r from-accentTeal/50 to-transparent" />
          </motion.div>

          <h1 className="text-3xl font-bold leading-tight text-deepTeal sm:text-4xl md:text-5xl lg:text-6xl">
            Founding Members
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
            Honoring the foundational leadership, domain architects, and pioneering members who conceptualized, shaped, and established the Neural Engineering and Data-Driven Applied Science (NEDAAS) Research Lab.
          </p>

          <div className="mt-6 h-[2px] w-20 rounded-full bg-gradient-to-r from-midTeal to-accentTeal" />
        </div>

        {/* 1. Lab Director & Founder - SINGLE ROW, SINGLE COLUMN */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
              Lab Director & Founder
            </span>
            <GlowRule />
          </div>

          <div className="mx-auto flex w-full max-w-xl justify-center">
            <div className="w-full">
              <FoundingMemberCard
                member={foundingData.director}
                isFeatured={true}
                index={0}
              />
            </div>
          </div>
        </div>

        {/* 2. Deputy Director */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
              Founding Leadership
            </span>
            <GlowRule />
          </div>

          <div className="mx-auto flex w-full max-w-xl justify-center">
            <div className="w-full">
              <FoundingMemberCard
                member={foundingData.deputyDirector}
                isFeatured={true}
                index={1}
              />
            </div>
          </div>
        </div>

        {/* 3. Research Leads */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
              Founding Research Leads
            </span>
            <GlowRule />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {foundingData.leads.map((m, i) => (
              <FoundingMemberCard
                key={m.name}
                member={m}
                index={i + 2}
              />
            ))}
          </div>
        </div>

        {/* 4. Operations & Core Support */}
        <div className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.22em] text-midTeal sm:tracking-[0.26em]">
              Founding Operations & Core Support
            </span>
            <GlowRule />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                label: "Human Resource & Events",
                members: foundingData.hrm,
              },
              {
                label: "Public Relations",
                members: foundingData.designer,
              },
              {
                label: "Information Technology",
                members: foundingData.it,
              },
            ].map((group, gi) => (
              <div key={gi} className="flex flex-col gap-3">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {group.label}
                </div>
                {group.members.map((m, i) => (
                  <FoundingMemberCard
                    key={m.name}
                    member={m}
                    index={i + 7 + gi}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Founding Philosophy Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-accentTeal/20 bg-gradient-to-r from-deepTeal via-[#0e4859] to-deepTeal p-8 text-white shadow-xl sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-accentTeal">
              The Genesis of NEDAAS
            </span>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Building the Future of Neural Engineering
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Established with an ambitious mission to unite advanced computational intelligence, bioinformatics, and embedded intelligence for human well-being and national scientific advancement.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/#team"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-5 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
              >
                <span>View Current Team</span>
                <span>→</span>
              </Link>
              <Link
                to="/publications"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <span>Explore Research</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
