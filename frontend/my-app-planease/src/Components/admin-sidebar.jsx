"use client"

import { useEffect } from "react"
import { ClipboardList, CalendarDays, Calendar } from "lucide-react"
import { useParams, NavLink } from "react-router-dom"

const AdminSideBar = () => {
  const { admin_page } = useParams()

  useEffect(() => {
    console.log(admin_page)
  }, [admin_page])

  return (
    <div className="w-64 h-screen shadow-lg flex flex-col justify-between py-6 px-4 ">
      <div>
        {/* Navigation */}
        <nav className="flex flex-col space-y-4 text-gray-700 text-base">
          <NavLink
            to="/admin/pendings"
            className={
              admin_page === "pendings"
                ? "flex items-center gap-3 font-medium px-3 py-2 rounded-md"
                : "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            }
          >
            <ClipboardList className="w-5 h-5" />
            Pending Requests
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={
              admin_page === "bookings"
                ? "flex items-center gap-3 font-medium px-3 py-2 rounded-md"
                : "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            }
          >
            <CalendarDays className="w-5 h-5" />
            Bookings
          </NavLink>
          <NavLink
            to="/admin/events"
            className={
              admin_page === "events"
                ? "flex items-center gap-3 font-medium px-3 py-2 rounded-md"
                : "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            }
          >
            <Calendar className="w-5 h-5" />
            Your Events
          </NavLink>
                    <NavLink
            to="/admin/subcontractors"
            className={
              admin_page === "events"
                ? "flex items-center gap-3 font-medium px-3 py-2 rounded-md"
                : "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100"
            }
          >
            <Calendar className="w-5 h-5" />
            Subcontractors
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default AdminSideBar
