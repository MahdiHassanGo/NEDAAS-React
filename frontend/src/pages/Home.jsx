// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getPublicationsPublic } from "../api/adminApi";

// REMOVE the old "const publications = [...]" array

const researchThemes = [
  "Neural Engineering",
  "Brain–Computer Interfaces",
  "Machine Learning & AI",
  "Explainable AI",
  "Data Analytics",
  "Healthcare & Well-being",
  "Smart Cities & Mobility",
  "Sustainable Development",
];

const teamMembers = {
  director: [
    {
      name: "Md. Mortuza Ahmmed",
      role: "Lab Director / Founder",
      image: "/Images/Leader.png",
    },
    {
      name: "K M Tahsin Kabir",
      role: "Deputy Director",
      image: "/Images/Tahsin.png",
    },
  ],
  advisors: [
    {
      name: "Advisor 1",
      role: "Research Advisor",
      image: "/Images/Advisor1.png",
    },
    {
      name: "Advisor 2",
      role: "Research Advisor",
      image: "/Images/advisor2.jpg",
    },
  ],
  leads: [
    { name: "Sunipun", role: "Team Lead", image: "/Images/Sunipun.png" },
    { name: "SIFAT", role: "Team Lead", image: "/Images/SIFAT.jpg" },
    { name: "MOYNUL", role: "Team Lead", image: "/Images/MOYNUL.png" },
    { name: "PP2", role: "Team Lead", image: "/Images/PP2.jpg" },
    { name: "tamim", role: "Team Lead", image: "/Images/tamim.png" },
    { name: "Jihad", role: "Team Lead", image: "/Images/Jihad.png" },
  ],
  hrm: [
    {
      name: "Asif",
      role: "Human Resource Management",
      image: "/Images/Asif.png",
    },
  ],
  designer: [
    {
      name: "Designer",
      role: "Designer & Public Relation",
      image: "/Images/passport-size_photo.jpg",
    },
  ],
  it: [
    {
      name: "IT Specialist",
      role: "Information Technology",
      image: "/Images/passport-size_photo.jpg",
    },
  ],
};

export default function Home() {
  const [publications, setPublications] = useState([]);
  const [pubLoading, setPubLoading] = useState(true);
  const [pubError, setPubError] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const loadPublications = async () => {
      try {
        setPubLoading(true);
        setPubError(null);
        const data = await getPublicationsPublic();
        setPublications(data);
      } catch (err) {
        console.error("Failed to load publications:", err);
        setPubError(err.message || "Failed to load publications");
      } finally {
        setPubLoading(false);
      }
    };

    loadPublications();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(publications.length / itemsPerPage)
  );
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPublications = publications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center py-20">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 w-full">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Where{" "}
              <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                research
              </span>{" "}
              becomes meaningful,{" "}
              <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                creativity
              </span>{" "}
              becomes science and{" "}
              <span className="bg-gradient-to-r from-midTeal to-accentTeal bg-clip-text text-transparent">
                science
              </span>{" "}
              becomes service to humanity.
            </h1>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => scrollToSection("about")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white font-medium hover:shadow-lg transition-shadow"
              >
                Explore our mission ⟶
              </button>
              <button
                onClick={() => scrollToSection("publications")}
                className="px-6 py-3 rounded-full border-2 border-midTeal text-midTeal font-medium hover:bg-midTeal hover:text-white transition-colors"
              >
                View research outputs
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-gradient-to-br from-deepTeal via-midTeal to-black border border-accentTeal/40 shadow-2xl overflow-hidden">
              <img
                src="/Images/Brain.png"
                alt="Brain"
                className="absolute inset-0 w-full h-full object-contain mix-blend-screen animate-pulse"
              />
              <div className="absolute inset-0 bg-accentTeal/10 animate-[ping_5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {/* ... (unchanged, keep your existing About, Team, Contact code) ... */}

      {/* Publications Section */}
      <section id="publications" className="py-20">
        <h2 className="text-4xl font-bold text-deepTeal mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal">
          Publications
        </h2>

        {pubLoading && (
          <div className="text-midTeal">Loading publications...</div>
        )}

        {pubError && !pubLoading && (
          <div className="text-red-600 text-sm mb-4">
            {pubError}. Showing nothing.
          </div>
        )}

        {!pubLoading && publications.length === 0 && !pubError && (
          <div className="text-gray-600">
            No publications available yet. Please check back later.
          </div>
        )}

        {!pubLoading && publications.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {paginatedPublications.map((pub) => (
                <div
                  key={pub._id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-xs uppercase tracking-wider text-midTeal mb-2">
                    {pub.meta}
                  </div>
                  <h3 className="text-lg font-bold text-deepTeal mb-2">
                    {pub.title}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    {pub.authors}
                  </div>
                  <p className="text-sm text-gray-700 mb-4">
                    {pub.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-midTeal/10 text-midTeal text-xs font-medium">
                      {pub.tag}
                    </span>
                    {pub.link && (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accentTeal hover:underline text-sm font-medium"
                      >
                        {pub.linkLabel || "View article"} →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-midTeal text-midTeal disabled:opacity-50 disabled:cursor-not-allowed hover:bg-midTeal hover:text-white transition-colors"
              >
                Previous
              </button>
              <div className="text-deepTeal font-medium">
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
              >
                {page === totalPages ? "Back to first" : "See more ⟶"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* Team Section */}
      <section id="team" className="py-20">
        <h2 className="text-4xl font-bold text-deepTeal mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal">
          Team
        </h2>

        {/* Lab Director / Founder */}
        <div className="mb-12">
          <div className="text-sm uppercase tracking-wider text-midTeal mb-4">Lab Director / Founder</div>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.director.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md border-2 border-midTeal/30 flex flex-col items-center text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-midTeal/20"
                />
                <h3 className="text-xl font-bold text-deepTeal mb-1">{member.name}</h3>
                <div className="text-sm text-midTeal">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div className="mb-12">
          <div className="text-sm uppercase tracking-wider text-midTeal mb-4">Advisors</div>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.advisors.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-midTeal/20"
                />
                <h3 className="text-xl font-bold text-deepTeal mb-1">{member.name}</h3>
                <div className="text-sm text-midTeal">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Leads */}
        <div className="mb-12">
          <div className="text-sm uppercase tracking-wider text-midTeal mb-4">Team Leads</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {teamMembers.leads.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md border border-accentTeal/30 flex flex-col items-center text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-accentTeal/20"
                />
                <h3 className="text-lg font-bold text-deepTeal mb-1">{member.name}</h3>
                <div className="text-sm text-midTeal">{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HRM, Designer, IT */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Human Resource Management", members: teamMembers.hrm },
            { label: "Designer & Public Relation", members: teamMembers.designer },
            { label: "Information Technology", members: teamMembers.it },
          ].map((group, groupIdx) => (
            <div key={groupIdx}>
              <div className="text-sm uppercase tracking-wider text-midTeal mb-4">{group.label}</div>
              {group.members.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-midTeal/20"
                  />
                  <h3 className="text-lg font-bold text-deepTeal mb-1">{member.name}</h3>
                  <div className="text-sm text-midTeal">{member.role}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <h2 className="text-4xl font-bold text-deepTeal mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal">
          Contact
        </h2>
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-midTeal/20 max-w-2xl">
          <p className="text-lg text-gray-700 mb-6">
            Interested in collaborating, joining the lab, or learning more about our projects? Reach out
            through any of the channels below.
          </p>
          <div className="space-y-4">
            <a
              href="mailto:contact@nedaas.lab"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-lightBg transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-midTeal/20 flex items-center justify-center text-midTeal font-bold">
                @
              </div>
              <span className="text-deepTeal">contact@nedaas.lab</span>
            </a>
            <a
              href="https://facebook.com/your-nedaas-page"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-lightBg transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-midTeal/20 flex items-center justify-center text-midTeal font-bold">
                f
              </div>
              <span className="text-deepTeal">Facebook</span>
            </a>
            <a
              href="https://www.linkedin.com/in/your-nedaas-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-lightBg transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-midTeal/20 flex items-center justify-center text-midTeal font-bold">
                in
              </div>
              <span className="text-deepTeal">LinkedIn</span>
            </a>
          </div>
        </div>
        <footer className="mt-12 text-center text-gray-600">
          <p>
            © NEDAAS – Neural Engineering, Data Analytics & Applied Science. Built for research,
            creativity, and service to humanity.
          </p>
        </footer>
      </section>
    </div>
  );
}

