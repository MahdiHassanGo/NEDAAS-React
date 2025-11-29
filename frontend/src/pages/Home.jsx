import { useState } from "react";

const publications = [
  {
    meta: "2024 • Journal",
    title: "Neural Engineering Applications in Brain-Computer Interfaces",
    authors: "Ahmmed, M. M., Kabir, K. M. T., et al.",
    description: "A comprehensive study on neural engineering applications...",
    tag: "Neural Engineering",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2024 • Conference",
    title: "Machine Learning for Healthcare Analytics",
    authors: "Team NEDAAS",
    description: "Exploring ML applications in healthcare data analysis...",
    tag: "Machine Learning",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2023 • Journal",
    title: "Explainable AI in Medical Diagnosis",
    authors: "NEDAAS Research Team",
    description: "Investigating explainable AI methods for medical applications...",
    tag: "Explainable AI",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2023 • Conference",
    title: "Smart Cities and Sustainable Mobility",
    authors: "NEDAAS Lab",
    description: "Data-driven approaches to urban planning and transportation...",
    tag: "Smart Cities",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2023 • Journal",
    title: "Data Analytics for Healthcare Well-being",
    authors: "Ahmmed, M. M., et al.",
    description: "Advanced analytics techniques for healthcare improvement...",
    tag: "Healthcare",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2022 • Journal",
    title: "Sustainable Development through Technology",
    authors: "NEDAAS Research Group",
    description: "Technology solutions for sustainable development goals...",
    tag: "Sustainable Development",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2022 • Conference",
    title: "Brain-Computer Interface Design",
    authors: "Kabir, K. M. T., et al.",
    description: "Novel approaches to BCI system design and implementation...",
    tag: "BCI",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2022 • Journal",
    title: "AI-Driven Data Analytics",
    authors: "NEDAAS Team",
    description: "Artificial intelligence applications in big data analytics...",
    tag: "Data Analytics",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
  {
    meta: "2021 • Journal",
    title: "Neural Signal Processing",
    authors: "Ahmmed, M. M., et al.",
    description: "Advanced signal processing techniques for neural data...",
    tag: "Neural Engineering",
    link: "https://doi.org/example",
    linkLabel: "View article",
  },
];

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
    { name: "Asif", role: "Human Resource Management", image: "/Images/Asif.png" },
  ],
  designer: [
    { name: "Designer", role: "Designer & Public Relation", image: "/Images/passport-size_photo.jpg" },
  ],
  it: [
    { name: "IT Specialist", role: "Information Technology", image: "/Images/passport-size_photo.jpg" },
  ],
};

export default function Home() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(publications.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPublications = publications.slice(startIndex, startIndex + itemsPerPage);

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
              <div className="absolute inset-0 bg-accentTeal/10 animate-[ping_5s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <h2 className="text-4xl font-bold text-deepTeal mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal">
          About NEDAAS
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4 text-lg">
            <p>
              NEDAAS (Neural Engineering, Data Analytics & Applied Science) is a research laboratory
              dedicated to advancing knowledge at the intersection of neural engineering, data science,
              and applied research. Our mission extends beyond academia—we aim to create solutions that
              have real-world impact.
            </p>
            <p>
              Our research spans multiple domains including brain-computer interfaces, machine learning,
              healthcare analytics, and sustainable technology. We believe in the power of interdisciplinary
              collaboration and the importance of translating research into practical applications.
            </p>
            <p>
              Together, we aim to create a future where technology serves humanity, where data-driven
              insights lead to better decisions, and where innovation is accessible to all.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-midTeal/20">
            <h3 className="text-2xl font-bold text-deepTeal mb-4">Research Themes</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our research focuses on cutting-edge areas that bridge engineering, science, and societal needs.
            </p>
            <div className="flex flex-wrap gap-2">
              {researchThemes.map((theme) => (
                <span
                  key={theme}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-midTeal/10 to-accentTeal/10 text-midTeal text-sm font-medium border border-midTeal/20"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Section */}
      <section id="publications" className="py-20">
        <h2 className="text-4xl font-bold text-deepTeal mb-8 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-midTeal after:to-accentTeal">
          Publications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {paginatedPublications.map((pub, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-xs uppercase tracking-wider text-midTeal mb-2">{pub.meta}</div>
              <h3 className="text-lg font-bold text-deepTeal mb-2">{pub.title}</h3>
              <div className="text-sm text-gray-600 mb-3">{pub.authors}</div>
              <p className="text-sm text-gray-700 mb-4">{pub.description}</p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-midTeal/10 text-midTeal text-xs font-medium">
                  {pub.tag}
                </span>
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accentTeal hover:underline text-sm font-medium"
                >
                  {pub.linkLabel} →
                </a>
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            {page === totalPages ? "Back to first" : "See more ⟶"}
          </button>
        </div>
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

