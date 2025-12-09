// src/pages/dashboards/LeadDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getMyTeam,
  getMyConferences,
  createConference,
  updateConference,
  createMyMember,   // 🔹 NEW
  updateMyMember,   // 🔹 existing
} from "../../api/teamApi";
// src/pages/dashboards/LeadDashboard.jsx
import { createPublicationAsLead } from "../../api/publicationApi";

const STATUS_OPTIONS = ["submitted", "accepted", "presented", "published"];

export default function LeadDashboard() {
  const { firebaseUser } = useAuth();
  const [activeSection, setActiveSection] = useState("team");

  // TEAM
  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);
    // PUBLICATIONS (LEAD SUBMISSION)
  const [pubForm, setPubForm] = useState({
    meta: "",
    title: "",
    authors: "",
    description: "",
    tag: "",
    link: "",
    linkLabel: "View article",
  });
  const [pubMessage, setPubMessage] = useState(null);
  const [pubError, setPubError] = useState(null);
  const [pubLoading, setPubLoading] = useState(false);

  const handleLeadPubChange = (e) => {
    const { name, value } = e.target;
    setPubForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeadPubSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setPubMessage(null);
    setPubError(null);

    try {
      setPubLoading(true);
      const idToken = await firebaseUser.getIdToken();

      // backend will force status = "pending"
      await createPublicationAsLead(idToken, pubForm);

      setPubMessage(
        "Publication submitted successfully. It is now pending admin approval."
      );
      setPubForm({
        meta: "",
        title: "",
        authors: "",
        description: "",
        tag: "",
        link: "",
        linkLabel: "View article",
      });
    } catch (err) {
      console.error("Failed to submit publication:", err);
      setPubError(err.message || "Failed to submit publication");
    } finally {
      setPubLoading(false);
    }
  };


  // Member edit state (lead can edit their members)
  const [memberEdits, setMemberEdits] = useState({});
  const [memberEditSaving, setMemberEditSaving] = useState(false);
  const [memberEditError, setMemberEditError] = useState(null);
  const [memberEditMessage, setMemberEditMessage] = useState(null);

  // NEW MEMBER form state
  const [memberForm, setMemberForm] = useState({
    displayName: "",
    email: "",
    mobile: "",
    studentId: "",
    studentEmail: "",
  });
  const [memberSaving, setMemberSaving] = useState(false);
  const [memberCreateError, setMemberCreateError] = useState(null);
  const [memberCreateMessage, setMemberCreateMessage] = useState(null);

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

  // Conference edit state (lead can edit title/date/link/authors/status)
  const [editingConfId, setEditingConfId] = useState(null);
  const [editingConfForm, setEditingConfForm] = useState({
    title: "",
    date: "",
    link: "",
    status: "submitted",
    authorIds: [],
  });
  const [confEditSaving, setConfEditSaving] = useState(false);

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
      const data = await getMyConferences(idToken);
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

  /* ============================
   * MEMBER CREATE (NEW UNDER THIS LEAD)
   * ==========================*/

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setMemberCreateError(null);
    setMemberCreateMessage(null);

    try {
      setMemberSaving(true);
      const idToken = await firebaseUser.getIdToken();
      await createMyMember(idToken, memberForm);
      setMemberCreateMessage("New member added to your team.");
      setMemberForm({
        displayName: "",
        email: "",
        mobile: "",
        studentId: "",
        studentEmail: "",
      });
      await loadTeam();
    } catch (err) {
      console.error("Failed to create member:", err);
      setMemberCreateError(err.message || "Failed to create member");
    } finally {
      setMemberSaving(false);
    }
  };

  /* ============================
   * MEMBER EDIT (LEAD SIDE)
   * ==========================*/

  const startEditMember = (member) => {
    setMemberEditError(null);
    setMemberEditMessage(null);
    setMemberEdits((prev) => ({
      ...prev,
      [member._id]: {
        displayName: member.displayName || "",
        mobile: member.mobile || "",
        studentId: member.studentId || "",
        studentEmail: member.studentEmail || "",
      },
    }));
  };

  const handleMemberEditFieldChange = (memberId, field, value) => {
    setMemberEdits((prev) => ({
      ...prev,
      [memberId]: {
        ...(prev[memberId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveMemberEdit = async (memberId) => {
    if (!firebaseUser) return;
    const data = memberEdits[memberId];
    if (!data) return;

    setMemberEditError(null);
    setMemberEditMessage(null);

    try {
      setMemberEditSaving(true);
      const idToken = await firebaseUser.getIdToken();
      await updateMyMember(idToken, memberId, data);
      setMemberEditMessage("Member information updated.");
      setMemberEdits((prev) => {
        const copy = { ...prev };
        delete copy[memberId];
        return copy;
      });
      await loadTeam();
    } catch (err) {
      console.error("Failed to update member:", err);
      setMemberEditError(err.message || "Failed to update member");
    } finally {
      setMemberEditSaving(false);
    }
  };

  /* ============================
   * CONFERENCE CREATE / EDIT
   * ==========================*/

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
      await updateConference(idToken, confId, { status });
      setConfMessage(`Conference marked as ${status}.`);
      await loadConfs();
    } catch (err) {
      console.error("Failed to update status:", err);
      setConfsError(err.message || "Failed to update status");
    }
  };

  // Start editing an existing conference (including authors)
  const startEditConference = (conf) => {
    setConfsError(null);
    setConfMessage(null);
    setEditingConfId(conf._id);
    setEditingConfForm({
      title: conf.title || "",
      date: conf.date ? conf.date.slice(0, 10) : "",
      link: conf.link || "",
      status: conf.status || "submitted",
      authorIds:
        conf.authors && conf.authors.length > 0
          ? conf.authors.map((a) => a._id)
          : [],
    });
  };

  const handleEditConfChange = (e) => {
    const { name, value } = e.target;
    setEditingConfForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditConfAuthorsChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((o) => o.value);
    setEditingConfForm((prev) => ({ ...prev, authorIds: values }));
  };

  const handleConfEditSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser || !editingConfId) return;

    setConfsError(null);
    setConfMessage(null);

    try {
      setConfEditSaving(true);
      const idToken = await firebaseUser.getIdToken();
      await updateConference(idToken, editingConfId, {
        title: editingConfForm.title,
        date: editingConfForm.date,
        link: editingConfForm.link,
        status: editingConfForm.status,
        authorIds: editingConfForm.authorIds,
      });
      setConfMessage("Conference updated successfully.");
      setEditingConfId(null);
      setEditingConfForm({
        title: "",
        date: "",
        link: "",
        status: "submitted",
        authorIds: [],
      });
      await loadConfs();
    } catch (err) {
      console.error("Failed to update conference:", err);
      setConfsError(err.message || "Failed to update conference");
    } finally {
      setConfEditSaving(false);
    }
  };

  const cancelConfEdit = () => {
    setEditingConfId(null);
    setEditingConfForm({
      title: "",
      date: "",
      link: "",
      status: "submitted",
      authorIds: [],
    });
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
            { id: "addPublication", label: "Add Publication" },
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
              <span className="hidden group-hover:inline">{item.label}</span>
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
              View, add, and update the students assigned under your lead role.
            </p>

            {teamError && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {teamError}
              </div>
            )}

            {memberCreateError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {memberCreateError}
              </div>
            )}

            {memberCreateMessage && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {memberCreateMessage}
              </div>
            )}

            {memberEditError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {memberEditError}
              </div>
            )}

            {memberEditMessage && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {memberEditMessage}
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

                {/* Add New Member Form */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-5">
                  <h2 className="text-lg font-semibold text-deepTeal mb-2">
                    Add New Member to Your Team
                  </h2>
                  <p className="text-xs text-gray-600 mb-3">
                    You can add a new member under your lead. If a user with
                    this email already exists, they will be attached to your
                    team (if not under another lead).
                  </p>

                  <form
                    onSubmit={handleCreateMember}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs"
                  >
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-0.5">
                        Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={memberForm.displayName}
                        onChange={handleMemberFormChange}
                        className="w-full px-2 py-1 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-0.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={memberForm.email}
                        onChange={handleMemberFormChange}
                        required
                        className="w-full px-2 py-1 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-0.5">
                        Mobile
                      </label>
                      <input
                        type="text"
                        name="mobile"
                        value={memberForm.mobile}
                        onChange={handleMemberFormChange}
                        className="w-full px-2 py-1 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-0.5">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="studentId"
                        value={memberForm.studentId}
                        onChange={handleMemberFormChange}
                        className="w-full px-2 py-1 rounded border border-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-600 mb-0.5">
                        Student Email
                      </label>
                      <input
                        type="email"
                        name="studentEmail"
                        value={memberForm.studentEmail}
                        onChange={handleMemberFormChange}
                        className="w-full px-2 py-1 rounded border border-gray-300"
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <button
                        type="submit"
                        disabled={memberSaving}
                        className="px-4 py-1.5 rounded-full bg-midTeal text-white text-[11px] hover:shadow-md disabled:opacity-60"
                      >
                        {memberSaving ? "Saving..." : "Add Member"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Members List */}
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
                      {team.members.map((m) => {
                        const edit = memberEdits[m._id];
                        const isEditing = !!edit;

                        return (
                          <div
                            key={m._id}
                            className="border border-gray-100 rounded-xl px-3 py-3 text-xs bg-slate-50"
                          >
                            {isEditing ? (
                              <>
                                <div className="mb-1">
                                  <label className="block text-[11px] text-gray-600 mb-0.5">
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    value={edit.displayName}
                                    onChange={(e) =>
                                      handleMemberEditFieldChange(
                                        m._id,
                                        "displayName",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                  />
                                </div>
                                <div className="mb-1">
                                  <label className="block text-[11px] text-gray-600 mb-0.5">
                                    Student ID
                                  </label>
                                  <input
                                    type="text"
                                    value={edit.studentId}
                                    onChange={(e) =>
                                      handleMemberEditFieldChange(
                                        m._id,
                                        "studentId",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                  />
                                </div>
                                <div className="mb-1">
                                  <label className="block text-[11px] text-gray-600 mb-0.5">
                                    Mobile
                                  </label>
                                  <input
                                    type="text"
                                    value={edit.mobile}
                                    onChange={(e) =>
                                      handleMemberEditFieldChange(
                                        m._id,
                                        "mobile",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                  />
                                </div>
                                <div className="mb-2">
                                  <label className="block text-[11px] text-gray-600 mb-0.5">
                                    Student Email
                                  </label>
                                  <input
                                    type="email"
                                    value={edit.studentEmail}
                                    onChange={(e) =>
                                      handleMemberEditFieldChange(
                                        m._id,
                                        "studentEmail",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveMemberEdit(m._id)}
                                    disabled={memberEditSaving}
                                    className="px-3 py-1 rounded-full bg-midTeal text-white text-[11px]"
                                  >
                                    {memberEditSaving ? "Saving..." : "Save"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setMemberEdits((prev) => {
                                        const copy = { ...prev };
                                        delete copy[m._id];
                                        return copy;
                                      })
                                    }
                                    className="px-3 py-1 rounded-full border border-gray-300 text-[11px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="font-semibold text-deepTeal mb-1">
                                  {m.displayName ||
                                    m.studentEmail ||
                                    m.email ||
                                    "Unnamed Member"}
                                </div>
                                <div className="text-[11px] text-gray-600">
                                  ID: {m.studentId || "—"}
                                </div>
                                <div className="text-[11px] text-gray-600">
                                  Mobile: {m.mobile || "—"}
                                </div>
                                <div className="text-[11px] text-gray-600">
                                  Email: {m.studentEmail || m.email || "—"}
                                </div>
                                <div className="flex justify-end mt-2">
                                  <button
                                    type="button"
                                    onClick={() => startEditMember(m)}
                                    className="px-3 py-1 rounded-full border border-midTeal text-midTeal text-[11px] hover:bg-midTeal/10"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
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
                  team (multiple selection supported).
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
                          {m.displayName || m.studentEmail || m.email} (
                          {m.studentId || m.mobile || "no id"})
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
                    {confs.map((conf) => {
                      const isEditing = editingConfId === conf._id;

                      if (isEditing) {
                        return (
                          <form
                            key={conf._id}
                            onSubmit={handleConfEditSubmit}
                            className="border border-gray-100 rounded-xl p-3 text-xs bg-slate-50 flex flex-col gap-2"
                          >
                            <div>
                              <label className="block text-[11px] text-gray-600 mb-0.5">
                                Title
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={editingConfForm.title}
                                onChange={handleEditConfChange}
                                className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] text-gray-600 mb-0.5">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  name="date"
                                  value={editingConfForm.date}
                                  onChange={handleEditConfChange}
                                  className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] text-gray-600 mb-0.5">
                                  Status
                                </label>
                                <select
                                  name="status"
                                  value={editingConfForm.status}
                                  onChange={handleEditConfChange}
                                  className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                                >
                                  {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-600 mb-0.5">
                                Conference Link
                              </label>
                              <input
                                type="url"
                                name="link"
                                value={editingConfForm.link}
                                onChange={handleEditConfChange}
                                className="w-full px-2 py-1 rounded border border-gray-300 text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-600 mb-0.5">
                                Authors (from your team)
                              </label>
                              <select
                                multiple
                                value={editingConfForm.authorIds}
                                onChange={handleEditConfAuthorsChange}
                                className="w-full px-2 py-1 rounded border border-gray-300 text-xs h-20"
                              >
                                {team?.members &&
                                  team.members.map((m) => (
                                    <option key={m._id} value={m._id}>
                                      {m.displayName ||
                                        m.studentEmail ||
                                        m.email}{" "}
                                      ({m.studentId || m.mobile || "no id"})
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div className="flex gap-2 justify-end mt-1">
                              <button
                                type="submit"
                                disabled={confEditSaving}
                                className="px-3 py-1 rounded-full bg-midTeal text-white text-[11px]"
                              >
                                {confEditSaving ? "Saving..." : "Save"}
                              </button>
                              <button
                                type="button"
                                onClick={cancelConfEdit}
                                className="px-3 py-1 rounded-full border border-gray-300 text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        );
                      }

                      // View mode
                      return (
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
                                    .map(
                                      (a) =>
                                        a.displayName ||
                                        a.name ||
                                        a.email ||
                                        "Unnamed"
                                    )
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
                                onClick={() =>
                                  handleStatusChange(conf._id, s)
                                }
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

                          <div className="flex justify-end mt-1">
                            <button
                              type="button"
                              onClick={() => startEditConference(conf)}
                              className="px-3 py-1 rounded-full border border-midTeal text-midTeal text-[11px] hover:bg-midTeal/10"
                            >
                              Edit Details / Authors
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
                {/* ADD PUBLICATION (LEAD) */}
        {activeSection === "addPublication" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Submit Publication
            </h1>
            <p className="text-gray-700 mb-6">
              Submit your team&apos;s publication to NEDAAS.{" "}
              <span className="font-semibold">
                All submissions will be marked as &quot;pending&quot; until an
                admin reviews and approves them.
              </span>
            </p>

            {pubMessage && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {pubMessage}
              </div>
            )}
            {pubError && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {pubError}
              </div>
            )}

            <form
              onSubmit={handleLeadPubSubmit}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-w-2xl space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meta (e.g., 2025 • Conference)
                  </label>
                  <input
                    type="text"
                    name="meta"
                    value={pubForm.meta}
                    onChange={handleLeadPubChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tag (e.g., Healthcare, ML, Neural Engineering)
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={pubForm.tag}
                    onChange={handleLeadPubChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={pubForm.title}
                  onChange={handleLeadPubChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Authors
                </label>
                <input
                  type="text"
                  name="authors"
                  value={pubForm.authors}
                  onChange={handleLeadPubChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  placeholder="e.g., A. Rahman, B. Karim, ..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description / Abstract (short)
                </label>
                <textarea
                  name="description"
                  value={pubForm.description}
                  onChange={handleLeadPubChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                />
              </div>

              <div className="grid md:grid-cols-[2fr_1fr] gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Link (DOI / URL)
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={pubForm.link}
                    onChange={handleLeadPubChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                    placeholder="https://doi.org/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Link Label
                  </label>
                  <input
                    type="text"
                    name="linkLabel"
                    value={pubForm.linkLabel}
                    onChange={handleLeadPubChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pubLoading}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
              >
                {pubLoading ? "Submitting..." : "Submit Publication"}
              </button>
            </form>
          </section>
        )}

      </div>
    </div>
  );
}
