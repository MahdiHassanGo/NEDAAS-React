// src/pages/dashboards/AdminDashboard.jsx
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
} from "../../api/teamApi";





const ROLES = ["member", "lead", "advisor", "director", "admin"];
const ROOT_ADMIN_EMAIL = "mahdiasif78@gmail.com";


export default function AdminDashboard() {
    // TEAMS (Admin view)
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState(null);

  // All conferences (Admin view)
  const [allConfs, setAllConfs] = useState([]);
  const [allConfsLoading, setAllConfsLoading] = useState(true);
  const [allConfsError, setAllConfsError] = useState(null);

  const { firebaseUser } = useAuth();
  const [activeSection, setActiveSection] = useState("addUser");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const [userActionMessage, setUserActionMessage] = useState(null);

  const [manualEmail, setManualEmail] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("member");

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


  // Load users for Add User section
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
    // Load publications for Review Publication section
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
  if (activeSection === "reviewPublication") {
    refreshPublications();
  }
  if (activeSection === "reviewInformation") {
    refreshTeams();
    refreshAllConferences();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSection, firebaseUser]);


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
await refreshPublications(); // ✅

    } catch (err) {
      console.error("Failed to update publication:", err);
      setPublicationsError(err.message || "Failed to update publication");
    } finally {
      setEditLoading(false);
    }
  };


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
            { id: "reviewInformation", label: "Manage Team" },  // ⬅ change label
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
        {activeSection === "addUser" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              User Management
            </h1>
            <p className="text-gray-700 mb-6">
              View registered users, change their roles, or manually add
              users by email.
            </p>

            {userActionMessage && (
              <div className="mb-4 px-4 py-2 rounded-lg text-sm bg-midTeal/10 text-midTeal border border-midTeal/30">
                {userActionMessage}
              </div>
            )}

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <div className="flex items-center justify-between mb  -4">
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
      <tr key={u._id} className="border-b border-gray-100">
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
              const disabled = isRootAdmin && r !== "admin";

              return (
                <button
                  key={r}
                  onClick={() =>
                    !disabled && handleRoleChange(u._id, r)
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
      <td colSpan={3} className="py-4 text-gray-500 text-sm">
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
                  Assign a role to an email even before they log in. When
                  they sign in with this email, they will see the
                  corresponding dashboard.
                </p>
                <form onSubmit={handleManualUserSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={manualEmail}
                      onChange={(e) =>
                        setManualEmail(e.target.value)
                      }
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
                      onChange={(e) =>
                        setManualName(e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      value={manualRole}
                      onChange={(e) =>
                        setManualRole(e.target.value)
                      }
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

        {activeSection === "reviewPublication" && (
  <section>
    <h1 className="text-3xl font-bold text-deepTeal mb-4">
      Review Publication
    </h1>
    <p className="text-gray-700 mb-4">
      Manage all publications in the system. You can approve, reject,
      or edit any entry. Only <span className="font-semibold">approved</span>{" "}
      publications appear on the homepage.
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
            Click the <span className="font-semibold">Edit</span> button
            on any publication in the table to modify its details.
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
                      {/* Lead header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-midTeal mb-1">
                            Team Lead
                          </div>
                          <div className="text-lg font-semibold text-deepTeal">
                            {team.lead?.displayName || team.lead?.name || "Unnamed Lead"}
                          </div>
                          <div className="text-xs text-gray-600">
                            {team.lead?.email}
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-full text-[11px] uppercase tracking-wide bg-midTeal/10 text-midTeal border border-midTeal/20">
                          Members: {team.members?.length || 0}
                        </span>
                      </div>

                      {/* Members list */}
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          Members
                        </div>
                        {(!team.members || team.members.length === 0) && (
                          <div className="text-xs text-gray-500">
                            No members assigned yet.
                          </div>
                        )}
                        {team.members && team.members.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {team.members.map((m) => (
                              <div
                                key={m._id}
                                className="border border-gray-100 rounded-lg px-3 py-2 text-xs bg-slate-50"
                              >
                                <div className="font-semibold text-deepTeal">
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

                      {/* Conferences for this lead */}
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-2">
                          Conferences
                        </div>
                        {leadConfs.length === 0 && (
                          <div className="text-xs text-gray-500">
                            No conferences created yet for this team.
                          </div>
                        )}
                        {leadConfs.length > 0 && (
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                            {leadConfs.map((conf) => (
                              <div
                                key={conf._id}
                                className="border border-gray-100 rounded-lg px-3 py-2 text-xs bg-white"
                              >
                                <div className="font-semibold text-deepTeal line-clamp-2">
                                  {conf.title}
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="text-[11px] text-gray-600">
                                    {conf.date
                                      ? new Date(conf.date).toLocaleDateString()
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
                              </div>
                            ))}
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
