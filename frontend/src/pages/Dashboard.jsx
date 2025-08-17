import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Dashboard() {
  const [search, setSearch] = useState("");

  // Define menu sections
  const menuSections = [
    {
      title: "Recruitment",
      items: [{ label: "Candidates", to: "/candidates" }],
    },
    {
      title: "Organization",
      items: [
        { label: "Employees", to: "/employees" },
        { label: "Attendance", to: "/attendance" },
        { label: "Leaves", to: "/leaves" },
      ],
    },
    {
      title: "Others",
      items: [{ label: "Logout", to: "/logout" }],
    },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <aside
        className="bg-light border-end"
        style={{ width: '250px', minHeight: '100vh', position: 'fixed', left: 0, top: 0 }}
      >
        <div className="p-3 border-bottom">
          <h4 className="mb-0">LOGO</h4>
        </div>
        <div className="p-3">
          {/* Search bar */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <nav className="nav flex-column">
            {menuSections.map((section, idx) => {
              // Filter items by search
              const filteredItems = section.items.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              );

              // If no items match in this section, skip it
              if (filteredItems.length === 0) return null;

              return (
                <div key={idx}>
                  <strong className="text-muted small mb-2 d-block mt-3">
                    {section.title}
                  </strong>
                  {filteredItems.map((item, i) => (
                    <NavLink key={i} to={item.to} className="nav-link">
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              );
            })}

            {/* If nothing matches at all */}
            {menuSections.every(
              (section) =>
                section.items.filter((item) =>
                  item.label.toLowerCase().includes(search.toLowerCase())
                ).length === 0
            ) && (
              <span className="text-muted small">No matches</span>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
