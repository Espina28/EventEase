"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import "./styles/previewbooking-page.css"
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer"
import BookingSidePanel from "../../Components/Booking-sidepanel"
import { getCompleteBookingData, PACKAGES } from "./utils/booking-storage"

const PreviewBookingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { eventName } = useParams()

  // Load data using the bookingStorage utility
  const [bookingData, setBookingData] = useState(getCompleteBookingData)

  useEffect(() => {
    setBookingData(getCompleteBookingData())
    console.log("bookingData.servicesData.activeTab: ", bookingData.servicesData.activeTab)
  }, [])

  // Get the current event name
  const currentEventName = eventName || sessionStorage.getItem("currentEventName") || "Event"

  // Calculate the total price based on selected services or package
  const calculateSubtotal = () => {
    const { servicesData } = bookingData

    if (servicesData.activeTab === "package" && servicesData.selectedPackage) {
      // Find the selected package and return its price
      const selectedPkg = PACKAGES.find((pkg) => pkg.id === servicesData.selectedPackage)
      return selectedPkg ? selectedPkg.price : 0
    } else if (servicesData.activeTab === "custom") {
      // Calculate total from selected custom services
      let total = 0
      const { selectedServices, availableServices } = servicesData

      Object.entries(selectedServices).forEach(([serviceId, isSelected]) => {
        if (isSelected) {
          const service = availableServices.find((s) => s.id.toString() === serviceId)
          if (service) {
            total += service.price
          }
        }
      })

      return total
    }

    return 0
  }

  // Calculate subtotal and related values
  const subtotal = calculateSubtotal()
  const downpayment = subtotal * 0.1 // 10% downpayment
  const remainingBalance = subtotal - downpayment

  // Format number as Philippine Peso
  const formatAsPeso = (amount) => {
    return "₱" + amount.toLocaleString()
  }

  // Get selected services for display
  const getSelectedServicesForDisplay = () => {
    const { servicesData } = bookingData
    const selectedServicesList = []

    if (servicesData.activeTab === "package" && servicesData.selectedPackage) {
      const selectedPkg = PACKAGES.find((pkg) => pkg.id === servicesData.selectedPackage)
      if (selectedPkg) {
        selectedServicesList.push({
          id: selectedPkg.id,
          name: selectedPkg.name,
          price: selectedPkg.price,
          icon: selectedPkg.icon,
        })
      }
    } else if (servicesData.activeTab === "custom") {
      Object.entries(servicesData.selectedServices).forEach(([serviceId, isSelected]) => {
        if (isSelected) {
          const service = servicesData.availableServices.find((s) => s.id.toString() === serviceId)
          if (service) {
            selectedServicesList.push({
              id: serviceId,
              name: service.name,
              price: service.price,
              icon: service.icon,
              provider: service.subcontractorName,
            })
          }
        }
      })
    }

    return selectedServicesList
  }

  // Handle navigation to previous page
  const handlePrevious = () => {
    if (eventName) {
      navigate(`/book/${encodeURIComponent(eventName)}/services`)
    } else {
      navigate("/book/services")
    }
  }

  // Handle navigation to payment page
  const handlePayment = () => {
    if (eventName) {
      navigate(`/book/${encodeURIComponent(eventName)}/payment`)
    } else {
      navigate("/book/payment")
    }
  }

  const selectedServices = getSelectedServicesForDisplay()

  return (
    <>
      <Navbar />
      <div className="booking-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <Link to="/events-dashboard">Home</Link> /
          <Link to={`/event/${encodeURIComponent(currentEventName)}`}>{currentEventName}</Link> /<span>Book Now</span>
        </div>

        <div className="booking-content">
          {/* Side Panel */}
          <BookingSidePanel activeStep="preview" />

          {/* Main Content */}
          <div className="main-form-content">
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-label">Enter Details</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-label">Services</div>
              </div>
              <div className="step-line"></div>
              <div className="step active">
                <div className="step-number">3</div>
                <div className="step-label">Preview</div>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-label">Payment</div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="preview-content">
              <h2 className="section-title">Preview Booking for {currentEventName}</h2>

              {/* Personal Information */}
              <div className="preview-section">
                <h3>Personal Information</h3>
                <div className="personal-info">
                  <div className="info-row">
                    <div className="info-group">
                      <label>First Name</label>
                      <div className="info-value">{bookingData.personalInfo.firstName || "Not provided"}</div>
                    </div>
                    <div className="info-group">
                      <label>Last Name</label>
                      <div className="info-value">{bookingData.personalInfo.lastName || "Not provided"}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-group">
                      <label>Email</label>
                      <div className="info-value">{bookingData.personalInfo.email || "Not provided"}</div>
                    </div>
                    <div className="info-group">
                      <label>Contact</label>
                      <div className="info-value">{bookingData.personalInfo.contact || "Not provided"}</div>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-group">
                      <label>Location</label>
                      <div className="info-value">{bookingData.eventDetails.location || "Not provided"}</div>
                    </div>
                    <div className="info-group">
                      <label>Event Date</label>
                      <div className="info-value">{bookingData.eventDetails.eventDate || "Not provided"}</div>
                    </div>
                  </div>

                  {bookingData.eventDetails.note && (
                    <div className="info-row">
                      <div className="info-group full-width">
                        <label>Additional Notes</label>
                        <div className="info-value note-value">{bookingData.eventDetails.note}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div className="preview-section">
                <h3>Selected Services</h3>
                <div className="services-preview">
                  {selectedServices.length > 0 ? (
                    <>
                      {bookingData.servicesData.activeTab === "package" ? (
                        <div className="package-preview">
                          <p className="selection-type">Package Selection:</p>
                          {selectedServices.map((service) => (
                            <div key={service.id} className="preview-service">
                              <div className="service-icon">{service.icon}</div>
                              <div className="service-name">{service.name}</div>
                              <div className="service-price">{formatAsPeso(service.price)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="custom-services-preview">
                          <p className="selection-type">Custom Services Selection:</p>
                          {selectedServices.map((service) => (
                            <div key={service.id} className="preview-service">
                              <div className="service-icon">{service.icon}</div>
                              <div className="service-info">
                                <div className="service-name">{service.name}</div>
                                {service.provider && <div className="service-provider">by {service.provider}</div>}
                              </div>
                              <div className="service-price">{formatAsPeso(service.price)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-services">
                      <p>No services selected. Please go back and select services.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Calculation */}
              {selectedServices.length > 0 && (
                <div className="price-calculation">
                  <div className="calculation-row">
                    <div className="calculation-label">Subtotal</div>
                    <div className="calculation-value">{formatAsPeso(subtotal)}</div>
                  </div>
                  <div className="calculation-row">
                    <div className="calculation-label">Downpayment (10%)</div>
                    <div className="calculation-value">{formatAsPeso(downpayment)}</div>
                  </div>
                  <div className="calculation-row">
                    <div className="calculation-label">Remaining Balance</div>
                    <div className="calculation-value">{formatAsPeso(remainingBalance)}</div>
                  </div>

                  <div className="payment-notice">
                    <p>
                      The subtotal is subject to change depending on the final agreement between both parties. Customers
                      are required to pay 10% of the partial (not final) subtotal to confirm the booking.
                    </p>
                    <div className="to-pay">
                      <span>To pay:</span> <strong>{formatAsPeso(downpayment)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="navigation-buttons">
                <button className="previous-button" onClick={handlePrevious}>
                  Previous
                </button>
                <button
                  className={`payment-button ${selectedServices.length === 0 ? "disabled" : ""}`}
                  onClick={handlePayment}
                  disabled={selectedServices.length === 0}
                >
                  {selectedServices.length === 0 ? "Select Services First" : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PreviewBookingPage
