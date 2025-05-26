
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CreditCard, FileText } from "lucide-react";

const AdminSideBar = () => {
  return (
    <div className="h-screen bg-white">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/admin/subcontractors"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/subcontractors"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition 
            ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-500"}`
          }
        >
          <CreditCard size={20} />
          Subcontractors
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSideBar;
