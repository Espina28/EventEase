"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import FindTrustedProfessionals from "../../assets/FindTrustedProfessionals.jpg"

const EventPage = () => {
  const [events, setEvents] = useState([])
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    // Fetch events
    axios
      .get("http://localhost:8080/api/events/getEvents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setEvents(response.data)
      })
      .catch((error) => {
        console.error("Error fetching events:", error)
      })

    // Fetch packages
    axios
      .get("http://localhost:8080/package/getall", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPackages(response.data)
      })
      .catch((error) => {
        console.error("Error fetching packages:", error)
      })
  }, [])

  return (
    <div className="flex flex-col gap-10 p-10">
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-80 flex items-center justify-left text-white text-5xl font-bold pl-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${FindTrustedProfessionals})`,
        }}
      >
        <div>
          <div>FIND TRUSTED PROFESSIONALS</div>
          <div className="text-3xl mt-2">For your events</div>
        </div>
      </section>

      {/* Services Section */}
      <section className="flex items-center justify-between mb-5">
        <h2 className="text-3xl font-semibold text-gray-700">Find the Best Service for your Needs</h2>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {events.map((event) => (
          <div key={event.id} className="shadow-lg rounded-lg overflow-hidden flex flex-col h-full">
            {/* Image section */}
            <div className="h-52 w-full bg-gray-200 flex items-center justify-center">
              {event.event_image ? (
                <img
                  src={event.event_image || "/placeholder.svg"}
                  alt={event.event_name || "Event Image"}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-xl font-bold">No Image</span>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 text-center">
              <h3 className="text-xl font-semibold mb-2">{event.event_name || "Untitled Event"}</h3>
              <p className="text-gray-600 mb-2 flex-1 text-left">
                {event.event_summary || "No description available."}
              </p>
              {/* <p className="text-gray-700 font-medium mb-4">
                {event.event_price != null ? `₱${event.event_price.toLocaleString()}` : "Price not available"}
              </p> */}

              {/* Button */}
              {!event.event_isAvailable ? (
                <button
                  className="bg-gray-400 text-white w-full px-4 py-2 rounded-lg cursor-not-allowed mt-auto"
                  disabled
                >
                  Unavailable
                </button>
              ) : (
                <Link to={`/event/${event.event_name}`} className="mt-auto">
                  <button className="bg-gray-900 text-white w-full px-4 py-2 rounded-lg hover:bg-gray-800">
                    See more
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Wedding Packages Section - Fixed to use packageId */}
      <section className="text-center my-10">
        <p className="text-sm tracking-widest text-yellow-600 font-semibold mb-2">WE OFFER</p>
        <h2 className="text-4xl font-bold text-gray-800 mb-8">WEDDING PACKAGES</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-center px-4 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.packageId} className="bg-white shadow-md rounded-lg p-7 flex flex-col items-center">
              {/* Package Image */}
              <div className="rounded-full w-30 h-30 mb-4 overflow-hidden">
                {pkg.packageImage ? (
                  <img
                    src={pkg.packageImage || "/placeholder.svg"}
                    alt={pkg.packageName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* Package Details */}
              <h3 className="text-xl font-bold text-gray-800">{pkg.packageName}</h3>
              <p className="text-gray-500 mb-2">₱{pkg.packagePrice.toLocaleString()}</p>
              <p className="text-sm text-gray-700 p-5 text-center">
                {pkg.packageDescription || "No description available"}
              </p>

              {/* Package Link - Fixed to use packageId instead of packageName */}
              <Link to={`/package/${pkg.packageId}`} className="mt-auto">
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800">
                  CLICK FOR MORE DETAILS
                </button>
              </Link> 
            </div>
          ))}
        </div>

        {/* Show message if no packages available */}
        {packages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default EventPage
