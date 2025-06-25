"use client"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import Navbar from "../../Components/Navbar"
import Footer from "../../Components/Footer"
import { fetchAllPackages, findPackageByName, fetchPackageByName } from "../utils/booking-storage"

const PackagePage = () => {
  const { packageName } = useParams()
  const [packageData, setPackageData] = useState(null)
  const [packageServices, setPackageServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPackageData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // First try to get package details by name
        const packageDetails = await fetchPackageByName(packageName)

        if (packageDetails && packageDetails.length > 0) {
          // If we get services data, use the first package info
          const packageInfo = packageDetails[0]
          setPackageData({
            packageId: packageInfo.packageId,
            packageName: packageInfo.packageName,
            packagePrice: packageInfo.packagePrice,
            packageDescription: packageInfo.packageDescription,
          })
          setPackageServices(packageDetails)
        } else {
          // Fallback to general package list
          const packages = await fetchAllPackages()
          const foundPackage = findPackageByName(packageName, packages)

          if (foundPackage) {
            setPackageData(foundPackage)
            setPackageServices(foundPackage.services || [])
          } else {
            setError(`Package "${packageName}" not found`)
          }
        }
      } catch (error) {
        console.error("Error loading package data:", error)
        setError("Failed to load package information")
      } finally {
        setIsLoading(false)
      }
    }

    if (packageName) {
      loadPackageData()
    }
  }, [packageName])

  const formatPrice = (price) => {
    return `₱${price.toLocaleString()}`
  }

  const getPackageIcon = (packageName) => {
    const name = packageName.toLowerCase()
    if (name.includes("cherry") || name.includes("blossom")) return "🌸"
    if (name.includes("tulip")) return "🌷"
    if (name.includes("rose")) return "🌹"
    if (name.includes("premium") || name.includes("luxury")) return "💎"
    if (name.includes("basic") || name.includes("simple")) return "🌿"
    return "📦"
  }

  const handleBooking = () => {
    if (packageData) {
      // Store package information for the booking flow
      sessionStorage.setItem("currentPackageName", packageData.packageName)
      sessionStorage.setItem("selectedPackageId", packageData.packageId.toString())

      // Navigate to booking flow
      window.location.href = `/book/${encodeURIComponent(packageData.packageName)}/inputdetails-package`
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="package-page-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading package details...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="package-page-container">
          <div className="error-container">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4">
              <button
                className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
              <Link
                to="/events-dashboard"
                className="bg-gray-500 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-600 transition"
              >
                Back to Packages
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!packageData) {
    return (
      <>
        <Navbar />
        <div className="package-page-container">
          <div className="not-found-container">
            <h1 className="text-3xl font-bold mb-4">Package Not Found</h1>
            <p className="text-gray-600 mb-4">The package "{packageName}" could not be found.</p>
            <Link
              to="/events-dashboard"
              className="bg-black text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition"
            >
              Back to Packages
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="package-page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb mb-6">
          <Link to="/events-dashboard" className="text-gray-500 hover:text-gray-700">
            Packages
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{packageData.packageName}</span>
        </div>

        <div className="package-page-content">
          {/* Package Header */}
          <div className="package-header mb-8">
            <div className="package-icon text-6xl mb-4">{getPackageIcon(packageData.packageName)}</div>
            <h1 className="text-4xl font-bold mb-4">{packageData.packageName}</h1>
            <p className="text-3xl font-bold text-gray-800 mb-4">{formatPrice(packageData.packagePrice)}</p>
            <p className="text-lg text-gray-600 max-w-2xl">
              {packageData.packageDescription ||
                `Experience the perfect wedding with our ${packageData.packageName}. This comprehensive package includes everything you need for your special day.`}
            </p>
          </div>

          {/* Package Services */}
          {packageServices.length > 0 && (
            <div className="package-services mb-8">
              <h2 className="text-2xl font-bold mb-6">Included Services</h2>
              <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packageServices.map((service, index) => (
                  <div key={index} className="service-card bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-semibold mb-2">
                      {service.serviceName ||
                        service.subcontractor?.subcontractor_serviceName ||
                        `Service ${index + 1}`}
                    </h3>
                    {service.subcontractor && (
                      <div className="service-details text-sm text-gray-600">
                        {service.subcontractor.subcontractor_description && (
                          <p className="mb-2">{service.subcontractor.subcontractor_description}</p>
                        )}
                        {service.subcontractor.subcontractor_serviceCategory && (
                          <p className="text-xs text-gray-500">
                            Category: {service.subcontractor.subcontractor_serviceCategory}
                          </p>
                        )}
                        {service.subcontractor.subcontractor_service_price && (
                          <p className="text-xs text-gray-500">
                            Individual Price: {formatPrice(service.subcontractor.subcontractor_service_price)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Benefits */}
          <div className="package-benefits mb-8">
            <h2 className="text-2xl font-bold mb-6">Why Choose This Package?</h2>
            <div className="benefits-grid grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="benefit-card bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Complete Solution</h3>
                <p className="text-gray-600 text-sm">Everything you need for your wedding in one convenient package.</p>
              </div>
              <div className="benefit-card bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">💰 Best Value</h3>
                <p className="text-gray-600 text-sm">Save significantly compared to booking services individually.</p>
              </div>
              <div className="benefit-card bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">🤝 Expert Coordination</h3>
                <p className="text-gray-600 text-sm">
                  Our team handles all the coordination between service providers.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="booking-section bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Book?</h2>
            <p className="text-gray-600 mb-6">
              Start your wedding planning journey with our {packageData.packageName}. Our team will guide you through
              every step of the process.
            </p>
            <div className="booking-actions flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBooking}
                className="bg-black text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-800 transition"
              >
                Book This Package
              </button>
              <Link
                to="/events-dashboard"
                className="bg-gray-500 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-600 transition text-center"
              >
                View Other Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PackagePage
