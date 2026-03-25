import { Link, Outlet, useNavigate } from "react-router-dom";

export default function SuperAdminLayout() {

  const navigate = useNavigate();

  const adminName = localStorage.getItem("adminName") || "Super Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>

      {/* SIDEBAR */}
      <div
        style={{
          width: "250px",
          background: "#1e293b",
          color: "white",
          padding: "20px"
        }}
      >
        <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <Link style={linkStyle} to="/superadmin/dashboard">
            Dashboard
          </Link>

          <Link style={linkStyle} to="/superadmin/offices">
            Manage Offices
          </Link>

          <Link style={linkStyle} to="/superadmin/create-office">
            Create Office
          </Link>

          <Link style={linkStyle} to="/superadmin/services">
            Manage Services
          </Link>

          <Link style={linkStyle} to="/superadmin/officers">
            Manage Officers
          </Link>

          <Link style={linkStyle} to="/superadmin/create-officer">
            Create Officer
          </Link>

        </nav>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, background: "#f1f5f9" }}>

        {/* HEADER */}
        <div
          style={{
            background: "white",
            padding: "15px 25px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}
        >
          <h3>Welcome, {adminName}</h3>

          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              border: "none",
              color: "white",
              padding: "8px 14px",
              cursor: "pointer",
              borderRadius: "6px"
            }}
          >
            Logout
          </button>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: "30px" }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "15px"
};