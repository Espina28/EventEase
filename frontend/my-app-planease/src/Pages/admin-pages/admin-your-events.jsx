"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import AdminSideBar from "../../Components/admin-sidebar.jsx"
import { Dialog } from "@headlessui/react"
import Navbar from "../../Components/Navbar"
import { Snackbar, Alert } from "@mui/material"

const YourEvents = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_summary: "",
    event_price: "",
    event_image: "",
    event_isAvailable: true,
  })

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/events/getEvents")
      setEvents(response.data)
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleAddEvent = () => {
    setFormData({
      event_name: "",
      event_description: "",
      event_summary: "",
      event_price: "",
      event_image: "",
      event_isAvailable: true,
    })
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditEvent = (event) => {
    setFormData({
      event_Id: event.event_Id,
      event_name: event.event_name,
      event_description: event.event_description,
      event_summary: event.event_summary,
      event_price: event.event_price,
      event_image: event.event_image,
      event_isAvailable: event.event_isAvailable,
    })
    setSelectedEvent(event)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Show loading state
      setSnackbar({
        open: true,
        message: "Uploading image...",
        severity: "info",
      })

      // Create form data
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      let response
      if (isEditing && selectedEvent) {
        // Upload for existing event
        response = await axios.post(
          `http://localhost:8080/api/events/upload/image/${selectedEvent.event_Id}`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        )
      } else {
        // For new events, we'll store the file temporarily and upload after creation
        // Create a temporary URL for preview
        const tempUrl = URL.createObjectURL(file)
        setFormData((prev) => ({
          ...prev,
          event_image: tempUrl,
          imageFile: file, // Store the file for later upload
        }))

        setSnackbar({
          open: true,
          message: "Image selected. It will be uploaded when you save the event.",
          severity: "success",
        })
        return
      }

      if (response.status === 200) {
        // Update the form data with the new image URL
        setFormData((prev) => ({
          ...prev,
          event_image: response.data.event_image,
        }))

        setSnackbar({
          open: true,
          message: "Image uploaded successfully",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Failed to upload image:", error)
      setSnackbar({
        open: true,
        message: "Failed to upload image. Please try again.",
        severity: "error",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let savedEvent
      if (isEditing) {
        savedEvent = await axios.put("http://localhost:8080/api/events", formData)
      } else {
        // Create event first
        const eventData = { ...formData }
        delete eventData.imageFile // Remove the file from the data
        delete eventData.event_image // Remove temp URL

        const response = await axios.post("http://localhost:8080/api/events/createEvent", eventData)
        savedEvent = response.data

        // If there's an image file, upload it
        if (formData.imageFile) {
          const uploadFormData = new FormData()
          uploadFormData.append("file", formData.imageFile)

          await axios.post(`http://localhost:8080/api/events/upload/image/${savedEvent.event_Id}`, uploadFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        }
      }

      fetchEvents()
      setShowModal(false)
      setSelectedEvent(null)

      // Clean up temporary URL if it exists
      if (formData.event_image && formData.event_image.startsWith("blob:")) {
        URL.revokeObjectURL(formData.event_image)
      }
    } catch (error) {
      console.error("Error saving event:", error)
    }
  }

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:8080/api/events/${selectedEvent.event_Id}`)
        fetchEvents()
        setShowModal(false)
        setSelectedEvent(null)
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 border-r bg-white">
          <AdminSideBar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50 overflow-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Your Events</h2>
            <button
              onClick={handleAddEvent}
              className="bg-[#FFB22C] hover:bg-[#e6a028] text-white px-4 py-2 rounded-lg font-medium"
            >
              Add Event
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F1F1FB] text-gray-700">
                <tr>
                  <th className="p-3 sm:p-4 whitespace-nowrap">Event Name</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">Summary</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">Price</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">Status</th>
                  <th className="p-3 sm:p-4 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events?.map((event) => (
                  <tr key={event.event_Id} className="hover:bg-gray-100">
                    <td className="p-3 sm:p-4 whitespace-nowrap text-[#667085] font-medium">{event.event_name}</td>
                    <td className="p-3 sm:p-4 text-[#667085] max-w-xs truncate">{event.event_summary}</td>
                    <td className="p-3 sm:p-4 whitespace-nowrap text-[#667085]">${event.event_price}</td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.event_isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {event.event_isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-[#FFB22C] hover:text-[#e6a028] font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Add/Edit Event Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed z-1150 shadow-md inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <Dialog.Panel className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex justify-between items-center border-b pb-2 mb-6">
              <h3 className="text-xl font-semibold">{isEditing ? "Edit Event" : "Add New Event"}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl hover:cursor-pointer">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Event Name</label>
                  <input
                    type="text"
                    name="event_name"
                    value={formData.event_name}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">Price</label>
                  <input
                    type="number"
                    name="event_price"
                    value={formData.event_price}
                    onChange={handleInputChange}
                    className="border p-2 rounded w-full"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Event Summary</label>
                <input
                  type="text"
                  name="event_summary"
                  value={formData.event_summary}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Event Description</label>
                <textarea
                  name="event_description"
                  value={formData.event_description}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full h-24"
                  required
                />
              </div>

              {/* Event Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Event Image</label>
                <div className="space-y-3">
                  {/* Current Image Preview */}
                  {(formData.event_image || selectedEvent?.event_image) && (
                    <div className="relative">
                      <img
                        src={formData.event_image || selectedEvent?.event_image}
                        alt="Event preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, event_image: "" }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="event-image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="event-image-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="text-gray-400 mb-2">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600">Click to upload event image</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="event_isAvailable"
                  checked={formData.event_isAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-500">Event is Available</label>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                  >
                    Delete Event
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FFB22C] hover:bg-[#e6a028] text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                  {isEditing ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default YourEvents
