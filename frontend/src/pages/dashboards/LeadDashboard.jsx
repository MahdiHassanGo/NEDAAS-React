// src/pages/dashboards/LeadDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getMyTeam,
  getMyConferences,
  createConference,
  updateConference,
} from "../../api/teamApi";


const STATUS_OPTIONS = ["submitted", "accepted", "presented", "published"];

export default function LeadDashboard() {
  const { firebaseUser } = useAuth();
  const [activeSection, setActiveSection] = useState("team");

  // TEAM
  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);

  // CONFERENCES
  const [confs, setConfs] = useState([]);
  const [confsLoading, setConfsLoading] = useState(true);
  const [confsError, setConfsError] = useState(null);
  const [confMessage, setConfMessage] = useState(null);

  const [confForm, setConfForm] = useState({
    title: "",
    date: "",
    link: "",
    authorIds: [],
  });
  const [confSaving, setConfSaving] = useState(false);

  const loadTeam = async () => {
    if (!firebaseUser) return;
    try {
      setTeamLoading(true);
      setTeamError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getMyTeam(idToken);
      setTeam(data);
    } catch (err) {
      console.error("Failed to load team:", err);
      setTeamError(err.message || "Failed to load team");
    } finally {
      setTeamLoading(false);
    }
  };

 const loadConfs = async () => {
  if (!firebaseUser) return;
  try {
    setConfsLoading(true);
    setConfsError(null);
    const idToken = await firebaseUser.getIdToken();
    const data = await getMyConferences(idToken);   // ✅ from teamApi.js
    setConfs(data);
  } catch (err) {
    console.error("Failed to load conferences:", err);
    setConfsError(err.message || "Failed to load conferences");
  } finally {
    setConfsLoading(false);
  }
};


  useEffect(() => {
    if (!firebaseUser) return;
    loadTeam();
    loadConfs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser]);

  const handleConfChange = (e) => {
    const { name, value } = e.target;
    setConfForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((o) => o.value);
    setConfForm((prev) => ({ ...prev, authorIds: values }));
  };

  const handleConfSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setConfMessage(null);
    setConfsError(null);

    try {
      setConfSaving(true);
      const idToken = await firebaseUser.getIdToken();
      await createConference(idToken, confForm);
      setConfMessage("Conference created successfully.");
      setConfForm({
        title: "",
        date: "",
        link: "",
        authorIds: [],
      });
      await loadConfs();
    } catch (err) {
      console.error("Failed to create conference:", err);
      setConfsError(err.message || "Failed to create conference");
    } finally {
      setConfSaving(false);
    }
  };

  const handleStatusChange = async (confId, status) => {
  if (!firebaseUser) return;
  try {
    setConfsError(null);
    setConfMessage(null);
    const idToken = await firebaseUser.getIdToken();
    await updateConference(idToken, confId, { status });   // ✅
    setConfMessage(`Conference marked as ${status}.`);
    await loadConfs();
  } catch (err) {
    console.error("Failed to update status:", err);
    setConfsError(err.message || "Failed to update status");
  }
};


  return (
    <div className="flex min-h-[calc(100vh-4rem)] pt-4">
      {/* Hover Drawer */}
      <div className="group relative">
        <div className="h-full bg-deepTeal text-white w-16 group-hover:w-64 transition-all duration-300 flex flex-col py-6 overflow-hidden">
          <div className="px-4 mb-8 whitespace-nowrap">
            <span className="hidden group-hover:inline font-semibold text-lg">
              Lead Panel
            </span>
            <span className="inline group-hover:hidden font-semibold text-xl">
              L
            </span>
          </div>

          {[
            { id: "team", label: "Manage Team" },
            { id: "conference", label: "Manage Conference" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 px-4 py-2 text-sm whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? "bg-white/15 font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-accentTeal" />
              <span className="hidden group-hover:inline">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50">
        {/* MANAGE TEAM */}
        {activeSection === "team" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Manage Team
            </h1>
            <p className="text-gray-700 mb-4">
              View the students assigned under your lead role.
            </p>

            {teamError && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {teamError}
              </div>
            )}

            {teamLoading && (
              <div className="text-gray-500 text-sm">Loading team...</div>
            )}

            {!teamLoading && team && (
              <>
                <div className="mb-4">
                  <div className="text-xs uppercase tracking-wider text-midTeal">
                    Lead
                  </div>
                  <div className="text-xl font-semibold text-deepTeal">
                    {team.lead?.displayName || team.lead?.name || "You"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {team.lead?.email}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-deepTeal">
                      Team Members
                    </h2>
                    <span className="text-xs px-2 py-1 rounded-full bg-midTeal/10 text-midTeal border border-midTeal/20">
                      Total: {team.members?.length || 0}
                    </span>
                  </div>

                  {!team.members || team.members.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No members assigned to you yet.
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {team.members.map((m) => (
                        <div
                          key={m._id}
                          className="border border-gray-100 rounded-xl px-3 py-3 text-xs bg-slate-50"
                        >
                          <div className="font-semibold text-deepTeal mb-1">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            ID: {m.studentId || "—"}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            Mobile: {m.mobile || "—"}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            Email: {m.studentEmail || "—"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {/* MANAGE CONFERENCE */}
        {activeSection === "conference" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Manage Conference
            </h1>
            <p className="text-gray-700 mb-4">
              Create and track conference submissions for your team. Authors
              can only be selected from your assigned members.
            </p>

            {confMessage && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {confMessage}
              </div>
            )}
            {confsError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {confsError}
              </div>
            )}

            <div className="grid lg:grid-cols-[1.3fr_1.7fr] gap-6">
              {/* Create Conference Form */}
              <form
                onSubmit={handleConfSubmit}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 space-y-3"
              >
                <h2 className="text-lg font-semibold text-deepTeal mb-1">
                  Add Conference
                </h2>
                <p className="text-xs text-gray-600 mb-2">
                  Fill in the conference details and choose authors from your
                  team.
                </p>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={confForm.title}
                    onChange={handleConfChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Conference Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={confForm.date}
                    onChange={handleConfChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Conference Link
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={confForm.link}
                    onChange={handleConfChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Authors (from your team)
                  </label>
                  <select
                    multiple
                    value={confForm.authorIds}
                    onChange={handleAuthorsChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50 h-28"
                  >
                    {team?.members &&
                      team.members.map((m) => (
                        <option key={m._id} value={m._id}>
                          {m.name} ({m.studentId || m.studentEmail || m.mobile})
                        </option>
                      ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Hold Ctrl/Command to select multiple authors.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={confSaving}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
                >
                  {confSaving ? "Saving..." : "Create Conference"}
                </button>
              </form>

              {/* Conferences List */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-deepTeal">
                    Your Conferences
                  </h2>
                  <button
                    onClick={loadConfs}
                    className="text-xs px-3 py-1 rounded-full border border-midTeal text-midTeal hover:bg-midTeal hover:text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {confsLoading && (
                  <div className="text-sm text-gray-500">
                    Loading conferences...
                  </div>
                )}

                {!confsLoading && confs.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No conferences created yet.
                  </div>
                )}

                {!confsLoading && confs.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {confs.map((conf) => (
                      <div
                        key={conf._id}
                        className="border border-gray-100 rounded-xl p-3 text-xs bg-slate-50 flex flex-col gap-2"
                      >
                        <div>
                          <div className="font-semibold text-deepTeal line-clamp-2">
                            {conf.title}
                          </div>
                          <div className="text-[11px] text-gray-600">
                            {conf.date
                              ? new Date(conf.date).toLocaleDateString()
                              : "No date"}
                          </div>
                        </div>

                        <div>
                          <span className="text-[11px] font-semibold text-gray-700">
                            Authors:
                          </span>
                          <div className="text-[11px] text-gray-600">
                            {conf.authors && conf.authors.length > 0
                              ? conf.authors
                                  .map((a) => a.displayName || a.name || a.email)
                                  .join(", ")
                              : "Not set"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-600">
                            Status:
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide ${
                              conf.status === "published"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : conf.status === "presented"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : conf.status === "accepted"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {conf.status}
                          </span>
                        </div>

                        {conf.link && (
                          <a
                            href={conf.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-accentTeal hover:underline"
                          >
                            View conference →
                          </a>
                        )}

                        <div className="flex flex-wrap gap-1 mt-1">
                          {STATUS_OPTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(conf._id, s)}
                              disabled={conf.status === s}
                              className={`px-2 py-1 rounded-full text-[10px] border ${
                                conf.status === s
                                  ? "bg-midTeal text-white border-midTeal cursor-default"
                                  : "border-midTeal/40 text-midTeal hover:bg-midTeal/10"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
