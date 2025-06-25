"use client"

import { useState, useRef, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import "./styles/paymentproof-page.css"
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer"
import BookingSidePanel from "../../Components/Booking-sidepanel"
import { getCompleteBookingData, clearBookingData, PACKAGES } from "./utils/booking-storage"
import axios from "axios"
import MessageModal from "../../Components/MessageModal"

const PaymentProofPage = () => {
  const navigate = useNavigate()
  const { eventName } = useParams()
  const fileInputRef = useRef(null)

  // Get event name from params or sessionStorage as fallback
  const currentEventName = eventName || sessionStorage.getItem("currentEventName") || "Event"
  const storedInfo = sessionStorage.getItem("bookingPersonalInfo");
  const currentEmail = storedInfo ? JSON.parse(storedInfo).email : null;

  const [uploadedFile, setUploadedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState("")

  // Get booking data for payment amount
  const [bookingData, setBookingData] = useState(getCompleteBookingData)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [pendingNavigation, setPendingNavigation] = useState(false)

  // Refresh booking data when component mounts
  useEffect(() => {
    setBookingData(getCompleteBookingData())
  }, [])

  // Calculate payment amount (10% of subtotal) using actual service prices
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

  const subtotal = calculateSubtotal()
  const paymentAmount = subtotal * 0.1 // 10% downpayment

  // Format number as Philippine Peso
  const formatAsPeso = (amount) => {
    return "₱" + amount.toLocaleString()
  }

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showModal("Please upload an image file (JPG, PNG, etc.)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showModal("File size must be less than 5MB")
        return
      }

      setUploadedFile(file)

      // Generate preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle click on upload area
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showModal("Please upload an image file (JPG, PNG, etc.)")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showModal("File size must be less than 5MB")
        return
      }

      setUploadedFile(file)

      // Generate preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Helper function to get selected service IDs (subcontractor IDs)
  const getSelectedServiceIds = (selectedServices) => {
    const selectedIds = []

    console.log("Processing selected services:", selectedServices)

    // selectedServices is an object with subcontractor IDs as keys and boolean values
    Object.entries(selectedServices).forEach(([serviceId, isSelected]) => {
      if (isSelected) {
        // Convert string ID to number (subcontractor_Id)
        const numericId = Number.parseInt(serviceId)
        if (!isNaN(numericId)) {
          selectedIds.push(numericId)
        }
      }
    })

    console.log("Selected service IDs to send:", selectedIds)
    return selectedIds.length > 0 ? selectedIds : null
  }

  // Helper function to get package ID
  const getPackageId = (packageName) => {
    const packageMap = {
      "cherry-blossom": 1,
      tulip: 2,
      rose: 3,
    }
    return packageMap[packageName] || null
  }

  // Convert date string to SQL Date format
  const convertToSqlDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toISOString().split("T")[0] // Returns YYYY-MM-DD format
  }

  // Validate booking data before submission
  const validateBookingData = () => {
    const { personalInfo, eventDetails, servicesData } = bookingData

    if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email || !personalInfo.contact) {
      showModal("Missing personal information. Please go back and complete all required fields.")
      return false
    }
    if (!eventDetails.location || !eventDetails.eventDate) {
      showModal("Missing event details. Please go back and complete all required fields.")
      return false
    }
    if (servicesData.activeTab === "package") {
      if (!servicesData.selectedPackage) {
        showModal("No package selected. Please go back and select a package.")
        return false
      }
    } else if (servicesData.activeTab === "custom") {
      const hasSelectedServices = Object.values(servicesData.selectedServices).some((selected) => selected)
      if (!hasSelectedServices) {
        showModal("No services selected. Please go back and select at least one service.")
        return false
      }
    }
    return true
  }

  const handleDeleteFormDraft =  async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await axios.delete(`http://localhost:8080/form-draft/delete/${currentEmail}/${currentEventName}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch (error) {
      console.error("Error fetching form progress:", error);
    }

  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!uploadedFile) {
      showModal("Please upload your payment proof before submitting")
      return
    }
    if (!referenceNumber.trim()) {
      showModal("Please enter your payment reference number")
      return
    }
    if (!/^\d+$/.test(referenceNumber.trim())) {
      showModal("Payment reference number must contain only numbers")
      return
    }
    if (!validateBookingData()) {
      return
    }
    if (paymentAmount <= 0) {
      showModal("Invalid payment amount. Please check your service selection.")
      return
    }
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        showModal("Please log in to continue")
        setIsSubmitting(false)
        return
      }

      // Get user email from token
      const userResponse = await axios.get("http://localhost:8080/user/getuser", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const userEmail = userResponse.data.email

      console.log("User email:", userEmail)
      console.log("Booking data:", bookingData)

      // Prepare booking transaction data matching the exact DTO structure
      const transactionData = {
        // Personal Information
        firstName: bookingData.personalInfo.firstName,
        lastName: bookingData.personalInfo.lastName,
        email: bookingData.personalInfo.email,
        contact: bookingData.personalInfo.contact,

        // Event Details
        eventName: currentEventName,
        eventId: Number.parseInt(sessionStorage.getItem("currentEventId")) || 1, // Use 1 as default instead of 0
        transactionVenue: bookingData.eventDetails.location,
        transactionDate: convertToSqlDate(bookingData.eventDetails.eventDate),
        transactionNote: bookingData.eventDetails.note || "",

        // Services - Use serviceIds (subcontractor IDs) for custom services
        serviceType: bookingData.servicesData.activeTab === "package" ? "PACKAGE" : "CUSTOM",
        packageId:
          bookingData.servicesData.activeTab === "package"
            ? getPackageId(bookingData.servicesData.selectedPackage)
            : null,
        serviceIds:
          bookingData.servicesData.activeTab === "custom"
            ? getSelectedServiceIds(bookingData.servicesData.selectedServices)
            : null,

        // Payment Information - matching DTO fields exactly
        paymentNote: `Payment for ${currentEventName} booking - Amount: ${formatAsPeso(paymentAmount)} - Ref: ${referenceNumber}`,
        paymentReferenceNumber: referenceNumber, // Keep as string for DTO, backend will convert
        // paymentReceipt will be set by backend after file upload

        // User
        userEmail: userEmail,
      }

      console.log("=== TRANSACTION DATA DEBUG ===")
      console.log("Service Type:", transactionData.serviceType)
      console.log("Package ID:", transactionData.packageId)
      console.log("Service IDs (subcontractor IDs):", transactionData.serviceIds)
      console.log("Payment Amount:", formatAsPeso(paymentAmount))
      console.log("Transaction Date:", transactionData.transactionDate)
      console.log("Complete transaction data:", transactionData)

      // Validate that we have either package OR services, not both or neither
      if (transactionData.packageId && transactionData.serviceIds) {
        showModal("Error: Cannot have both package and custom services selected")
        setIsSubmitting(false)
        return
      }

      if (!transactionData.packageId && (!transactionData.serviceIds || transactionData.serviceIds.length === 0)) {
        showModal("Error: Must select either a package or custom services")
        setIsSubmitting(false)
        return
      }

      // Create FormData for multipart request
      const formData = new FormData()
      formData.append("paymentProof", uploadedFile)
      formData.append("bookingData", JSON.stringify(transactionData))

      console.log("FormData contents:")
      console.log("- paymentProof file:", uploadedFile.name, uploadedFile.type, uploadedFile.size)
      console.log("- bookingData JSON:", JSON.stringify(transactionData))

      // Submit to backend
      const response = await axios.post("http://localhost:8080/api/transactions/createBookingTransaction", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Response:", response.data)

      if (response.data.success) {
        setSubmitSuccess(true)

        // Clear booking data from sessionStorage
        clearBookingData()

        // Send notification to admins using new endpoint
        await axios.post(
          "http://localhost:8080/api/notifications/notify-admins",
          null,
          {
            params: { message: `New event booking submitted: ${currentEventName}` },
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        handleDeleteFormDraft()

        // Show success message and redirect
        setTimeout(() => {
          showModal("You successfully booked your request!", true)
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting booking:", error)
      console.error("Error response:", error.response?.data)
      console.error("Error status:", error.response?.status)

      // Show more specific error message
      const errorMessage =
        error.response?.data?.message || error.response?.data || "Failed to submit booking. Please try again."
      showModal(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle previous button click
  const handlePrevious = () => {
    if (eventName) {
      navigate(`/book/${encodeURIComponent(eventName)}/preview`)
    } else {
      navigate("/book/preview")
    }
  }

  // Check if form is ready for submission
  const isFormReady = () => {
    return referenceNumber.trim() && uploadedFile && !isSubmitting && !submitSuccess && paymentAmount > 0
  }

  // Replace all alert() usages with modal
  const showModal = (message, navigateAfter = false) => {
    setModalMessage(message)
    setModalOpen(true)
    setPendingNavigation(navigateAfter)
  }

  return (
    <>
      <Navbar />
      <div className="booking-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <Link to="/home">Home</Link> /{" "}
          <Link to={`/event/${encodeURIComponent(currentEventName)}`}>{currentEventName}</Link> / <span>Book Now</span>
        </div>

        <div className="booking-content">
          {/* Side Panel */}
          <BookingSidePanel activeStep="upload-payment" />

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
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-label">Preview</div>
              </div>
              <div className="step-line"></div>
              <div className="step active">
                <div className="step-number">4</div>
                <div className="step-label">Payment</div>
              </div>
            </div>

            {/* Payment Content */}
            <div className="payment-content">
              <h2 className="section-title">
                Payment for {currentEventName} <span className="info-icon">ⓘ</span>
              </h2>

              {/* Payment Amount Summary */}
              <div className="payment-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{formatAsPeso(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Downpayment (10%):</span>
                  <span>{formatAsPeso(paymentAmount)}</span>
                </div>
                <div className="summary-row total">
                  <span>Amount to Pay:</span>
                  <strong>{formatAsPeso(paymentAmount)}</strong>
                </div>
              </div>

              {/* Payment QR Code Section */}
              <div className="payment-qr-section">
                <img src="/eventEase.jpg" alt="Payment QR Code" className="payment-qr" />
                <div className="payment-amount">
                  <span>Scan to pay:</span> <strong>{formatAsPeso(paymentAmount)}</strong>
                </div>
              </div>

              {/* Reference Number Section */}
              <h2 className="section-title">
                Payment Reference Number <span className="info-icon">ⓘ</span>
              </h2>

              <div className="reference-number-section">
                <p className="reference-instruction">
                  After making your payment, please enter the reference number from your transaction receipt below:
                </p>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter payment reference number (e.g., 1234567890)"
                  className="reference-input"
                  required
                />
              </div>

              {/* Proof of Payment Section */}
              <h2 className="section-title">
                Proof of Payment <span className="info-icon">ⓘ</span>
              </h2>

              <form onSubmit={handleSubmit}>
                <div
                  className={`upload-area ${previewUrl ? "has-file" : ""} ${!referenceNumber ? "disabled" : ""}`}
                  onClick={referenceNumber ? handleUploadClick : null}
                  onDrop={referenceNumber ? handleDrop : null}
                  onDragOver={referenceNumber ? handleDragOver : null}
                >
                  {!referenceNumber ? (
                    <div className="upload-placeholder disabled">
                      <div className="upload-icon">⚠️</div>
                      <div>Please enter reference number first</div>
                    </div>
                  ) : previewUrl ? (
                    <div className="preview-container">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Payment Proof Preview"
                        className="file-preview"
                      />
                      <div className="file-info">
                        <div className="file-name">{uploadedFile.name}</div>
                        <div className="file-size">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <button
                        type="button"
                        className="change-file-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUploadClick()
                        }}
                      >
                        Change File
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <div className="upload-icon">↑</div>
                      <div>Click here to upload or drop image here</div>
                      <div className="upload-hint">Supported: JPG, PNG (Max 5MB)</div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    required
                    disabled={!referenceNumber}
                  />
                </div>

                {/* Validation Messages */}
                {paymentAmount <= 0 && (
                  <div className="validation-error">
                    <p>⚠️ Invalid payment amount. Please go back and select services.</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                  <button type="button" className="previous-button" onClick={handlePrevious} disabled={isSubmitting}>
                    Previous
                  </button>
                  <button
                    type="submit"
                    className={`submit-button ${!isFormReady() ? "disabled" : ""}`}
                    disabled={!isFormReady()}
                  >
                    {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted ✓" : "Submit Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <MessageModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          if (pendingNavigation) {
            setPendingNavigation(false)
            navigate("/home")
          }
        }}
        message={modalMessage}
      />
    </>
  )
}

export default PaymentProofPage