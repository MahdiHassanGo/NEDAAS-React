// src/pages/dashboards/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  getAllUsers,
  updateUserRole,
  createManualUser,
  createPublication,
  getAllPublications,
  updatePublicationStatus,
  updatePublication,
} from "../../api/adminApi";

import {
  getAllTeams,
  assignMemberToLead,
  updateMemberInfo,
  getAllConferences,
  removeMemberFromLead,
  createConferenceForLead,
  updateConferenceByAdmin,
  deleteConferenceByAdmin,
} from "../../api/teamApi";

const ROLES = ["member", "lead", "advisor", "director", "admin"];
const ROOT_ADMIN_EMAIL = "mahdiasif78@gmail.com";

export default function AdminDashboard() {
  const { firebaseUser } = useAuth();
  const [activeSection, setActiveSection] = useState("addUser");

  // --------- USER MANAGEMENT ----------
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);
  const [userActionMessage, setUserActionMessage] = useState(null);

  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("member");

  // --------- PUBLICATIONS (ADD) ----------
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

  // --------- PUBLICATIONS (REVIEW/EDIT) ----------
  const [publications, setPublications] = useState([]);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [publicationsError, setPublicationsError] = useState(null);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [editingPub, setEditingPub] = useState(null);
  const [editForm, setEditForm] = useState({
    meta: "",
    title: "",
    authors: "",
    description: "",
    tag: "",
    link: "",
    linkLabel: "View article",
  });
  const [editLoading, setEditLoading] = useState(false);

  // --------- TEAMS (Admin view) ----------
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState(null);

  // --------- CONFERENCES (Admin view) ----------
  const [allConfs, setAllConfs] = useState([]);
  const [allConfsLoading, setAllConfsLoading] = useState(true);
  const [allConfsError, setAllConfsError] = useState(null);

  // --------- MEMBER CREATE / EDIT (TEAM SECTION) ----------
  const [memberForm, setMemberForm] = useState({
    leadId: "",
    name: "",
    email: "",
    mobile: "",
    studentId: "",
    studentEmail: "",
  });
  const [memberSaving, setMemberSaving] = useState(false);
  const [memberMessage, setMemberMessage] = useState(null);
  const [memberError, setMemberError] = useState(null);

  // per-member edit values (keyed by memberId)
  const [memberEdits, setMemberEdits] = useState({});
  const [memberEditSaving, setMemberEditSaving] = useState(false);

  // Member create form visibility per lead
  const [openLeadForMemberForm, setOpenLeadForMemberForm] = useState(null);

  // --------- CONFERENCE FORMS / EDIT (TEAM SECTION) ----------
  // New conference form (per lead)
  const [openLeadForNewConf, setOpenLeadForNewConf] = useState(null);
  const [newConfForm, setNewConfForm] = useState({
    title: "",
    date: "",
    link: "",
    status: "submitted",
  });
  const [newConfSaving, setNewConfSaving] = useState(false);
  const [newConfError, setNewConfError] = useState(null);
  const [newConfMessage, setNewConfMessage] = useState(null);

  // Edit existing conference (per conference id)
  const [confEdits, setConfEdits] = useState({});
  const [confEditSaving, setConfEditSaving] = useState(false);
  const [confEditError, setConfEditError] = useState(null);

  // ---------- LOADERS ----------

  const refreshUsers = async () => {
    if (!firebaseUser) return;
    try {
      setUsersLoading(true);
      setUsersError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getAllUsers(idToken);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsersError(err.message || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const refreshPublications = async () => {
    if (!firebaseUser) return;
    try {
      setPublicationsLoading(true);
      setPublicationsError(null);
      setReviewMessage(null);

      const idToken = await firebaseUser.getIdToken();
      const data = await getAllPublications(idToken);
      setPublications(data);
    } catch (err) {
      console.error("Failed to load publications:", err);
      setPublicationsError(err.message || "Failed to load publications");
    } finally {
      setPublicationsLoading(false);
    }
  };

  const refreshTeams = async () => {
    if (!firebaseUser) return;
    try {
      setTeamsLoading(true);
      setTeamsError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getAllTeams(idToken);
      setTeams(data);
    } catch (err) {
      console.error("Failed to load teams:", err);
      setTeamsError(err.message || "Failed to load teams");
    } finally {
      setTeamsLoading(false);
    }
  };

  const refreshAllConferences = async () => {
    if (!firebaseUser) return;
    try {
      setAllConfsLoading(true);
      setAllConfsError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getAllConferences(idToken);
      setAllConfs(data);
    } catch (err) {
      console.error("Failed to load conferences:", err);
      setAllConfsError(err.message || "Failed to load conferences");
    } finally {
      setAllConfsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "addUser") {
      refreshUsers();
    }
    if (activeSection === "addPublication") {
      // no list needed
    }
    if (activeSection === "reviewPublication") {
      refreshPublications();
    }
    if (activeSection === "reviewInformation") {
      refreshTeams();
      refreshAllConferences();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, firebaseUser]);

  // ---------- USER MANAGEMENT HANDLERS ----------

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUserActionMessage(null);
      const idToken = await firebaseUser.getIdToken();
      await updateUserRole(idToken, userId, newRole);
      setUserActionMessage(`Role updated to ${newRole}`);
      await refreshUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
      setUserActionMessage("Failed to update role: " + err.message);
    }
  };

  const handleManualUserSubmit = async (e) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    try {
      setUserActionMessage(null);
      const idToken = await firebaseUser.getIdToken();
      await createManualUser(idToken, {
        email: manualEmail.trim(),
        displayName: manualName.trim() || undefined,
        role: manualRole,
      });
      setUserActionMessage("User added/updated successfully");
      setManualEmail("");
      setManualName("");
      setManualRole("member");
      await refreshUsers();
    } catch (err) {
      console.error("Failed to add user:", err);
      setUserActionMessage("Failed to add user: " + err.message);
    }
  };

  // ---------- PUBLICATION HANDLERS (ADD) ----------

  const handlePubChange = (e) => {
    const { name, value } = e.target;
    setPubForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePubSubmit = async (e) => {
    e.preventDefault();
    setPubMessage(null);
    setPubError(null);

    try {
      setPubLoading(true);
      const idToken = await firebaseUser.getIdToken();
      await createPublication(idToken, pubForm);
      setPubMessage("Publication added and approved successfully.");
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
      console.error("Failed to add publication:", err);
      setPubError(err.message || "Failed to add publication");
    } finally {
      setPubLoading(false);
    }
  };

  // ---------- PUBLICATION HANDLERS (REVIEW/EDIT) ----------

  const handleStatusChange = async (pubId, status) => {
    try {
      setReviewMessage(null);
      setPublicationsError(null);
      const idToken = await firebaseUser.getIdToken();
      await updatePublicationStatus(idToken, pubId, status);
      setReviewMessage(`Publication marked as ${status}.`);
      await refreshPublications();
    } catch (err) {
      console.error("Failed to update publication status:", err);
      setPublicationsError(err.message || "Failed to update status");
    }
  };

  const handleEditClick = (pub) => {
    setEditingPub(pub);
    setEditForm({
      meta: pub.meta || "",
      title: pub.title || "",
      authors: pub.authors || "",
      description: pub.description || "",
      tag: pub.tag || "",
      link: pub.link || "",
      linkLabel: pub.linkLabel || "View article",
    });
    setReviewMessage(null);
    setPublicationsError(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingPub) return;

    try {
      setEditLoading(true);
      setPublicationsError(null);
      const idToken = await firebaseUser.getIdToken();
      await updatePublication(idToken, editingPub._id, editForm);

      setReviewMessage("Publication updated successfully.");
      setEditingPub(null);
      await refreshPublications();
    } catch (err) {
      console.error("Failed to update publication:", err);
      setPublicationsError(err.message || "Failed to update publication");
    } finally {
      setEditLoading(false);
    }
  };

  // ---------- MEMBER FORM HANDLERS (TEAM SECTION) ----------

  const handleMemberFormChange = (e) => {
    const { name, value } = e.target;
    setMemberForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateMemberUnderLead = async (e) => {
    e.preventDefault();
    setMemberMessage(null);
    setMemberError(null);

    if (!firebaseUser) return;

    if (!memberForm.leadId || !memberForm.email.trim()) {
      setMemberError("Lead and email are required.");
      return;
    }

    try {
      setMemberSaving(true);
      const idToken = await firebaseUser.getIdToken();

      // 1) create or update the user as MEMBER
      const createdUser = await createManualUser(idToken, {
        email: memberForm.email.trim(),
        displayName: memberForm.name.trim() || undefined,
        role: "member",
      });

      // 2) update extra member info
      await updateMemberInfo(idToken, createdUser._id, {
        mobile: memberForm.mobile || undefined,
        studentId: memberForm.studentId || undefined,
        studentEmail:
          memberForm.studentEmail || memberForm.email.trim() || undefined,
      });

      // 3) assign under the chosen lead
      await assignMemberToLead(idToken, {
        memberId: createdUser._id,
        leadId: memberForm.leadId,
      });

      setMemberMessage("Member created and assigned under the lead.");
      setMemberForm({
        leadId: "",
        name: "",
        email: "",
        mobile: "",
        studentId: "",
        studentEmail: "",
      });
      setOpenLeadForMemberForm(null);

      await refreshTeams();
    } catch (err) {
      console.error("Failed to create member under lead:", err);
      setMemberError(err.message || "Failed to create member under lead.");
    } finally {
      setMemberSaving(false);
    }
  };

  const startEditMember = (m) => {
    setMemberEdits((prev) => ({
      ...prev,
      [m._id]: {
        displayName: m.displayName || m.name || "",
        mobile: m.mobile || "",
        studentId: m.studentId || "",
        studentEmail: m.studentEmail || "",
      },
    }));
  };

  const handleMemberEditChange = (memberId, field, value) => {
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

    setMemberEditSaving(true);
    setMemberError(null);
    setMemberMessage(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      await updateMemberInfo(idToken, memberId, data);
      setMemberMessage("Member details updated.");
      await refreshTeams();
      setMemberEdits((prev) => {
        const copy = { ...prev };
        delete copy[memberId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update member:", err);
      setMemberError(err.message || "Failed to update member.");
    } finally {
      setMemberEditSaving(false);
    }
  };

  const handleAssignMemberClick = (leadId) => {
    setMemberForm((prev) => ({ ...prev, leadId }));
    setOpenLeadForMemberForm((prev) => (prev === leadId ? null : leadId));
  };

  const handleRemoveMember = async (memberId) => {
    if (!firebaseUser) return;
    setMemberError(null);
    setMemberMessage(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      await removeMemberFromLead(idToken, memberId);
      setMemberMessage("Member removed from this lead.");
      await refreshTeams();
    } catch (err) {
      console.error("Failed to remove member:", err);
      setMemberError(err.message || "Failed to remove member.");
    }
  };

  // ---------- CONFERENCE HANDLERS (TEAM SECTION) ----------

  const handleNewConfChange = (e) => {
    const { name, value } = e.target;
    setNewConfForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateConferenceForLead = async (e, leadId, team) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setNewConfError(null);
    setNewConfMessage(null);

    try {
      setNewConfSaving(true);
      const idToken = await firebaseUser.getIdToken();

      // Optional: make all team members authors
      const authorIds =
        team.members && team.members.length > 0
          ? team.members.map((m) => m._id)
          : [];

      await createConferenceForLead(idToken, {
        title: newConfForm.title,
        date: newConfForm.date,
        link: newConfForm.link,
        status: newConfForm.status,
        leadId,
        authorIds,
      });

      setNewConfMessage("Conference created for this lead.");
      setNewConfForm({
        title: "",
        date: "",
        link: "",
        status: "submitted",
      });
      setOpenLeadForNewConf(null);
      await refreshAllConferences();
    } catch (err) {
      console.error("Failed to create conference:", err);
      setNewConfError(err.message || "Failed to create conference");
    } finally {
      setNewConfSaving(false);
    }
  };

  const startEditConference = (conf) => {
    setConfEdits((prev) => ({
      ...prev,
      [conf._id]: {
        title: conf.title || "",
        date: conf.date ? conf.date.slice(0, 10) : "",
        link: conf.link || "",
        status: conf.status || "submitted",
      },
    }));
  };

  const handleConfEditChange = (confId, field, value) => {
    setConfEdits((prev) => ({
      ...prev,
      [confId]: {
        ...(prev[confId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveConfEdit = async (confId) => {
    if (!firebaseUser) return;
    const data = confEdits[confId];
    if (!data) return;

    setConfEditSaving(true);
    setConfEditError(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      await updateConferenceByAdmin(idToken, confId, data);
      await refreshAllConferences();
      setConfEdits((prev) => {
        const copy = { ...prev };
        delete copy[confId];
        return copy;
      });
    } catch (err) {
      console.error("Failed to update conference:", err);
      setConfEditError(err.message || "Failed to update conference");
    } finally {
      setConfEditSaving(false);
    }
  };

  const handleDeleteConference = async (confId) => {
    if (!firebaseUser) return;
    setConfEditError(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      await deleteConferenceByAdmin(idToken, confId);
      await refreshAllConferences();
    } catch (err) {
      console.error("Failed to delete conference:", err);
      setConfEditError(err.message || "Failed to delete conference");
    }
  };

  // ---------- RENDER ----------

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pt-4">
      {/* Hover Drawer */}
      <div className="group relative">
        <div className="h-full bg-deepTeal text-white w-16 group-hover:w-64 transition-all duration-300 flex flex-col py-6 overflow-hidden">
          <div className="px-4 mb-8 whitespace-nowrap">
            <span className="hidden group-hover:inline font-semibold text-lg">
              Admin Panel
            </span>
            <span className="inline group-hover:hidden font-semibold text-xl">
              A
            </span>
          </div>

          {[
            { id: "addUser", label: "Add User" },
            { id: "addPublication", label: "Add Publication" },
            { id: "reviewPublication", label: "Review Publication" },
            { id: "reviewInformation", label: "Manage Team" },
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
        {/* ========== ADD USER SECTION ========== */}
        {activeSection === "addUser" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              User Management
            </h1>
            <p className="text-gray-700 mb-6">
              View registered users, change their roles, or manually add users
              by email.
            </p>

            {userActionMessage && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-midTeal/10 text-midTeal border border-midTeal/30">
                {userActionMessage}
              </div>
            )}

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-deepTeal">
                    Registered Users
                  </h2>
                  <button
                    onClick={refreshUsers}
                    className="text-xs px-3 py-1 rounded-full border border-midTeal text-midTeal hover:bg-midTeal hover:text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {usersLoading && (
                  <div className="text-gray-500 text-sm mt-3">
                    Loading users...
                  </div>
                )}
                {usersError && !usersLoading && (
                  <div className="text-red-600 text-sm mt-3">
                    {usersError}
                  </div>
                )}

                {!usersLoading && !usersError && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Current Role
                          </th>
                          <th className="py-2 font-semibold text-gray-700">
                            Change Role
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => {
                          const isRootAdmin = u.email === ROOT_ADMIN_EMAIL;

                          return (
                            <tr
                              key={u._id}
                              className="border-b border-gray-100"
                            >
                              <td className="py-2 pr-4 text-xs md:text-sm">
                                {u.email}
                              </td>
                              <td className="py-2 pr-4 text-xs md:text-sm capitalize">
                                {isRootAdmin ? (
                                  <span className="inline-flex items-center gap-1">
                                    <span>admin</span>
                                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-300">
                                      locked
                                    </span>
                                  </span>
                                ) : (
                                  u.role || "member"
                                )}
                              </td>
                              <td className="py-2">
                                <div className="flex flex-wrap gap-1">
                                  {ROLES.map((r) => {
                                    const isCurrent = u.role === r;
                                    const disabled =
                                      isRootAdmin && r !== "admin";

                                    return (
                                      <button
                                        key={r}
                                        onClick={() =>
                                          !disabled &&
                                          handleRoleChange(u._id, r)
                                        }
                                        disabled={disabled}
                                        className={`px-2 py-1 rounded-full text-xs border ${
                                          disabled
                                            ? "border-gray-300 text-gray-400 cursor-not-allowed opacity-60"
                                            : isCurrent
                                            ? "bg-midTeal text-white border-midTeal"
                                            : "border-midTeal/40 text-midTeal hover:bg-midTeal/10"
                                        }`}
                                      >
                                        {r}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {users.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="py-4 text-gray-500 text-sm"
                            >
                              No users found yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Manual Add User */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <h2 className="text-xl font-semibold text-deepTeal mb-3">
                  Add User Manually
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                  Assign a role to an email even before they log in. When they
                  sign in with this email, they will see the corresponding
                  dashboard.
                </p>
                <form onSubmit={handleManualUserSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name (optional)
                    </label>
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={manualRole}
                      onChange={(e) => setManualRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-sm font-medium hover:shadow-lg transition-shadow"
                  >
                    Save User
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* ========== ADD PUBLICATION SECTION ========== */}
        {activeSection === "addPublication" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Add Publication
            </h1>
            <p className="text-gray-700 mb-6">
              Add or update NEDAAS publications. Only admin-approved
              publications appear on the homepage.
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
              onSubmit={handlePubSubmit}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 max-w-2xl space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meta (e.g., 2023 • Journal)
                  </label>
                  <input
                    type="text"
                    name="meta"
                    value={pubForm.meta}
                    onChange={handlePubChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Tag (e.g., Healthcare, Neural Engineering)
                  </label>
                  <input
                    type="text"
                    name="tag"
                    value={pubForm.tag}
                    onChange={handlePubChange}
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
                  onChange={handlePubChange}
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
                  onChange={handlePubChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={pubForm.description}
                  onChange={handlePubChange}
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
                    onChange={handlePubChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
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
                    onChange={handlePubChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pubLoading}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-sm font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
              >
                {pubLoading ? "Saving..." : "Save Publication"}
              </button>
            </form>
          </section>
        )}

        {/* ========== REVIEW PUBLICATION SECTION ========== */}
        {activeSection === "reviewPublication" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Review Publication
            </h1>
            <p className="text-gray-700 mb-4">
              Manage all publications in the system. You can approve, reject, or
              edit any entry. Only{" "}
              <span className="font-semibold">approved</span> publications
              appear on the homepage.
            </p>

            {reviewMessage && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {reviewMessage}
              </div>
            )}
            {publicationsError && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {publicationsError}
              </div>
            )}

            <div className="grid lg:grid-cols-[2fr_1.2fr] gap-6">
              {/* Publications Table */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-deepTeal">
                    All Publications
                  </h2>
                  <button
                    onClick={refreshPublications}
                    className="text-xs px-3 py-1 rounded-full border border-midTeal text-midTeal hover:bg-midTeal hover:text-white transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {publicationsLoading && (
                  <div className="text-gray-500 text-sm">
                    Loading publications...
                  </div>
                )}

                {!publicationsLoading && publications.length === 0 && (
                  <div className="text-gray-500 text-sm">
                    No publications found in the database yet.
                  </div>
                )}

                {!publicationsLoading && publications.length > 0 && (
                  <div className="mt-3 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Title
                          </th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Meta
                          </th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Tag
                          </th>
                          <th className="py-2 pr-4 font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="py-2 font-semibold text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {publications.map((pub) => (
                          <tr
                            key={pub._id}
                            className="border-b border-gray-100 align-top"
                          >
                            <td className="py-2 pr-4">
                              <div className="font-semibold text-deepTeal line-clamp-2">
                                {pub.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {pub.authors}
                              </div>
                            </td>
                            <td className="py-2 pr-4 text-xs text-gray-700">
                              {pub.meta}
                            </td>
                            <td className="py-2 pr-4 text-xs">
                              <span className="px-2 py-0.5 rounded-full bg-midTeal/10 text-midTeal border border-midTeal/20">
                                {pub.tag}
                              </span>
                            </td>
                            <td className="py-2 pr-4 text-xs">
                              {pub.status === "approved" && (
                                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-[11px] uppercase tracking-wide">
                                  Approved
                                </span>
                              )}
                              {pub.status === "pending" && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] uppercase tracking-wide">
                                  Pending
                                </span>
                              )}
                              {pub.status === "rejected" && (
                                <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] uppercase tracking-wide">
                                  Rejected
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              <div className="flex flex-wrap gap-1">
                                <button
                                  onClick={() =>
                                    handleStatusChange(pub._id, "approved")
                                  }
                                  disabled={pub.status === "approved"}
                                  className={`px-2 py-1 rounded-full text-xs border ${
                                    pub.status === "approved"
                                      ? "bg-green-100 text-green-600 border-green-200 cursor-default"
                                      : "border-green-500 text-green-600 hover:bg-green-50"
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusChange(pub._id, "rejected")
                                  }
                                  disabled={pub.status === "rejected"}
                                  className={`px-2 py-1 rounded-full text-xs border ${
                                    pub.status === "rejected"
                                      ? "bg-red-100 text-red-600 border-red-200 cursor-default"
                                      : "border-red-500 text-red-600 hover:bg-red-50"
                                  }`}
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleEditClick(pub)}
                                  className="px-2 py-1 rounded-full text-xs border border-midTeal text-midTeal hover:bg-midTeal/10"
                                >
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Edit Publication Panel */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <h2 className="text-xl font-semibold text-deepTeal mb-3">
                  {editingPub ? "Edit Publication" : "Select a publication to edit"}
                </h2>

                {!editingPub && (
                  <p className="text-sm text-gray-600">
                    Click the <span className="font-semibold">Edit</span>{" "}
                    button on any publication in the table to modify its
                    details.
                  </p>
                )}

                {editingPub && (
                  <form
                    onSubmit={handleEditSubmit}
                    className="space-y-3 mt-2 text-sm"
                  >
                    <div className="text-xs text-gray-500 mb-2">
                      Editing:{" "}
                      <span className="font-semibold text-deepTeal">
                        {editingPub.title}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Meta
                        </label>
                        <input
                          type="text"
                          name="meta"
                          value={editForm.meta}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tag
                        </label>
                        <input
                          type="text"
                          name="tag"
                          value={editForm.tag}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
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
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Authors
                      </label>
                      <input
                        type="text"
                        name="authors"
                        value={editForm.authors}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                      />
                    </div>

                    <div className="grid md:grid-cols-[2fr_1fr] gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Link
                        </label>
                        <input
                          type="url"
                          name="link"
                          value={editForm.link}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Link Label
                        </label>
                        <input
                          type="text"
                          name="linkLabel"
                          value={editForm.linkLabel}
                          onChange={handleEditChange}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        disabled={editLoading}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-xs font-medium hover:shadow-lg transition-shadow disabled:opacity-60"
                      >
                        {editLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPub(null)}
                        className="px-4 py-2 rounded-full border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========== MANAGE TEAM SECTION ========== */}
        {activeSection === "reviewInformation" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Manage Team
            </h1>
            <p className="text-gray-700 mb-4">
              View all teams grouped by lead. Each box shows a lead and all of
              their assigned members, along with the conferences they are
              leading.
            </p>

            {/* Feedback messages for member & conference actions */}
            {(memberMessage || memberError || newConfMessage || newConfError || confEditError) && (
              <div className="mb-4 space-y-2">
                {memberMessage && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                    {memberMessage}
                  </div>
                )}
                {memberError && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                    {memberError}
                  </div>
                )}
                {newConfMessage && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                    {newConfMessage}
                  </div>
                )}
                {newConfError && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                    {newConfError}
                  </div>
                )}
                {confEditError && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                    {confEditError}
                  </div>
                )}
              </div>
            )}

            {(teamsError || allConfsError) && (
              <div className="mb-4 space-y-2">
                {teamsError && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                    {teamsError}
                  </div>
                )}
                {allConfsError && (
                  <div className="px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                    {allConfsError}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-deepTeal">
                Teams Overview
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={refreshTeams}
                  className="text-xs px-3 py-1 rounded-full border border-midTeal text-midTeal hover:bg-midTeal hover:text-white transition-colors"
                >
                  Refresh Teams
                </button>
                <button
                  onClick={refreshAllConferences}
                  className="text-xs px-3 py-1 rounded-full border border-accentTeal text-accentTeal hover:bg-accentTeal hover:text-white transition-colors"
                >
                  Refresh Conferences
                </button>
              </div>
            </div>

            {(teamsLoading || allConfsLoading) && (
              <div className="text-gray-500 text-sm mb-4">
                Loading team data...
              </div>
            )}

            {!teamsLoading && teams.length === 0 && (
              <div className="text-gray-500 text-sm">
                No teams found yet. Assign members under leads in the user
                management section.
              </div>
            )}

            {!teamsLoading && teams.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map((team) => {
                  const leadId = team.lead?._id;
                  const leadConfs = allConfs.filter(
                    (c) => c.lead && c.lead._id === leadId
                  );

                  return (
                    <div
                      key={leadId}
                      className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col gap-4"
                    >
                      {/* Lead header + actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-midTeal mb-1">
                            Team Lead
                          </div>
                          <div className="text-lg font-semibold text-deepTeal">
                            {team.lead?.displayName ||
                              team.lead?.name ||
                              "Unnamed Lead"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {team.lead?.email}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2 py-1 rounded-full text-[11px] uppercase tracking-wide bg-midTeal/10 text-midTeal border border-midTeal/20">
                            Members: {team.members?.length || 0}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => handleAssignMemberClick(leadId)}
                              className="px-2 py-1 rounded-full text-[11px] border border-midTeal text-midTeal hover:bg-midTeal/10"
                            >
                              Assign Member
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenLeadForNewConf((prev) =>
                                  prev === leadId ? null : leadId
                                )
                              }
                              className="px-2 py-1 rounded-full text-[11px] border border-accentTeal text-accentTeal hover:bg-accentTeal/10"
                            >
                              Add Conference
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Members list */}
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          Members
                        </div>

                        {/* Assign Member Form for this lead */}
                        {openLeadForMemberForm === leadId && (
                          <form
                            onSubmit={handleCreateMemberUnderLead}
                            className="mb-3 p-3 rounded-xl bg-slate-50 border border-dashed border-midTeal/40 space-y-2 text-xs"
                          >
                            <div className="font-semibold text-deepTeal text-sm">
                              Assign New Member under this Lead
                            </div>
                            <input
                              type="hidden"
                              name="leadId"
                              value={leadId}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={memberForm.name}
                                onChange={handleMemberFormChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                              <input
                                type="email"
                                name="email"
                                placeholder="Email *"
                                required
                                value={memberForm.email}
                                onChange={handleMemberFormChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile"
                                value={memberForm.mobile}
                                onChange={handleMemberFormChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                              <input
                                type="text"
                                name="studentId"
                                placeholder="Student ID"
                                value={memberForm.studentId}
                                onChange={handleMemberFormChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                              <input
                                type="email"
                                name="studentEmail"
                                placeholder="Student Email"
                                value={memberForm.studentEmail}
                                onChange={handleMemberFormChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenLeadForMemberForm(null);
                                  setMemberForm({
                                    leadId: "",
                                    name: "",
                                    email: "",
                                    mobile: "",
                                    studentId: "",
                                    studentEmail: "",
                                  });
                                }}
                                className="px-3 py-1 rounded-full border border-gray-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={memberSaving}
                                className="px-3 py-1 rounded-full bg-midTeal text-white"
                              >
                                {memberSaving ? "Saving..." : "Save Member"}
                              </button>
                            </div>
                          </form>
                        )}

                        {(!team.members || team.members.length === 0) && (
                          <div className="text-xs text-gray-500">
                            No members assigned yet.
                          </div>
                        )}

                        {team.members && team.members.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {team.members.map((m) => {
                              const edit = memberEdits[m._id] || {};
                              const isEditing = !!memberEdits[m._id];

                              return (
                                <div
                                  key={m._id}
                                  className="border border-gray-100 rounded-lg px-3 py-2 text-xs bg-slate-50"
                                >
                                  {isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={edit.displayName}
                                        onChange={(e) =>
                                          handleMemberEditChange(
                                            m._id,
                                            "displayName",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300 text-xs"
                                        placeholder="Name"
                                      />
                                      <input
                                        type="text"
                                        value={edit.mobile}
                                        onChange={(e) =>
                                          handleMemberEditChange(
                                            m._id,
                                            "mobile",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300 text-xs"
                                        placeholder="Mobile"
                                      />
                                      <input
                                        type="text"
                                        value={edit.studentId}
                                        onChange={(e) =>
                                          handleMemberEditChange(
                                            m._id,
                                            "studentId",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300 text-xs"
                                        placeholder="Student ID"
                                      />
                                      <input
                                        type="email"
                                        value={edit.studentEmail}
                                        onChange={(e) =>
                                          handleMemberEditChange(
                                            m._id,
                                            "studentEmail",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300 text-xs"
                                        placeholder="Student Email"
                                      />
                                      <div className="flex gap-1 mt-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSaveMemberEdit(m._id)
                                          }
                                          disabled={memberEditSaving}
                                          className="px-2 py-1 rounded-full bg-midTeal text-white text-[10px]"
                                        >
                                          {memberEditSaving
                                            ? "Saving..."
                                            : "Save"}
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
                                          className="px-2 py-1 rounded-full border border-gray-300 text-[10px]"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="font-semibold text-deepTeal">
                                        {m.displayName ||
                                          m.name ||
                                          "Unnamed Member"}
                                      </div>
                                      <div className="text-[11px] text-gray-600">
                                        ID: {m.studentId || "—"}
                                      </div>
                                      <div className="text-[11px] text-gray-600">
                                        Mobile: {m.mobile || "—"}
                                      </div>
                                      <div className="text-[11px] text-gray-600">
                                        Email:{" "}
                                        {m.studentEmail || m.email || "—"}
                                      </div>
                                      <div className="flex gap-1 mt-1">
                                        <button
                                          type="button"
                                          onClick={() => startEditMember(m)}
                                          className="px-2 py-1 rounded-full border border-midTeal text-midTeal text-[10px] hover:bg-midTeal/10"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveMember(m._id)
                                          }
                                          className="px-2 py-1 rounded-full border border-red-400 text-red-500 text-[10px] hover:bg-red-50"
                                        >
                                          Remove
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

                      {/* Conferences for this lead */}
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          Conferences
                        </div>

                        {/* New conference form for this lead */}
                        {openLeadForNewConf === leadId && (
                          <form
                            onSubmit={(e) =>
                              handleCreateConferenceForLead(e, leadId, team)
                            }
                            className="mb-3 p-3 rounded-xl bg-slate-50 border border-dashed border-accentTeal/40 text-xs space-y-2"
                          >
                            <div className="font-semibold text-deepTeal text-sm">
                              Add Conference for this Team
                            </div>
                            <input
                              type="text"
                              name="title"
                              placeholder="Conference title"
                              value={newConfForm.title}
                              onChange={handleNewConfChange}
                              required
                              className="w-full px-2 py-1 rounded border border-gray-300"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                name="date"
                                value={newConfForm.date}
                                onChange={handleNewConfChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              />
                              <select
                                name="status"
                                value={newConfForm.status}
                                onChange={handleNewConfChange}
                                className="px-2 py-1 rounded border border-gray-300"
                              >
                                <option value="submitted">submitted</option>
                                <option value="accepted">accepted</option>
                                <option value="presented">presented</option>
                                <option value="published">published</option>
                              </select>
                            </div>
                            <input
                              type="url"
                              name="link"
                              placeholder="Conference link"
                              value={newConfForm.link}
                              onChange={handleNewConfChange}
                              className="w-full px-2 py-1 rounded border border-gray-300"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenLeadForNewConf(null);
                                  setNewConfForm({
                                    title: "",
                                    date: "",
                                    link: "",
                                    status: "submitted",
                                  });
                                }}
                                className="px-3 py-1 rounded-full border border-gray-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={newConfSaving}
                                className="px-3 py-1 rounded-full bg-accentTeal text-white"
                              >
                                {newConfSaving ? "Saving..." : "Save Conf"}
                              </button>
                            </div>
                          </form>
                        )}

                        {leadConfs.length === 0 && (
                          <div className="text-xs text-gray-500">
                            No conferences created yet for this team.
                          </div>
                        )}

                        {leadConfs.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {leadConfs.map((conf) => {
                              const edit = confEdits[conf._id];
                              const isEditing = !!edit;

                              return (
                                <div
                                  key={conf._id}
                                  className="border border-gray-100 rounded-lg px-3 py-2 text-xs bg-white"
                                >
                                  {isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={edit.title}
                                        onChange={(e) =>
                                          handleConfEditChange(
                                            conf._id,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300"
                                      />
                                      <div className="grid grid-cols-2 gap-1 mb-1">
                                        <input
                                          type="date"
                                          value={edit.date}
                                          onChange={(e) =>
                                            handleConfEditChange(
                                              conf._id,
                                              "date",
                                              e.target.value
                                            )
                                          }
                                          className="px-2 py-1 rounded border border-gray-300"
                                        />
                                        <select
                                          value={edit.status}
                                          onChange={(e) =>
                                            handleConfEditChange(
                                              conf._id,
                                              "status",
                                              e.target.value
                                            )
                                          }
                                          className="px-2 py-1 rounded border border-gray-300"
                                        >
                                          <option value="submitted">
                                            submitted
                                          </option>
                                          <option value="accepted">
                                            accepted
                                          </option>
                                          <option value="presented">
                                            presented
                                          </option>
                                          <option value="published">
                                            published
                                          </option>
                                        </select>
                                      </div>
                                      <input
                                        type="url"
                                        value={edit.link}
                                        onChange={(e) =>
                                          handleConfEditChange(
                                            conf._id,
                                            "link",
                                            e.target.value
                                          )
                                        }
                                        className="w-full mb-1 px-2 py-1 rounded border border-gray-300"
                                        placeholder="Link"
                                      />
                                      <div className="flex gap-1 mt-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleSaveConfEdit(conf._id)
                                          }
                                          disabled={confEditSaving}
                                          className="px-2 py-1 rounded-full bg-midTeal text-white text-[10px]"
                                        >
                                          {confEditSaving
                                            ? "Saving..."
                                            : "Save"}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            setConfEdits((prev) => {
                                              const copy = { ...prev };
                                              delete copy[conf._id];
                                              return copy;
                                            })
                                          }
                                          className="px-2 py-1 rounded-full border border-gray-300 text-[10px]"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="font-semibold text-deepTeal line-clamp-2">
                                        {conf.title}
                                      </div>
                                      <div className="flex items-center justify-between mt-1">
                                        <div className="text-[11px] text-gray-600">
                                          {conf.date
                                            ? new Date(
                                                conf.date
                                              ).toLocaleDateString()
                                            : "No date"}
                                        </div>
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
                                          className="text-[11px] text-accentTeal hover:underline mt-1 inline-block"
                                        >
                                          View link →
                                        </a>
                                      )}
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            startEditConference(conf)
                                          }
                                          className="px-2 py-1 rounded-full border border-midTeal text-midTeal text-[10px] hover:bg-midTeal/10"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteConference(conf._id)
                                          }
                                          className="px-2 py-1 rounded-full border border-red-400 text-red-500 text-[10px] hover:bg-red-50"
                                        >
                                          Remove
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
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
