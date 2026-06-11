import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getPublicationByIdPublic } from "../api/adminApi";

function ArrowLeftIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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

function CopyIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BookOpenIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
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
            className="hover:underline hover:text-midTeal text-gray-700 font-semibold cursor-pointer transition-colors"
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

export default function PublicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadPublication = async () => {
      try {
        setLoading(true);
        const data = await getPublicationByIdPublic(id);
        setPub(data);
        setError(null);
      } catch (err) {
        setError(err?.message || "Failed to load publication details.");
      } finally {
        setLoading(false);
      }
    };

    loadPublication();
  }, [id]);

  const handleCopyLink = () => {
    if (!pub?.link) return;
    navigator.clipboard.writeText(pub.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-accentTeal border-t-transparent mb-4"
        />
        <span className="text-sm font-semibold text-gray-500">
          Loading publication details…
        </span>
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 p-8 shadow-lg text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-500 mb-4">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-deepTeal mb-2">Error Loading Publication</h2>
          <p className="text-sm text-gray-500 mb-6">
            {error || "The requested publication could not be found or is not approved."}
          </p>
          <button
            onClick={() => navigate("/publications")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:scale-[1.02]"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Publications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-20">
      {/* Background glow elements */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-cyan-300/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      <Container className="pt-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-600 shadow-sm transition hover:border-midTeal hover:text-midTeal"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Publications
          </Link>
        </div>

        {/* Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-md backdrop-blur-md"
          >
            {/* Meta tags */}
            <div className="flex flex-wrap gap-2.5 mb-6">
              {pub.meta && (
                <span className="inline-flex rounded-full border border-midTeal/12 bg-midTeal/8 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-midTeal">
                  {pub.meta}
                </span>
              )}
              {pub.publisher && pub.publisher !== "Other" && (
                <span className="inline-flex rounded-full border border-accentTeal/15 bg-gradient-to-r from-midTeal/8 to-accentTeal/8 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-accentTeal">
                  {pub.publisher}
                </span>
              )}
              {pub.quarter && pub.quarter !== "Other" && (
                <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                  {pub.quarter}
                </span>
              )}
              {pub.scopusIndexed && (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Scopus Indexed
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-deepTeal leading-snug mb-4">
              {pub.title}
            </h1>

            {/* Authors */}
            <div className="mb-8 border-b border-gray-100 pb-5">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Authors</span>
              <p className="mt-1 text-sm font-semibold text-gray-700">{renderAuthors(pub.authors)}</p>
            </div>

            {/* Abstract / Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon className="h-5 w-5 text-midTeal" />
                <h3 className="text-sm font-black uppercase tracking-widest text-deepTeal">Abstract / Description</h3>
              </div>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line sm:text-base">
                {pub.description}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Quick Actions & Links Card */}
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur-md">
              <h3 className="text-xs font-black uppercase tracking-wider text-deepTeal mb-4 border-b border-gray-100 pb-3">
                Publication Links
              </h3>

              {pub.link && (
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">DOI / Document URL</span>
                    <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                      <span className="truncate text-xs text-gray-500 font-mono select-all">
                        {pub.link}
                      </span>
                      <button
                        onClick={handleCopyLink}
                        type="button"
                        className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-midTeal hover:border-midTeal/50 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <CopyIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-midTeal to-accentTeal py-3 px-4 text-sm font-black text-white shadow-md hover:scale-[1.01] hover:shadow-lg transition-all"
                  >
                    {pub.linkLabel || "View Source Article"}
                    <ArrowUpRightIcon className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Quick Details Card */}
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-md backdrop-blur-md text-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-deepTeal mb-4 border-b border-gray-100 pb-3">
                Metadata Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-400">Quarter</span>
                  <span className="font-bold text-deepTeal">{pub.quarter || "Other"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-400">Publisher</span>
                  <span className="font-bold text-deepTeal">{pub.publisher || "Other"}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="font-semibold text-gray-400">Scopus Indexed</span>
                  <span className={`font-bold ${pub.scopusIndexed ? "text-emerald-600" : "text-gray-500"}`}>
                    {pub.scopusIndexed ? "Yes" : "No"}
                  </span>
                </div>
                {pub.tag && (
                  <div className="flex justify-between py-1.5 border-b border-gray-50">
                    <span className="font-semibold text-gray-400">Research Area</span>
                    <span className="font-bold text-deepTeal">{pub.tag}</span>
                  </div>
                )}
                <div className="flex justify-between py-1.5">
                  <span className="font-semibold text-gray-400">Added Date</span>
                  <span className="font-bold text-deepTeal">
                    {new Date(pub.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
