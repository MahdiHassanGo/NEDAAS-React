// src/pages/dashboards/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllUsers,
  updateUserRole,
  createManualUser,
  createPublication,
} from "../../api/adminApi";

const ROLES = ["member", "lead", "advisor", "director", "admin"];

export default function AdminDashboard() {
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

  useEffect(() => {
    if (activeSection === "addUser") {
      refreshUsers();
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
            { id: "reviewInformation", label: "Review Information" },
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
                        {users.map((u) => (
                          <tr
                            key={u._id}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2 pr-4 text-xs md:text-sm">
                              {u.email}
                            </td>
                            <td className="py-2 pr-4 text-xs md:text-sm capitalize">
                              {u.role || "member"}
                            </td>
                            <td className="py-2">
                              <div className="flex flex-wrap gap-1">
                                {ROLES.map((r) => (
                                  <button
                                    key={r}
                                    onClick={() =>
                                      handleRoleChange(u._id, r)
                                    }
                                    className={`px-2 py-1 rounded-full text-xs border ${
                                      u.role === r
                                        ? "bg-midTeal text-white border-midTeal"
                                        : "border-midTeal/40 text-midTeal hover:bg-midTeal/10"
                                    }`}
                                  >
                                    {r}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
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
            <p className="text-gray-700">
              Placeholder for future: here you can list pending publications
              and approve/reject them.
            </p>
          </section>
        )}

        {activeSection === "reviewInformation" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-4">
              Review Information
            </h1>
            <p className="text-gray-700">
              Placeholder for future: for reviewing lab info, team details,
              etc.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
