"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import "./styles/selectservice-page.css"
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer"
import BookingSidePanel from "../../Components/Booking-sidepanel"
import ShocaseModal from "../../Components/showcaseModal.jsx"
import {
  getActiveTab,
  getSelectedServices,
  getSelectedPackage,
  getEventDetails,
  getPersonalInfo,
  saveServicesData,
  saveAvailableServices,
  PACKAGES,
  clearBookingData,
} from "./utils/booking-storage"
import axios from "axios"


const SelectServicePage = () => {
  const navigate = useNavigate()
  const { eventName } = useParams()

  // Get event name from params or sessionStorage as fallback
  const currentEventName = eventName || sessionStorage.getItem("currentEventName") || "Event"

  // Initialize from bookingStorage
  const [activeTab, setActiveTab] = useState(getActiveTab)
  const [selectedServices, setSelectedServices] = useState(getSelectedServices)
  const [expandedPackage, setExpandedPackage] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(getSelectedPackage)

  const [showcaseData, setShowcaseData] = useState({ visible: false, id: null, title: "" });

  const [personalInfo, setPersonalInfo] = useState(getPersonalInfo)
  const [eventDetails, setEventDetails] = useState(getEventDetails)

  // New state for subcontractor services
  const [subcontractorServices, setSubcontractorServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  // Save data when it changes
  useEffect(() => {
    saveServicesData({
      activeTab,
      selectedServices,
      selectedPackage,
      availableServices: subcontractorServices,
    })

    console.log("date: ", getEventDetails().eventDate)
  }, [activeTab, selectedServices, selectedPackage, subcontractorServices])

  // Fetch subcontractor services on component mount
  useEffect(() => {
    const fetchSubcontractorServices = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://localhost:8080/subcontractor/available/${getEventDetails().eventDate}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        console.log("Fetched subcontractors:", response.data)

        // Transform subcontractor data to service format
        const services = response.data.map((subcontractor) => ({
          id: subcontractor.subcontractorId,
          name: subcontractor.serviceName,
          price: subcontractor.servicePrice,
          icon: getServiceIcon(subcontractor.serviceName),
          subcontractorName:
            subcontractor.user?.firstname && subcontractor.user?.lastname
              ? `${subcontractor.user.firstname} ${subcontractor.user.lastname}`
              : "Service Provider",
          category: subcontractor.category,
        }))

        console.log("Transformed services with prices:", services)
        setSubcontractorServices(services)

        // Store services data in both places for compatibility
        saveAvailableServices(services)

        // Initialize selectedServices state with all services set to false
        const initialSelectedServices = {}
        services.forEach((service) => {
          initialSelectedServices[service.id.toString()] = selectedServices[service.id.toString()] || false
        })

        // Preserve any existing selections
        setSelectedServices((prev) => ({
          ...initialSelectedServices,
          ...prev,
        }))
      } catch (error) {
        console.error("Error fetching subcontractor services:", error)
        setSubcontractorServices([])
      } finally {
        setIsLoadingServices(false)
      }
    }

    fetchSubcontractorServices()
  }, [])
  
  
  const submitFormProgress = async () => {
    const token = localStorage.getItem("token");
    const body = {
      email: personalInfo.email,
      eventName: currentEventName,
      jsonData: JSON.stringify({
        personalInfo,
        eventDetails,
        selectedServices
      })
    };

    try {
      await axios.post(`http://localhost:8080/form-draft/save`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error fetching form progress:", error);
      throw error; // rethrow so beforeNavigate can block navigation
    }
  };

  // Helper function to get appropriate icon based on service name
  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase()
    if (name.includes("catering") || name.includes("food")) return "🍽️"
    if (name.includes("host") || name.includes("mc")) return "🎤"
    if (name.includes("photo") || name.includes("camera")) return "📷"
    if (name.includes("band") || name.includes("music") || name.includes("dj")) return "🎸"
    if (name.includes("decoration") || name.includes("decor")) return "🎨"
    if (name.includes("venue") || name.includes("location")) return "🏢"
    if (name.includes("flower") || name.includes("floral")) return "🌸"
    if (name.includes("light") || name.includes("sound")) return "💡"
    return "⭐"
  }

  // Format number as Philippine Peso
  const formatAsPeso = (amount) => {
    return "₱" + amount.toLocaleString()
  }

  // Handle service checkbox change
  const handleServiceChange = (serviceId) => {
    setSelectedServices({
      ...selectedServices,
      [serviceId.toString()]: !selectedServices[serviceId.toString()],
    })
  }

  // Handle package selection
  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId)
  }

  // Handle package expand/collapse
  const handleExpandPackage = (packageId) => {
    if (expandedPackage === packageId) {
      setExpandedPackage(null)
    } else {
      setExpandedPackage(packageId)
    }
  }

  // Handle tab change - UPDATED to enforce mutual exclusivity
  const handleTabChange = (tab) => {
    setActiveTab(tab)

      // Clear the other option when switching tabs
    if (tab === "package") {
      // Switching to package tab - clear all custom services
      const clearedServices = {}
      subcontractorServices.forEach((service) => {
        clearedServices[service.id.toString()] = false
      })
      setSelectedServices(clearedServices)
    } else if (tab === "custom") {
      // Switching to custom tab - clear selected package
      setSelectedPackage(null)
    }
  }

  // Check if user has made a valid selection
  const hasValidSelection = () => {
    if (activeTab === "package") {
      return selectedPackage !== null
    } else if (activeTab === "custom") {
      return Object.values(selectedServices).some((service) => service === true)
    }
    return false
  }

  // Handle next button click
  const handleNext = () => {
    if (!hasValidSelection()) {
      if (activeTab === "package") {
        alert("Please select a package before proceeding.")
      } else {
        alert("Please select at least one service before proceeding.")
      }
      return
    }

    // Save booking services data with all necessary information
    saveServicesData({
      activeTab,
      selectedServices,
      selectedPackage,
      availableServices: subcontractorServices,
    })

    submitFormProgress()

    // Navigate to preview page with event name
    if (eventName) {
      navigate(`/book/${encodeURIComponent(eventName)}/preview`)
    } else {
      navigate("/book/preview")
    }
  }

  // Handle previous button click
  const handlePrevious = () => {
    if (eventName) {
      submitFormProgress()
      navigate(`/book/${encodeURIComponent(eventName)}/inputdetails`)
    } else {
      navigate("/book/inputdetails")
    }
  }

  if (isLoadingServices) {
    return (
      <>
        <Navbar />
        <div className="booking-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading available services...</p>
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
          <Link to="/events-dashboard" onClick={() => clearBookingData()}>Home</Link> /{" "}
          <Link to={`/event/${encodeURIComponent(currentEventName)}`}>{currentEventName}</Link> / <span>Book Now</span>
        </div>

        <div className="booking-content">
          {/* Side Panel */}
          {/* <BookingSidePanel activeStep="services" /> */}
          <BookingSidePanel
            activeStep="enter-details"
            beforeNavigate={ async () => {
              try {
                // Submit progress
                await submitFormProgress(); // 👈 make sure it's `await` if it returns a Promise
                return true; // allow navigation
              } catch (error) {
                console.error("Blocking navigation due to error:", error);
                return false; // block navigation
              }
            }}
          />

          {/* Main Content */}
          <div className="main-form-content">
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className="step completed">
                <div className="step-number">1</div>
                <div className="step-label">Enter Details</div>
              </div>
              <div className="step-line completed"></div>
              <div className="step active">
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

            {/* Services Selection */}
            <div className="services-selection">
              <h2 className="section-title">Select Services</h2>

              {/* Tabs */}
              {/* <div className="service-tabs">
                <button
                  className={`tab-button ${activeTab === "custom" ? "active" : ""}`}
                  onClick={() => handleTabChange("custom")}
                >
                  Custom
                </button>
                <button
                  className={`tab-button ${activeTab === "package" ? "active" : ""}`}
                  onClick={() => handleTabChange("package")}
                >
                  Package
                </button>
              </div> */}

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === "custom" ? (
                  // Custom Service Options
                  <div className="custom-services">
                    {subcontractorServices.length === 0 ? (
                      <div className="no-services-message">
                        <p>No services available at the moment.</p>
                      </div>
                    ) : (
                      subcontractorServices.map((service) => (
                        <div
                          key={service.id}
                          className={`service-card ${selectedServices[service.id.toString()] ? "selected" : ""}`}
                          onClick={() => handleServiceChange(service.id)}
                        >
                          <div className="service-icon-container">
                            <div className="service-icon">{service.icon}</div>
                          </div>
                          <div className="service-info">
                            <div className="service-name">{service.category}</div>
                            <div className="service-provider">by {service.subcontractorName}</div>
                            <div className="service-price">{formatAsPeso(service.price)}</div>
                          </div>
                          <div
                              className="view-showcase hover:cursor-pointer hover:text-[#FFB22C]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowcaseData({ visible: true, id: service.id, title: service.name });
                              }}
                          >
                            See Details
                          </div>
                          <div className="service-checkbox-container">
                            <input
                              type="checkbox"
                              id={`service-${service.id}`}
                              checked={selectedServices[service.id.toString()] || false}
                              onChange={() => handleServiceChange(service.id)}
                              className="service-checkbox"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // Package Options
                  <div className="package-options">
                    {PACKAGES.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`package-card ${selectedPackage === pkg.id ? "selected" : ""}`}
                        onClick={() => handlePackageSelect(pkg.id)}
                      >
                        <div className="package-icon-container">
                          <div className="package-icon">{pkg.icon}</div>
                        </div>
                        <div className="package-info">
                          <div className="package-name">{pkg.name}</div>
                          <div className="package-description">{pkg.description}</div>
                          <div className="package-price">{formatAsPeso(pkg.price)}</div>
                        </div>
                        <div className="package-checkbox-container">
                          <input
                            type="radio"
                            id={`package-${pkg.id}`}
                            name="selectedPackage"
                            checked={selectedPackage === pkg.id}
                            onChange={() => handlePackageSelect(pkg.id)}
                            className="package-radio"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="navigation-buttons">
                <button className="previous-button" onClick={handlePrevious}>
                  Previous
                </button>
                <button
                  className={`next-button ${!hasValidSelection() ? "disabled" : ""}`}
                  onClick={handleNext}
                  disabled={!hasValidSelection()}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showcaseData.visible && (
          <ShocaseModal
              title={showcaseData.title}
              subcontractorId={showcaseData.id}
              onClose={() => setShowcaseData({ visible: false, id: null, title: "" })}
          />
      )}
      <Footer />
    </>
  )
}

export default SelectServicePage