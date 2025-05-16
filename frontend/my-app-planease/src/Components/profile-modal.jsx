"use client"

import { useEffect, useRef, useState } from "react"
import { Pencil, Check, X, KeyRound, MapPin, ChevronDown } from "lucide-react"
import axios from "axios"
import { Snackbar, Alert } from "@mui/material"

const API_BASE_URL = "http://localhost:8080"

export function ProfileModal({ open, onOpenChange }) {
  const modalRef = useRef(null)
  const [editMode, setEditMode] = useState(false)
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    region: "",
    province: "",
    cityAndMul: "",
    barangay: "",
    phone: "",
    profilePicture: null,
    role: "",
  })

  // Password change modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [isCheckingPassword, setIsCheckingPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Location state
  const [regions, setRegions] = useState([])
  const [provinces, setProvinces] = useState([])
  const [citiesMunicipalities, setCitiesMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])

  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCityMunicipality, setSelectedCityMunicipality] = useState("")
  const [selectedBarangay, setSelectedBarangay] = useState("")

  // Phone number state
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState({ code: "PH", dialCode: "+63", flag: "🇵🇭" })
  const [showCountryList, setShowCountryList] = useState(false)
  const countryListRef = useRef(null)

  // Countries data with flags and dial codes
  const [countries, setCountries] = useState([
    { code: "PH", dialCode: "+63", flag: "🇵🇭", name: "Philippines" }, // Default while loading
  ])

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  // Fetch countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag")
      .then((response) => response.json())
      .then((data) => {
        const formattedCountries = data
          .filter((country) => country.idd.root) // Only countries with dial codes
          .map((country) => ({
            code: country.cca2,
            dialCode: country.idd.root + (country.idd.suffixes?.[0] || ""),
            flag: country.flag,
            name: country.name.common,
          }))
          .sort((a, b) => a.name.localeCompare(b.name))

        // Set Philippines as first in the list
        const philippines = formattedCountries.find((c) => c.code === "PH")
        const withoutPH = formattedCountries.filter((c) => c.code !== "PH")

        setCountries([philippines, ...withoutPH].filter(Boolean))
      })
      .catch((error) => {
        console.error("Error fetching countries:", error)
      })
  }, [])

  // Close country dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (countryListRef.current && !countryListRef.current.contains(event.target)) {
        setShowCountryList(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch Regions on mount
  useEffect(() => {
    axios
      .get("https://psgc.gitlab.io/api/regions/")
      .then((res) => setRegions(res.data))
      .catch((err) => console.error("Error fetching regions:", err))
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token")

        const { data: userData } = await axios.get(`${API_BASE_URL}/user/getuser`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Fix: Use phoneNumber from userData
        const userPhone = userData.phoneNumber || ""

        setUser({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          region: userData.region || "",
          province: userData.province || "",
          cityAndMul: userData.cityAndMul || "",
          barangay: userData.barangay || "",
          phone: userPhone,
          profilePicture: userData.profilePicture || null,
          role: userData.role || "",
        })

        // Extract phone number without country code if it exists
        if (userPhone) {
          // Try to match the phone number format (e.g., +63912345678)
          const phoneMatch = userPhone.match(/^\+(\d+)(\d{9,})$/)
          if (phoneMatch) {
            const countryCode = `+${phoneMatch[1]}`
            const phoneNum = phoneMatch[2]

            // Find the country by dial code
            const country = countries.find((c) => c.dialCode === countryCode) || countries[0]
            setSelectedCountry(country)
            setPhoneNumber(phoneNum)
          } else {
            // If format doesn't match, just use the whole string
            setPhoneNumber(userPhone.replace(/^\+\d+/, "")) // Remove country code if present
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    if (open) fetchUser()
  }, [open, countries])

  // Set up location dropdowns when user data is loaded
  useEffect(() => {
    const setupLocationData = async () => {
      if (user.region) {
        // Find the region code by name
        const regionData = regions.find((r) => r.name === user.region)
        if (regionData) {
          setSelectedRegion(regionData.code)

          // Fetch provinces for this region
          try {
            const { data } = await axios.get(`https://psgc.gitlab.io/api/regions/${regionData.code}/provinces/`)
            setProvinces(data)

            // Find province by name
            if (user.province) {
              const provinceData = data.find((p) => p.name === user.province)
              if (provinceData) {
                setSelectedProvince(provinceData.code)

                // Fetch cities for this province
                try {
                  const { data: citiesData } = await axios.get(
                    `https://psgc.gitlab.io/api/provinces/${provinceData.code}/cities-municipalities/`,
                  )
                  setCitiesMunicipalities(citiesData)

                  // Find city by name
                  if (user.cityAndMul) {
                    const cityData = citiesData.find((c) => c.name === user.cityAndMul)
                    if (cityData) {
                      setSelectedCityMunicipality(cityData.code)

                      // Fetch barangays for this city
                      try {
                        const { data: barangaysData } = await axios.get(
                          `https://psgc.gitlab.io/api/cities-municipalities/${cityData.code}/barangays/`,
                        )
                        setBarangays(barangaysData)

                        // Find barangay by name
                        if (user.barangay) {
                          const barangayData = barangaysData.find((b) => b.name === user.barangay)
                          if (barangayData) {
                            setSelectedBarangay(barangayData.code)
                          }
                        }
                      } catch (err) {
                        console.error("Error fetching barangays:", err)
                      }
                    }
                  }
                } catch (err) {
                  console.error("Error fetching cities:", err)
                }
              }
            }
          } catch (err) {
            console.error("Error fetching provinces:", err)
          }
        }
      }
    }

    if (regions.length > 0 && user.region) {
      setupLocationData()
    }
  }, [regions, user.region, user.province, user.cityAndMul, user.barangay])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onOpenChange(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") onOpenChange(false)
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "auto"
    }
  }, [open, onOpenChange])

  if (!open) return null

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }))
  }

  // Generate full address from components
  const getFullAddress = () => {
    const parts = [user.barangay, user.cityAndMul, user.province, user.region].filter(
      (part) => part && part.trim() !== "",
    )

    return parts.length > 0 ? parts.join(", ") : "No address provided"
  }

  // Handle region change
  const handleRegionChange = async (e) => {
    const regionCode = e.target.value
    const regionName = e.target.options[e.target.selectedIndex].text

    setSelectedRegion(regionCode)
    handleChange("region", regionName)

    setSelectedProvince("")
    setSelectedCityMunicipality("")
    setSelectedBarangay("")
    handleChange("province", "")
    handleChange("cityAndMul", "")
    handleChange("barangay", "")

    setProvinces([])
    setCitiesMunicipalities([])
    setBarangays([])

    if (regionCode) {
      try {
        const { data } = await axios.get(`https://psgc.gitlab.io/api/regions/${regionCode}/provinces/`)
        setProvinces(data)
      } catch (err) {
        console.error("Error fetching provinces:", err)
      }
    }
  }

  // Handle province change
  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value
    const provinceName = e.target.options[e.target.selectedIndex].text

    setSelectedProvince(provinceCode)
    handleChange("province", provinceName)

    setSelectedCityMunicipality("")
    setSelectedBarangay("")
    handleChange("cityAndMul", "")
    handleChange("barangay", "")

    setCitiesMunicipalities([])
    setBarangays([])

    if (provinceCode) {
      try {
        const { data } = await axios.get(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`)
        setCitiesMunicipalities(data)
      } catch (err) {
        console.error("Error fetching cities:", err)
      }
    }
  }

  // Handle city/municipality change
  const handleCityMunicipalityChange = async (e) => {
    const cityCode = e.target.value
    const cityName = e.target.options[e.target.selectedIndex].text

    setSelectedCityMunicipality(cityCode)
    handleChange("cityAndMul", cityName)

    setSelectedBarangay("")
    handleChange("barangay", "")

    setBarangays([])

    if (cityCode) {
      try {
        const { data } = await axios.get(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`)
        setBarangays(data)
      } catch (err) {
        console.error("Error fetching barangays:", err)
      }
    }
  }

  // Handle barangay change
  const handleBarangayChange = (e) => {
    const barangayCode = e.target.value
    const barangayName = e.target.options[e.target.selectedIndex].text

    setSelectedBarangay(barangayCode)
    handleChange("barangay", barangayName)
  }

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No authentication token found")
        return
      }

      // Prepare the updated user data
      const updatedUser = {
        firstname: user.firstname,
        lastname: user.lastname,
        phoneNumber: user.phone, // Using the full phone number with country code
        region: user.region,
        province: user.province,
        cityAndMul: user.cityAndMul,
        barangay: user.barangay,
      }

      // Call the update endpoint
      const response = await axios.put(`${API_BASE_URL}/user/update`, updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        // Update was successful
        setEditMode(false)

        // Show success message with snackbar
        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Failed to update user profile:", error)

      // Show error message
      if (error.response && error.response.status === 404) {
        setSnackbar({
          open: true,
          message: "User not found. Please try again.",
          severity: "error",
        })
      } else if (error.response && error.response.status === 401) {
        setSnackbar({
          open: true,
          message: "Unauthorized. Please log in again.",
          severity: "error",
        })
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update profile. Please try again.",
          severity: "error",
        })
      }
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  // Handle phone number change
  const handlePhoneNumberChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setPhoneNumber(value)

    // Update the full phone number in user state
    handleChange("phone", selectedCountry.dialCode + value)
  }

  // Check if phone number is empty - fix the check to use the actual phone number
  const isPhoneEmpty = !user.phone || user.phone.trim() === ""

  // Password validation function
  const validatePassword = (password) => {
    const errors = []
    let strength = 0

    // Check if it contains a capital letter
    if (/[A-Z]/.test(password)) {
      strength += 1
    } else {
      errors.push("Must have a capital letter")
    }

    // Check if it contains a number
    if (/\d/.test(password)) {
      strength += 1
    } else if (!errors.includes("Must have a capital letter")) {
      errors.push("Must have a number")
    }

    // Check if it contains a unique character
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1
    } else if (!errors.includes("Must have a capital letter") && !errors.includes("Must have a number")) {
      errors.push("Must have a unique character")
    }

    setPasswordStrength(strength)
    setPasswordErrors(errors)
  }

  const handleNewPasswordChange = (e) => {
    const newPasswordValue = e.target.value
    setNewPassword(newPasswordValue)
    validatePassword(newPasswordValue)

    if (confirmNewPassword) {
      setPasswordsMatch(confirmNewPassword === newPasswordValue)
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmNewPassword(value)
    setPasswordsMatch(value === newPassword)
  }

  const handleCheckPassword = async () => {
    if (!currentPassword) {
      setPasswordError("Please enter your current password")
      return
    }

    setIsCheckingPassword(true)
    setPasswordError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setPasswordError("You are not logged in")
        setIsCheckingPassword(false)
        return
      }

      const response = await axios.post(
        `${API_BASE_URL}/user/check-password`,
        { password: currentPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.data.match) {
        // Password is correct, show the new password modal
        setShowPasswordModal(false)
        setShowNewPasswordModal(true)
        setCurrentPassword("")
      } else {
        setPasswordError("Incorrect password")
      }
    } catch (error) {
      console.error("Error checking password:", error)
      setPasswordError("Failed to verify password. Please try again.")
    } finally {
      setIsCheckingPassword(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (passwordStrength < 3) {
      setPasswordError("Password does not meet requirements")
      return
    }

    if (!passwordsMatch) {
      setPasswordError("Passwords do not match")
      return
    }

    setIsChangingPassword(true)
    setPasswordError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setPasswordError("You are not logged in")
        setIsChangingPassword(false)
        return
      }

      const response = await axios.put(
        `${API_BASE_URL}/user/update-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.status === 200) {
        // Password updated successfully
        setShowNewPasswordModal(false)
        setNewPassword("")
        setConfirmNewPassword("")
        setPasswordStrength(0)
        setPasswordErrors([])

        // Show success message
        setSnackbar({
          open: true,
          message: "Password updated successfully",
          severity: "success",
        })
      }
    } catch (error) {
      console.error("Error updating password:", error)
      setPasswordError("Failed to update password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-18">
      <div
        ref={modalRef}
        className="bg-white rounded-md shadow-lg w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Top header bar */}
        <div className="bg-slate-900 h-12 relative flex items-center justify-between px-4">
          <div></div>
          <button onClick={() => onOpenChange(false)} className="text-white hover:text-gray-300" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Profile Header */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Profile Image */}
              {user.profilePicture ? (
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-400 flex items-center justify-center text-white text-3xl font-semibold select-none">
                  {user.firstname ? user.firstname.charAt(0).toUpperCase() : "?"}
                </div>
              )}

              {/* Profile Info */}
              <div>
                <div className="text-xl font-semibold">
                  {user.firstname} {user.lastname}
                </div>
                <div className="text-sm text-gray-500 mb-1">{user.role || "No Role"}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-1" />
                  <span className="line-clamp-2">{getFullAddress()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (editMode) {
                    // Save changes
                    handleSaveChanges()
                  } else {
                    // Enter edit mode
                    setEditMode(true)
                  }
                }}
                className="flex items-center px-3 py-2 h-9 text-sm text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
              >
                {editMode ? <Check size={16} className="mr-2" /> : <Pencil size={16} className="mr-2" />}
                {editMode ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center px-3 py-2 h-9 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <KeyRound size={16} className="mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-5">
                <InputField
                  label="Firstname"
                  value={user.firstname}
                  onChange={(val) => handleChange("firstname", val)}
                  editable={editMode}
                />
                <InputField
                  label="Email"
                  value={user.email}
                  onChange={(val) => handleChange("email", val)}
                  editable={editMode}
                />
              </div>

              {/* Right */}
              <div className="space-y-5">
                <InputField
                  label="Lastname"
                  value={user.lastname}
                  onChange={(val) => handleChange("lastname", val)}
                  editable={editMode}
                />

                {/* Phone Number with country code */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600">Phone number</label>
                    {isPhoneEmpty && <span className="text-red-500 text-xs">(Fill In)</span>}
                  </div>

                  {editMode ? (
                    <div className="flex">
                      <div className="relative">
                        <button
                          type="button"
                          className="flex items-center justify-between h-11 px-3 bg-white border border-gray-300 focus:border-blue-500 transition-colors rounded-l"
                          onClick={() => setShowCountryList(!showCountryList)}
                          aria-label="Select country code"
                        >
                          <span className="mr-2 text-lg">{selectedCountry.flag}</span>
                          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                          <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                        </button>

                        {/* Country dropdown */}
                        {showCountryList && (
                          <div
                            ref={countryListRef}
                            className="absolute z-10 mt-1 w-64 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg"
                          >
                            <div className="sticky top-0 bg-white border-b">
                              <input
                                type="text"
                                placeholder="Search countries..."
                                className="w-full p-2 text-sm border-none focus:outline-none"
                                onChange={(e) => {
                                  // Search functionality could be added here
                                }}
                              />
                            </div>
                            {countries.map((country) => (
                              <button
                                key={country.code}
                                type="button"
                                className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                onClick={() => {
                                  setSelectedCountry(country)
                                  setShowCountryList(false)
                                  // Update the full phone number in user state
                                  handleChange("phone", country.dialCode + phoneNumber)
                                }}
                              >
                                <span className="mr-2 text-lg">{country.flag}</span>
                                <span className="text-sm">{country.name}</span>
                                <span className="ml-auto text-sm text-gray-500">{country.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder={phoneNumber || "9123456789"}
                        className={`w-full h-11 px-3 py-2 border border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isPhoneEmpty ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={user.phone || "Empty"}
                      readOnly
                      className="w-full h-11 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Address Information</h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Left */}
              <div className="space-y-5">
                {/* Region */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600">Region</label>
                    {(!user.region || user.region.trim() === "") && (
                      <span className="text-red-500 text-xs">(Fill In)</span>
                    )}
                  </div>
                  {editMode ? (
                    <select
                      className={`w-full h-11 px-3 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all ${
                        !user.region || user.region.trim() === "" ? "border-red-500" : ""
                      }`}
                      onChange={handleRegionChange}
                      value={selectedRegion}
                    >
                      <option value="">Select Region</option>
                      {regions.map((region) => (
                        <option key={region.code} value={region.code}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={user.region || "Empty"}
                      readOnly
                      className="w-full h-11 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>

                {/* City/Municipality */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600">City/Municipality</label>
                    {(!user.cityAndMul || user.cityAndMul.trim() === "") && (
                      <span className="text-red-500 text-xs">(Fill In)</span>
                    )}
                  </div>
                  {editMode ? (
                    <select
                      className={`w-full h-11 px-3 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all ${
                        !user.cityAndMul || user.cityAndMul.trim() === "" ? "border-red-500" : ""
                      }`}
                      onChange={handleCityMunicipalityChange}
                      disabled={!selectedProvince}
                      value={selectedCityMunicipality}
                    >
                      <option value="">Select City/Municipality</option>
                      {citiesMunicipalities.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={user.cityAndMul || "Empty"}
                      readOnly
                      className="w-full h-11 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="space-y-5">
                {/* Province */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600">Province</label>
                    {(!user.province || user.province.trim() === "") && (
                      <span className="text-red-500 text-xs">(Fill In)</span>
                    )}
                  </div>
                  {editMode ? (
                    <select
                      className={`w-full h-11 px-3 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all ${
                        !user.province || user.province.trim() === "" ? "border-red-500" : ""
                      }`}
                      onChange={handleProvinceChange}
                      disabled={!selectedRegion}
                      value={selectedProvince}
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={user.province || "Empty"}
                      readOnly
                      className="w-full h-11 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>

                {/* Barangay */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm text-gray-600">Barangay</label>
                    {(!user.barangay || user.barangay.trim() === "") && (
                      <span className="text-red-500 text-xs">(Fill In)</span>
                    )}
                  </div>
                  {editMode ? (
                    <select
                      className={`w-full h-11 px-3 py-2 border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all ${
                        !user.barangay || user.barangay.trim() === "" ? "border-red-500" : ""
                      }`}
                      onChange={handleBarangayChange}
                      disabled={!selectedCityMunicipality}
                      value={selectedBarangay}
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay.code} value={barangay.code}>
                          {barangay.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={user.barangay || "Empty"}
                      readOnly
                      className="w-full h-11 px-3 py-2 border rounded-md text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Alert
          onClose={(e) => {
            e.stopPropagation()
            handleCloseSnackbar(e)
          }}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Current Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={(e) => e.stopPropagation()}>
          <div
            className="bg-white rounded-md shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-slate-900 h-12 relative flex items-center justify-between px-4">
              <div className="text-white font-medium">Verify Password</div>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setCurrentPassword("")
                  setPasswordError("")
                }}
                className="text-white hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">Please enter your current password to continue</p>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{passwordError}</div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false)
                      setCurrentPassword("")
                      setPasswordError("")
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckPassword}
                    disabled={isCheckingPassword}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-70"
                  >
                    {isCheckingPassword ? "Verifying..." : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Password Modal */}
      {showNewPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={(e) => e.stopPropagation()}>
          <div
            className="bg-white rounded-md shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-slate-900 h-12 relative flex items-center justify-between px-4">
              <div className="text-white font-medium">Change Password</div>
              <button
                onClick={() => {
                  setShowNewPasswordModal(false)
                  setNewPassword("")
                  setConfirmNewPassword("")
                  setPasswordError("")
                  setPasswordStrength(0)
                  setPasswordErrors([])
                }}
                className="text-white hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">Create a new password for your account</p>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">{passwordError}</div>
              )}

              <div className="space-y-4">
                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                {/* Password Strength */}
                {newPassword && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-700">Password Strength</div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            passwordStrength === 3
                              ? "bg-green-500"
                              : passwordStrength === 2
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${(passwordStrength / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Password requirements */}
                    {passwordErrors.length > 0 && (
                      <div className="space-y-1 text-sm text-red-500">
                        {passwordErrors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Confirm New Password */}
                {passwordStrength === 3 && (
                  <div className="space-y-2">
                    <label htmlFor="confirm-new-password" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                      />
                    </div>
                    {!passwordsMatch && confirmNewPassword && (
                      <div className="text-sm text-red-500">Passwords do not match</div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => {
                      setShowNewPasswordModal(false)
                      setNewPassword("")
                      setConfirmNewPassword("")
                      setPasswordError("")
                      setPasswordStrength(0)
                      setPasswordErrors([])
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isChangingPassword || passwordStrength < 3 || !passwordsMatch || !confirmNewPassword}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-70"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InputField({ label, value, onChange, editable }) {
  // Ensure value is always a string
  const safeValue = value || ""
  const isEmpty = safeValue.trim() === ""

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm text-gray-600">{label}</label>
        {isEmpty && <span className="text-red-500 text-xs">(Fill In)</span>}
      </div>
      <input
        type="text"
        // Always provide a string value to keep the input controlled
        value={editable ? safeValue : isEmpty ? "Empty" : safeValue}
        onChange={(e) => onChange(e.target.value)}
        readOnly={!editable}
        className={`w-full h-11 px-3 py-2 border rounded-md text-sm 
          ${editable ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" : "bg-gray-100 text-gray-500 cursor-not-allowed"} 
          ${isEmpty && editable ? "border-red-500" : ""}`}
      />
    </div>
  )
}
