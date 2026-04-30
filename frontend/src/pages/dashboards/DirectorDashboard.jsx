import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import directorApi, {
  getDirectorConferences,
  getDirectorCalendarEvents,
  createDirectorCalendarEvent,
  updateDirectorCalendarEvent,
  deleteDirectorCalendarEvent,
} from "../../api/directorApi";
import teamApi, { getAllAuthors } from "../../api/teamApi";

const CALENDAR_STATUS_OPTIONS = [
  { value: "submitted", label: "Submitted" },
  { value: "camera-ready", label: "Camera Ready submission" },
  { value: "registered", label: "Registered" },
  { value: "presented", label: "Presented" },
];

function formatDateLabel(dateStr) {
  if (!dateStr) return "No date";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// small helper: yyyy-mm-dd for <input type="date">
function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

// build a simple month grid for calendar
function buildMonthDays(currentMonthDate) {
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-11

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // last day of month

  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  const cells = [];
  // empty cells before 1st
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  return cells;
}

export default function DirectorDashboard() {
  const { firebaseUser } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");

  /* ========= CONFERENCES OVERVIEW ========= */
  const [confs, setConfs] = useState([]);
  const [confsLoading, setConfsLoading] = useState(true);
  const [confsError, setConfsError] = useState(null);

  /* ========= AUTHORS OVERVIEW ========= */
  const [authors, setAuthors] = useState([]);
  const [authorsLoading, setAuthorsLoading] = useState(true);
  const [authorsError, setAuthorsError] = useState(null);

  /* ========= CALENDAR ========= */
  const [events, setEvents] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("all");

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    status: "submitted",
    note: "",
  });
  const [editingEventId, setEditingEventId] = useState(null);
  const [calendarSaving, setCalendarSaving] = useState(false);

  const [calendarMessage, setCalendarMessage] = useState(null);

  // month being viewed
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  /* ========= LOADERS ========= */

  const loadAuthors = async () => {
    if (!firebaseUser) return;
    try {
      setAuthorsLoading(true);
      setAuthorsError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getAllAuthors(idToken);
      setAuthors(data);
    } catch (err) {
      console.error("Failed to load authors:", err);
      setAuthorsError(err.message || "Failed to load authors");
    } finally {
      setAuthorsLoading(false);
    }
  };

  const loadCalendar = async (status = filterStatus) => {
    if (!firebaseUser) return;
    try {
      setCalendarLoading(true);
      setCalendarError(null);
      const idToken = await firebaseUser.getIdToken();
      const data = await getDirectorCalendarEvents(idToken, status);
      setEvents(data);
    } catch (err) {
      console.error("Failed to load director calendar:", err);
      setCalendarError(err.message || "Failed to load calendar events");
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    if (!firebaseUser) return;
    loadConferences();
    loadAuthors();
    loadCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser]);

  /* ========= CALENDAR HANDLERS ========= */

  const handleEventFormChange = (e) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalendarFilterChange = async (statusValue) => {
    setFilterStatus(statusValue);
    await loadCalendar(statusValue);
  };

  const handleCalendarSubmit = async (e) => {
    e.preventDefault();
    if (!firebaseUser) return;

    setCalendarError(null);
    setCalendarMessage(null);

    if (!eventForm.title || !eventForm.date) {
      setCalendarError("Title and date are required.");
      return;
    }

    try {
      setCalendarSaving(true);
      const idToken = await firebaseUser.getIdToken();

      if (editingEventId) {
        await updateDirectorCalendarEvent(idToken, editingEventId, eventForm);
        setCalendarMessage("Conference calendar entry updated.");
      } else {
        await createDirectorCalendarEvent(idToken, eventForm);
        setCalendarMessage("Conference added to calendar.");
      }

      setEventForm({
        title: "",
        date: "",
        status: "submitted",
        note: "",
      });
      setEditingEventId(null);

      await loadCalendar(filterStatus);
    } catch (err) {
      console.error("Failed to save calendar event:", err);
      setCalendarError(err.message || "Failed to save event");
    } finally {
      setCalendarSaving(false);
    }
  };

  const startEditEvent = (event) => {
    setCalendarError(null);
    setCalendarMessage(null);
    setEditingEventId(event._id);
    setEventForm({
      title: event.title || "",
      date: toDateInputValue(event.date),
      status: event.status || "submitted",
      note: event.note || "",
    });
  };

  const cancelEditEvent = () => {
    setEditingEventId(null);
    setEventForm({
      title: "",
      date: "",
      status: "submitted",
      note: "",
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!firebaseUser) return;
    setCalendarError(null);
    setCalendarMessage(null);

    try {
      const idToken = await firebaseUser.getIdToken();
      await deleteDirectorCalendarEvent(idToken, eventId);
      setCalendarMessage("Conference removed from calendar.");
      await loadCalendar(filterStatus);
    } catch (err) {
      console.error("Failed to delete event:", err);
      setCalendarError(err.message || "Failed to delete event");
    }
  };

  const goPrevMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });
  };

  const goNextMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });
  };

  const monthCells = buildMonthDays(currentMonth);

  // map events by yyyy-mm-dd for quick lookup
  const eventsByDate = events.reduce((acc, ev) => {
    const key = toDateInputValue(ev.date);
    if (!key) return acc;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  return (
    <div className="flex min-h-[calc(100vh-4rem)] pt-4">
      {/* Side Hover Drawer */}
      <div className="group relative">
        <div className="h-full bg-deepTeal text-white w-16 group-hover:w-64 transition-all duration-300 flex flex-col py-6 overflow-hidden">
          <div className="px-4 mb-8 whitespace-nowrap">
            <span className="hidden group-hover:inline font-semibold text-lg">
              Director Panel
            </span>
            <span className="inline group-hover:hidden font-semibold text-xl">
              D
            </span>
          </div>

          {[
            { id: "overview", label: "Conference Overview" },
            { id: "authors", label: "Authors Overview" },
            { id: "calendar", label: "Conference Calendar" },
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
        {/* ========== SECTION 1: Conference Overview (READ ONLY) ========== */}
        {activeSection === "overview" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-2">
              Conference Overview
            </h1>
            <p className="text-gray-700 mb-4 text-sm">
              View all conferences submitted by leads. Director can{" "}
              <span className="font-semibold">see</span> all details (lead,
              authors, status, links) but cannot edit them here.
            </p>

            {confsError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {confsError}
              </div>
            )}

            {confsLoading && (
              <div className="text-gray-500 text-sm">Loading conferences…</div>
            )}

            {!confsLoading && confs.length === 0 && (
              <div className="text-gray-500 text-sm">
                No conferences found yet.
              </div>
            )}

            {!confsLoading && confs.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {confs.map((conf) => (
                  <div
                    key={conf._id}
                    className="border border-gray-200 rounded-2xl bg-white shadow-sm px-4 py-3 text-xs flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-semibold text-deepTeal text-sm line-clamp-2">
                          {conf.title}
                        </div>
                        <div className="text-[11px] text-gray-600">
                          {formatDateLabel(conf.date)}
                        </div>
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

                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        Lead
                      </div>
                      <div className="text-[11px] text-gray-700">
                        {conf.lead?.displayName || conf.lead?.email || "—"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {conf.lead?.email}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        Team Authors
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {conf.authors && conf.authors.length > 0
                          ? conf.authors
                              .map(
                                (a) =>
                                  a.displayName || a.email || "Unnamed member"
                              )
                              .join(", ")
                          : "None selected"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        External Authors
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {conf.extraAuthors && conf.extraAuthors.length > 0
                          ? conf.extraAuthors
                              .map(
                                (a) =>
                                  a.name ||
                                  a.email ||
                                  "Unnamed external author"
                              )
                              .join(", ")
                          : "None"}
                      </div>
                    </div>

                    {conf.link && (
                      <a
                        href={conf.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-[11px] text-accentTeal hover:underline"
                      >
                        Open conference website →
                      </a>
                    )}

                    {/* Director cannot edit – we show a small note */}
                    <div className="mt-1 text-[10px] text-gray-400 italic">
                      Read-only view (changes must be done by respective lead
                      or admin).
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========== SECTION 2: Authors Overview (READ ONLY) ========== */}
        {activeSection === "authors" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-2">
              Authors Overview
            </h1>
            <p className="text-gray-700 mb-4 text-sm">
              View all authors created by leads. Director can{" "}
              <span className="font-semibold">see</span> all author details but
              cannot edit them here.
            </p>

            {authorsError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {authorsError}
              </div>
            )}

            {authorsLoading && (
              <div className="text-gray-500 text-sm">Loading authors…</div>
            )}

            {!authorsLoading && authors.length === 0 && (
              <div className="text-gray-500 text-sm">
                No authors found yet.
              </div>
            )}

            {!authorsLoading && authors.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {authors.map((author) => (
                  <div
                    key={author._id}
                    className="border border-gray-200 rounded-2xl bg-white shadow-sm px-4 py-3 text-xs flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-semibold text-deepTeal text-sm">
                          {author.name}
                        </div>
                        <div className="text-[11px] text-gray-600">
                          {author.email}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200">
                        Author
                      </span>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        Affiliation
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {author.affiliation || "Not specified"}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">
                        Lead
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {author.lead?.displayName || author.lead?.email || "—"}
                      </div>
                    </div>

                    {/* Director cannot edit – we show a small note */}
                    <div className="mt-1 text-[10px] text-gray-400 italic">
                      Read-only view (changes must be done by respective lead
                      or admin).
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========== SECTION 3: Conference Calendar (CRUD + Filter) ========== */}
        {activeSection === "calendar" && (
          <section>
            <h1 className="text-3xl font-bold text-deepTeal mb-2">
              Conference Calendar
            </h1>
            <p className="text-gray-700 mb-4 text-sm">
              Plan and track conferences in a calendar view. Director can{" "}
              <span className="font-semibold">
                add, edit, delete calendar entries
              </span>{" "}
              and filter by status: Submitted, Camera Ready submission,
              Registered, Presented.
            </p>

            {calendarError && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
                {calendarError}
              </div>
            )}
            {calendarMessage && (
              <div className="mb-3 px-4 py-2 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">
                {calendarMessage}
              </div>
            )}

            <div className="grid lg:grid-cols-[1.1fr_1.4fr] gap-6">
              {/* LEFT: Form + Filter + List */}
              <div className="space-y-4">
                {/* Form */}
                <form
                  onSubmit={handleCalendarSubmit}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 space-y-3"
                >
                  <h2 className="text-lg font-semibold text-deepTeal mb-1">
                    {editingEventId ? "Edit Calendar Entry" : "Add Conference to Calendar"}
                  </h2>
                  <p className="text-[11px] text-gray-600 mb-1">
                    Write the conference name and select or type the date{" "}
                    <span className="font-semibold">(mm/dd/yyyy)</span>. Choose
                    the status to organize the calendar view.
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Conference Name
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleEventFormChange}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/40"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date (mm/dd/yyyy)
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={eventForm.date}
                        onChange={handleEventFormChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={eventForm.status}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/40"
                      >
                        {CALENDAR_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Note (optional)
                    </label>
                    <textarea
                      name="note"
                      value={eventForm.note}
                      onChange={handleEventFormChange}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-midTeal/40"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-3 mt-1">
                    <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
                      <span>Filter:</span>
                      <button
                        type="button"
                        onClick={() => handleCalendarFilterChange("all")}
                        className={`px-2 py-0.5 rounded-full border text-[10px] ${
                          filterStatus === "all"
                            ? "bg-midTeal text-white border-midTeal"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        All
                      </button>
                      {CALENDAR_STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            handleCalendarFilterChange(opt.value)
                          }
                          className={`px-2 py-0.5 rounded-full border text-[10px] ${
                            filterStatus === opt.value
                              ? "bg-midTeal text-white border-midTeal"
                              : "border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {editingEventId && (
                        <button
                          type="button"
                          onClick={cancelEditEvent}
                          className="px-3 py-1.5 rounded-full border border-gray-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={calendarSaving}
                        className="px-4 py-1.5 rounded-full bg-gradient-to-r from-midTeal to-accentTeal text-white text-[11px] font-medium hover:shadow-md disabled:opacity-60"
                      >
                        {calendarSaving
                          ? "Saving..."
                          : editingEventId
                          ? "Save Changes"
                          : "Add to Calendar"}
                      </button>
                    </div>
                  </div>
                </form>

                {/* List of events (for quick edit/delete) */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-semibold text-deepTeal">
                      Calendar Entries
                    </h2>
                    {calendarLoading && (
                      <span className="text-[11px] text-gray-500">
                        Loading…
                      </span>
                    )}
                  </div>

                  {!calendarLoading && events.length === 0 && (
                    <div className="text-xs text-gray-500">
                      No events for current filter.
                    </div>
                  )}

                  {!calendarLoading && events.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                      {events.map((ev) => (
                        <div
                          key={ev._id}
                          className="border border-gray-100 rounded-xl px-3 py-2 bg-slate-50 flex justify-between items-start gap-2"
                        >
                          <div>
                            <div className="font-semibold text-deepTeal">
                              {ev.title}
                            </div>
                            <div className="text-[11px] text-gray-600">
                              {formatDateLabel(ev.date)}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              Status:{" "}
                              {
                                CALENDAR_STATUS_OPTIONS.find(
                                  (o) => o.value === ev.status
                                )?.label
                              }
                            </div>
                            {ev.note && (
                              <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                                {ev.note}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => startEditEvent(ev)}
                              className="px-2 py-1 rounded-full border border-midTeal text-midTeal text-[10px] hover:bg-midTeal/10"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(ev._id)}
                              className="px-2 py-1 rounded-full border border-red-300 text-red-600 text-[10px] hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Calendar grid */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="text-sm font-semibold text-deepTeal">
                      {currentMonth.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Showing days with{" "}
                      {filterStatus === "all"
                        ? "any status"
                        : CALENDAR_STATUS_OPTIONS.find(
                            (o) => o.value === filterStatus
                          )?.label}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={goPrevMonth}
                      className="px-2 py-1 rounded-full border border-gray-300 text-[11px]"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={goNextMonth}
                      className="px-2 py-1 rounded-full border border-gray-300 text-[11px]"
                    >
                      Next →
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 text-[11px] text-gray-600 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d} className="text-center font-semibold py-1">
                        {d}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1 text-[11px]">
                  {monthCells.map((day, idx) => {
                    if (!day) {
                      return (
                        <div key={idx} className="h-16 border border-transparent" />
                      );
                    }
                    const key = toDateInputValue(day.toISOString());
                    const dayEvents = eventsByDate[key] || [];

                    return (
                      <div
                        key={key}
                        className="h-20 border border-gray-100 rounded-lg px-1 py-1 flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[10px] font-semibold text-gray-700">
                            {day.getDate()}
                          </span>
                          {dayEvents.length > 0 && (
                            <span className="text-[10px] px-1 rounded-full bg-midTeal/10 text-midTeal">
                              {dayEvents.length}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((ev) => (
                            <div
                              key={ev._id}
                              className="text-[10px] truncate mb-0.5 px-1 py-0.5 rounded bg-slate-100 cursor-pointer hover:bg-slate-200"
                              title={`${ev.title} – ${
                                CALENDAR_STATUS_OPTIONS.find(
                                  (o) => o.value === ev.status
                                )?.label
                              }`}
                              onClick={() => startEditEvent(ev)}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[9px] text-gray-500">
                              +{dayEvents.length - 2} more…
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
