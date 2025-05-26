"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import "./styles/inputdetails-page.css"
import Navbar from "../../Components/Navbar"
import BookingSidePanel from "../../Components/Booking-sidepanel"
import Footer from "../../Components/Footer"
import DatePickerWithRestriction from "../../Components/DatePickerWithRestriction"
import { getPersonalInfo, getEventDetails, savePersonalInfo, saveEventDetails } from "./utils/booking-storage"
import axios from "axios"
import { clearBookingData, clearSelectedServices } from "./utils/booking-storage"





const InputDetailsPage = () => {
  const navigate = useNavigate()
  const { eventName } = useParams()
  
  // Get event name from params or sessionStorage as fallback
  const currentEventName = eventName || sessionStorage.getItem("currentEventName") || "Event"

  // Initialize form data from bookingStorage utility - separate personal and event data
  const [personalInfo, setPersonalInfo] = useState(getPersonalInfo)
  const [eventDetails, setEventDetails] = useState(getEventDetails)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true)

  // Store current event name in sessionStorage
  useEffect(() => {
    if (currentEventName) {
      sessionStorage.setItem("currentEventName", currentEventName)
    }
  }, [currentEventName])

  // Auto-fill user data on component mount
  useEffect(() => {
    const fetchAndAutoFillUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoadingUserData(false)
          return
        }

        // Fetch user data directly from endpoint
        const response = await axios.get("http://localhost:8080/user/getuser", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const userData = response.data

        // Check if form is currently empty (should auto-fill)
        const currentPersonalInfo = getPersonalInfo()
        const shouldAutoFill =
          !currentPersonalInfo.firstName && !currentPersonalInfo.lastName && !currentPersonalInfo.email

        if (shouldAutoFill && userData) {
          // Auto-fill form with user data
          const autoFilledPersonalInfo = {
            firstName: userData.firstname || "",
            lastName: userData.lastname || "",
            email: userData.email || "",
            contact: userData.phoneNumber || "",
          }

          setPersonalInfo(autoFilledPersonalInfo)
          // Save to sessionStorage
          savePersonalInfo(autoFilledPersonalInfo)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        // If there's an error, just continue with empty form
      } finally {
        setIsLoadingUserData(false)
      }
    }

    fetchAndAutoFillUserData()
  }, [])

  useEffect(() => {
  // Reset only the specified event detail fields on mount
  setEventDetails((prev) => ({
    ...prev,
    location: "",
    eventDate: "",
    note: "",
  }));
  }, []);

  useEffect(() => {
    clearSelectedServices()
    clearBookingData()
  }, [eventName])
    


  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target
    setPersonalInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Handle event details changes
  const handleEventDetailsChange = (e) => {
    const { name, value } = e.target
    setEventDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Save personal info whenever it changes (but not during initial load)
  useEffect(() => {
    if (!isLoadingUserData) {
      savePersonalInfo(personalInfo)
    }
  }, [personalInfo, isLoadingUserData])

  // Save event details whenever it changes
  useEffect(() => {
    if (!isLoadingUserData) {
      saveEventDetails(eventDetails)
    }
  }, [eventDetails, isLoadingUserData])

  // Validate form data
  const isFormValid = () => {
    return (
      personalInfo.firstName.trim() &&
      personalInfo.lastName.trim() &&
      personalInfo.email.trim() &&
      personalInfo.contact.trim() &&
      eventDetails.location.trim() &&
      eventDetails.eventDate.trim()
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      alert("Please fill in all required fields.")
      return
    }

    // Save form data
    savePersonalInfo(personalInfo)
    saveEventDetails(eventDetails)

    console.log("Personal Info:", personalInfo)
    console.log("Event Details:", eventDetails)
    console.log("Event Name:", eventName.toLowerCase())
    // Navigate to services page with event name
    if (!eventName.toLowerCase().includes("package")) {
      navigate(`/book/${encodeURIComponent(eventName)}/services`)
    } else{
      navigate(`/book/${encodeURIComponent(eventName)}/preview`)
    }
  }

  // Show loading state while fetching user data
  if (isLoadingUserData) {
    return (
      <>
        <Navbar />
        <div className="booking-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your information...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="booking-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <Link to="/events-dashboard"
          onClick={() => {
            clearBookingData();
            clearSelectedServices();
          }}
          >Home</Link> /
          <Link to={`/event/${encodeURIComponent(currentEventName)}`}>{currentEventName}</Link> / <span>Book Now</span>
        </div>

        <div className="booking-content">
          {/* Side Panel */}
          <BookingSidePanel activeStep="enter-details" />

          {/* Main Content */}
          <div className="main-form-content">
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className="step active">
                <div className="step-number">1</div>
                <div className="step-label">Enter Details</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-label">Services</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Preview</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-label">Payment</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Personal Details Section */}
              <div className="form-section">
                <h2 className="section-title">
                  Personal Details
                  {personalInfo.firstName && personalInfo.lastName && (
                    <span className="auto-filled-indicator"> (Auto-filled from your profile)</span>
                  )}
                </h2>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={personalInfo.firstName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your first name"
                      required
                      className={personalInfo.firstName ? "auto-filled" : ""}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={personalInfo.lastName}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your last name"
                      required
                      className={personalInfo.lastName ? "auto-filled" : ""}
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your email"
                      required
                      className={personalInfo.email ? "auto-filled" : ""}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact">Contact *</label>
                    <input
                      type="tel"
                      id="contact"
                      name="contact"
                      value={personalInfo.contact}
                      onChange={handlePersonalInfoChange}
                      placeholder="Enter your contact number"
                      required
                      className={personalInfo.contact ? "auto-filled" : ""}
                    />
                  </div>
                </div>
              </div>

              {/* Event Details Section */}
              <div className="form-section">
                <h2 className="section-title">Event Details</h2>
                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="eventType">Event Type</label>
                    <input
                      type="text"
                      id="eventType"
                      name="eventType"
                      value={currentEventName}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="location">Location *</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={eventDetails.location}
                      onChange={handleEventDetailsChange}
                      placeholder="Enter event location"
                      required
                    />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="eventDate">Event Date *</label>
                    <DatePickerWithRestriction
                      id="eventDate"
                      name="eventDate"
                      value={eventDetails.eventDate}
                      onChange={handleEventDetailsChange}
                    />
                  </div>
                  <div className="input-group">{/* Empty div to maintain grid layout */}</div>
                </div>

                <div className="input-row">
                  <div className="input-group full-width">
                    <label htmlFor="note">Additional Notes</label>
                    <textarea
                      id="note"
                      name="note"
                      value={eventDetails.note}
                      onChange={handleEventDetailsChange}
                      placeholder="Add any special requests or notes for your event (optional)"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* Form Validation Notice */}
              {!isFormValid() && (
                <div className="validation-notice">
                  <p>* Please fill in all required fields to continue</p>
                </div>
              )}

              {/* Next Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className={`next-button ${!isFormValid() ? "disabled" : ""}`}
                  disabled={!isFormValid()}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default InputDetailsPage
