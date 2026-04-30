import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPublicationsPublic } from "../api/adminApi";

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

function FileDocIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  );
}

function AlertIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
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

      <p className="mb-3 text-[11px] font-semibold text-gray-400">{pub.authors}</p>

      {pub.description && (
        <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-500">
          {pub.description}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
        {pub.tag ? (
          <span className="inline-flex w-fit rounded-full border border-accentTeal/15 bg-gradient-to-r from-midTeal/8 to-accentTeal/8 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-accentTeal">
            {pub.tag}
          </span>
        ) : (
          <span />
        )}

        {pub.link && (
          <a
            href={pub.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group/lnk inline-flex items-center gap-1.5 text-xs font-bold text-midTeal transition-colors hover:text-accentTeal"
          >
            {pub.linkLabel || "Read article"}
            <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform group-hover/lnk:translate-x-0.5 group-hover/lnk:-translate-y-0.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
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

      <h1 className="text-3xl font-bold leading-tight text-deepTeal sm:text-4xl md:text-5xl">
        {title}
      </h1>

      {sub && (
        <p className="mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">{sub}</p>
      )}

      <div className="mt-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-midTeal to-accentTeal" />
    </div>
  );
}

export default function Publications() {
  const [publications, setPublications] = useState([]);
  const [pubLoading, setPubLoading] = useState(true);
  const [pubError, setPubError] = useState(null);

  useEffect(() => {
    const loadPublications = async () => {
      try {
        setPubLoading(true);
        const data = await getPublicationsPublic();
        setPublications(Array.isArray(data) ? data : []);
        setPubError(null);
      } catch (err) {
        setPubError(err?.message || "Failed to load publications.");
      } finally {
        setPubLoading(false);
      }
    };

    loadPublications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="py-20">
        <Container>
          <SectionHeading
            label="Research Outputs"
            title="All Publications"
            sub="Explore our complete library of peer-reviewed contributions across neural engineering, AI, and applied data science."
          />
        </Container>
      </div>

      <div className="pb-20">
        <Container>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            >
              {publications.map((pub, i) => (
                <PublicationCard
                  key={pub._id || `${pub.title}-${i}`}
                  pub={pub}
                  index={i}
                />
              ))}
            </motion.div>
          )}

          {!pubLoading && publications.length > 0 && (
            <div className="mt-12 border-t border-gray-100 pt-8 text-center">
              <p className="text-sm font-medium text-gray-500">
                Showing all <strong className="text-deepTeal">{publications.length}</strong> publications
              </p>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
