
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Users,
  BedDouble,
  CreditCard,
  Wrench,
  RefreshCw,
  Plus,
  Search
} from "lucide-react";

import { apiRequest } from "./services/api";

const sections = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "rooms", label: "Rooms", icon: BedDouble },
  { key: "tenants", label: "Tenants", icon: Users },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "maintenance", label: "Maintenance", icon: Wrench }
];

const endpoints = {
  rooms: "/api/rooms",
  tenants: "/api/tenants",
  payments: "/api/payments",
  maintenance: "/api/maintenance"
};

export default function App() {
  const [section, setSection] = useState("overview");
  const [records, setRecords] = useState([]);

  const [counts, setCounts] = useState({
    rooms: 0,
    tenants: 0,
    payments: 0,
    maintenance: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Load dashboard and section data
  async function loadData() {
    setLoading(true);
    setError("");

    try {
      if (section === "overview") {
        const results = await Promise.all(
          Object.entries(endpoints).map(async ([key, url]) => {
            const rows = await apiRequest(url);
            return [key, rows];
          })
        );

        setCounts(
          Object.fromEntries(
            results.map(([key, rows]) => [key, rows.length])
          )
        );
      } else {
        const query = search
          ? `?search=${encodeURIComponent(search)}`
          : "";

        const data = await apiRequest(
          `${endpoints[section]}${query}`
        );

        setRecords(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      setError(e.message || "Unable to load data.");
    } finally {
      setLoading(false);
    }
  }

  // Reload data when section or search changes
  useEffect(() => {
    loadData();
  }, [section, search]);

  // Create a new record
  async function createRecord(event) {
    event.preventDefault();

    // Save the form reference before the asynchronous request
    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());

    if (section === "rooms") {
      body.capacity = Number(body.capacity);
      body.monthlyRate = Number(body.monthlyRate);
    }

    if (section === "payments") {
      body.amount = Number(body.amount);
    }

    try {
      await apiRequest(endpoints[section], {
        method: "POST",
        body: JSON.stringify(body)
      });

      // Reset the form before hiding it
      formElement.reset();

      setShowForm(false);
      setError("");

      await loadData();
    } catch (e) {
      setError(e.message || "Failed to save record.");
    }
  }

  // Delete a record
  async function deleteRecord(id) {
    if (!window.confirm("Delete this record?")) {
      return;
    }

    try {
      await apiRequest(`${endpoints[section]}/${id}`, {
        method: "DELETE"
      });

      setError("");
      await loadData();
    } catch (e) {
      setError(e.message || "Failed to delete record.");
    }
  }

  // Current navigation section
  const current = sections.find(
    (item) => item.key === section
  );

  const title = current?.label || "Overview";

  const filteredRecords = useMemo(
    () => records,
    [records]
  );

  return (
    <div className="app-shell">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">BH</span>

          <div>
            <strong>Boarding House</strong>
            <small>Management System</small>
          </div>
        </div>

        <nav>
          {sections.map((item) => (
            <button
              key={item.key}
              className={
                section === item.key
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => {
                setSection(item.key);
                setSearch("");
                setShowForm(false);
                setError("");
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="side-note">
          Starter project · Connect your Atlas database in backend/.env
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Header */}
        <header className="topbar">
          <div>
            <span className="eyebrow">
              PROPERTY MANAGEMENT
            </span>

            <h1>{title}</h1>
          </div>

          <button
            className="refresh"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {/* Error Message */}
        {error && (
          <div className="alert error">
            <strong>Unable to load data:</strong> {error}
          </div>
        )}

        {/* Overview Dashboard */}
        {section === "overview" ? (
          <section>
            <p className="intro">
              Welcome! Manage rooms, tenants, payments,
              and maintenance from one place.
            </p>

            {loading ? (
              <p className="state">
                Loading dashboard...
              </p>
            ) : (
              <div className="stats">
                {sections.slice(1).map((item) => (
                  <article
                    className="stat-card"
                    key={item.key}
                  >
                    <div className="stat-icon">
                      <item.icon size={20} />
                    </div>

                    <span>{item.label}</span>

                    <strong>
                      {counts[item.key]}
                    </strong>

                    <small>
                      Records in database
                    </small>
                  </article>
                ))}
              </div>
            )}

            <div className="panel">
              <h2>Getting started</h2>

              <ol>
                <li>
                  Set your MongoDB Atlas connection
                  string in <code>backend/.env</code>.
                </li>

                <li>
                  Start the backend and confirm
                  <code> /api/health </code>
                  returns <code>status: ok</code>.
                </li>

                <li>
                  Open Rooms or Tenants to add your
                  first records.
                </li>
              </ol>
            </div>
          </section>
        ) : (
          <section>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="search">
                <Search size={17} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${title.toLowerCase()}...`}
                />
              </div>

              <button
                className="primary"
                onClick={() => {
                  setShowForm(!showForm);
                  setError("");
                }}
              >
                <Plus size={17} />
                Add {title.slice(0, -1) || "record"}
              </button>
            </div>

            {/* Add Record Form */}
            {showForm && (
              <form
                className="panel form-grid"
                onSubmit={createRecord}
              >

                {/* Room Form */}
                {section === "rooms" && (
                  <>
                    <label>
                      Room number
                      <input
                        name="roomNumber"
                        required
                        placeholder="e.g. 101"
                      />
                    </label>

                    <label>
                      Room type
                      <input
                        name="type"
                        defaultValue="Single"
                      />
                    </label>

                    <label>
                      Capacity
                      <input
                        name="capacity"
                        type="number"
                        min="1"
                        defaultValue="1"
                        required
                      />
                    </label>

                    <label>
                      Monthly rate
                      <input
                        name="monthlyRate"
                        type="number"
                        min="0"
                        required
                        placeholder="5000"
                      />
                    </label>

                    <label>
                      Status
                      <select name="status">
                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>
                      </select>
                    </label>
                  </>
                )}

                {/* Tenant Form */}
                {section === "tenants" && (
                  <>
                    <label>
                      Full name
                      <input
                        name="fullName"
                        required
                        placeholder="Tenant full name"
                      />
                    </label>

                    <label>
                      Email
                      <input
                        name="email"
                        type="email"
                        placeholder="tenant@email.com"
                      />
                    </label>

                    <label>
                      Phone
                      <input
                        name="phone"
                        placeholder="09xx xxx xxxx"
                      />
                    </label>

                    <label>
                      Move-in date
                      <input
                        name="moveInDate"
                        type="date"
                      />
                    </label>

                    <label>
                      Status
                      <select name="status">
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </label>
                  </>
                )}

                {/* Payment Form */}
                {section === "payments" && (
                  <>
                    <label>
                      Tenant ID
                      <input
                        name="tenant"
                        required
                        placeholder="MongoDB Tenant ObjectId"
                      />
                    </label>

                    <label>
                      Amount
                      <input
                        name="amount"
                        type="number"
                        min="0"
                        required
                      />
                    </label>

                    <label>
                      Payment date
                      <input
                        name="paymentDate"
                        type="date"
                      />
                    </label>

                    <label>
                      Method
                      <input
                        name="method"
                        defaultValue="Cash"
                      />
                    </label>

                    <label>
                      Status
                      <select name="status">
                        <option>Paid</option>
                        <option>Pending</option>
                      </select>
                    </label>
                  </>
                )}

                {/* Maintenance Form */}
                {section === "maintenance" && (
                  <>
                    <label>
                      Room ID
                      <input
                        name="room"
                        placeholder="MongoDB Room ObjectId"
                      />
                    </label>

                    <label>
                      Title
                      <input
                        name="title"
                        required
                        placeholder="Repair request"
                      />
                    </label>

                    <label>
                      Description
                      <input
                        name="description"
                        placeholder="Describe the issue"
                      />
                    </label>

                    <label>
                      Priority
                      <select name="priority">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </label>

                    <label>
                      Status
                      <select name="status">
                        <option>Open</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </label>
                  </>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    className="primary"
                    type="submit"
                  >
                    Save record
                  </button>

                  <button
                    className="secondary"
                    type="button"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Records Table */}
            <div className="panel table-panel">
              {loading ? (
                <p className="state">
                  Loading {title.toLowerCase()}...
                </p>
              ) : filteredRecords.length === 0 ? (
                <div className="empty">
                  <strong>
                    No {title.toLowerCase()} found
                  </strong>

                  <span>
                    Add a record or change your search.
                  </span>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(filteredRecords[0])
                          .filter(
                            (key) =>
                              ![
                                "_id",
                                "__v",
                                "updatedAt"
                              ].includes(key)
                          )
                          .slice(0, 6)
                          .map((key) => (
                            <th key={key}>
                              {key.replace(/([A-Z])/g, " $1")}
                            </th>
                          ))}

                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map((row) => (
                        <tr key={row._id}>
                          {Object.keys(filteredRecords[0])
                            .filter(
                              (key) =>
                                ![
                                  "_id",
                                  "__v",
                                  "updatedAt"
                                ].includes(key)
                            )
                            .slice(0, 6)
                            .map((key) => (
                              <td key={key}>
                                {typeof row[key] === "object" &&
                                row[key] !== null
                                  ? (
                                      row[key].fullName ||
                                      row[key]._id ||
                                      JSON.stringify(row[key])
                                    )
                                  : String(row[key] ?? "—")}
                              </td>
                            ))}

                          <td>
                            <button
                              className="delete"
                              onClick={() => deleteRecord(row._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer>
          Boarding House Management System
          <span>React · Express · MongoDB</span>
        </footer>
      </main>
    </div>
  );
}
