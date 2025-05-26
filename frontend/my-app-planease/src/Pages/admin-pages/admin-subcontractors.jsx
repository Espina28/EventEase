"use client"

import { useState, useRef, useEffect } from "react"
import Divider from "@mui/material/Divider"
import Navbar from "../../Components/Navbar"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import AdminSideBar from "./admin-sidebar"
import "../../index.css"
import {
  Box,
  IconButton,
  Modal,
  Stack,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import axios from "axios"
import { Visibility, VisibilityOff, KeyboardArrowDown } from "@mui/icons-material"

// API service functions
const API_BASE_URL = "http://localhost:8080"

// Create separate axios instance for PSGC API (without auth headers)
const psgcApi = axios.create({
  baseURL: "https://psgc.gitlab.io/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Service categories for the dropdown
const SERVICE_CATEGORIES = [
  "Food & Catering",
  "Photography & Videography", 
  "Entertainment & Music",
  "Decoration & Styling",
  "Venue & Location",
  "Transportation",
  "Floral Arrangements",
  "Audio & Visual Equipment",
  "Event Planning & Coordination",
  "Security Services",
  "Cleaning Services",
  "Other Services"
]

const getAuthToken = () => {
  return localStorage.getItem("token") || ""
}

const AdminSubContractors = () => {
  const [activeGallery, setActiveGallery] = useState(null)
  const [isEditingAbout, setIsEditingAbout] = useState(false)
  const [aboutUsText, setAboutUsText] = useState(
    "Hi! We are passionate about bringing delicious food and memorable dining experience to your special events...",
  )
  const [open, setOpen] = useState(false)
  const [editMediaOpen, setEditMediaOpen] = useState(false)
  const [itemData, setItemData] = useState([])
  const [selectedImage, setSelectedImage] = useState([])

  // State for subcontractors
  const [subcontractors, setSubcontractors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form fields for new subcontractor
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordErrors, setPasswordErrors] = useState([])
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [service, setService] = useState("")
  const [serviceCategory, setServiceCategory] = useState("") // Service category field
  const [servicePrice, setServicePrice] = useState("") // New field for service price

  // Phone number fields
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedCountry, setSelectedCountry] = useState({
    code: "PH",
    dialCode: "+63",
    flag: "🇵🇭",
    name: "Philippines",
  })
  const [showCountryList, setShowCountryList] = useState(false)
  const [countries, setCountries] = useState([{ code: "PH", dialCode: "+63", flag: "🇵🇭", name: "Philippines" }])

  // Location fields
  const [regions, setRegions] = useState([])
  const [provinces, setProvinces] = useState([])
  const [citiesMunicipalities, setCitiesMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])

  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCityMunicipality, setSelectedCityMunicipality] = useState("")
  const [selectedBarangay, setSelectedBarangay] = useState("")

  const [selectedRegionName, setSelectedRegionName] = useState("")
  const [selectedProvinceName, setSelectedProvinceName] = useState("")
  const [selectedCityMunicipalityName, setSelectedCityMunicipalityName] = useState("")
  const [selectedBarangayName, setSelectedBarangayName] = useState("")

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const theme = useTheme()
  const dropRef = useRef(null)
  const countryListRef = useRef(null)

  // Fetch subcontractors on component mount
  useEffect(() => {
    fetchSubcontractors()
    fetchCountries()
    fetchRegions()
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

  const fetchSubcontractors = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      // Use regular axios for backend API calls (with auth headers)
      const response = await axios.get(`${API_BASE_URL}/subcontractor/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSubcontractors(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching subcontractors:", err)
      setError("Failed to fetch subcontractors. Please try again later.")
      setSubcontractors([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag")
      const data = await response.json()

      const formattedCountries = data
        .filter((country) => country.idd && country.idd.root) // Only countries with dial codes
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
    } catch (error) {
      console.error("Error fetching countries:", error)
      // Keep the default Philippines entry if the API fails
    }
  }

  // Updated fetchRegions function using separate PSGC axios instance
  const fetchRegions = async () => {
    try {
      const response = await psgcApi.get("/regions/")
      setRegions(response.data || [])
    } catch (error) {
      console.error("Error fetching regions:", error)
      setRegions([])
    }
  }

  // Updated handleRegionChange function using separate PSGC axios instance
  const handleRegionChange = async (event) => {
    const regionCode = event.target.value
    const regionName = event.target.options
      ? event.target.options[event.target.selectedIndex].text
      : regions.find((region) => region.code === regionCode)?.name || ""

    setSelectedRegion(regionCode)
    setSelectedRegionName(regionName)

    // Reset dependent fields
    setSelectedProvince("")
    setSelectedProvinceName("")
    setSelectedCityMunicipality("")
    setSelectedCityMunicipalityName("")
    setSelectedBarangay("")
    setSelectedBarangayName("")

    setProvinces([])
    setCitiesMunicipalities([])
    setBarangays([])

    if (regionCode) {
      try {
        const { data } = await psgcApi.get(`/regions/${regionCode}/provinces/`)
        setProvinces(data || [])
      } catch (error) {
        console.error("Error fetching provinces:", error)
        setProvinces([])
      }
    }
  }

  // Updated handleProvinceChange function using separate PSGC axios instance
  const handleProvinceChange = async (event) => {
    const provinceCode = event.target.value
    const provinceName = event.target.options
      ? event.target.options[event.target.selectedIndex].text
      : provinces.find((province) => province.code === provinceCode)?.name || ""

    setSelectedProvince(provinceCode)
    setSelectedProvinceName(provinceName)

    // Reset dependent fields
    setSelectedCityMunicipality("")
    setSelectedCityMunicipalityName("")
    setSelectedBarangay("")
    setSelectedBarangayName("")

    setCitiesMunicipalities([])
    setBarangays([])

    if (provinceCode) {
      try {
        const { data } = await psgcApi.get(`/provinces/${provinceCode}/cities-municipalities/`)
        setCitiesMunicipalities(data || [])
      } catch (error) {
        console.error("Error fetching cities/municipalities:", error)
        setCitiesMunicipalities([])
      }
    }
  }

  // Updated handleCityMunicipalityChange function using separate PSGC axios instance
  const handleCityMunicipalityChange = async (event) => {
    const cityCode = event.target.value
    const cityName = event.target.options
      ? event.target.options[event.target.selectedIndex].text
      : citiesMunicipalities.find((city) => city.code === cityCode)?.name || ""

    setSelectedCityMunicipality(cityCode)
    setSelectedCityMunicipalityName(cityName)

    // Reset dependent fields
    setSelectedBarangay("")
    setSelectedBarangayName("")

    setBarangays([])

    if (cityCode) {
      try {
        const { data } = await psgcApi.get(`/cities-municipalities/${cityCode}/barangays/`)
        setBarangays(data || [])
      } catch (error) {
        console.error("Error fetching barangays:", error)
        setBarangays([])
      }
    }
  }

  // Updated handleBarangayChange function
  const handleBarangayChange = (event) => {
    const barangayCode = event.target.value
    const barangayName = event.target.options
      ? event.target.options[event.target.selectedIndex].text
      : barangays.find((barangay) => barangay.code === barangayCode)?.name || ""

    setSelectedBarangay(barangayCode)
    setSelectedBarangayName(barangayName)
  }

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

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePassword(newPassword)

    if (confirmPassword) {
      setPasswordsMatch(confirmPassword === newPassword)
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    setPasswordsMatch(value === password)
  }

  // Handle service price change with validation
  const handleServicePriceChange = (e) => {
    const value = e.target.value
    // Only allow numbers and decimal points
    const numericValue = value.replace(/[^0-9.]/g, "")
    
    // Prevent multiple decimal points
    const parts = numericValue.split(".")
    if (parts.length > 2) {
      return
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return
    }
    
    setServicePrice(numericValue)
  }

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return ""
    const numPrice = parseFloat(price)
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numPrice)
  }

  const resetForm = () => {
    setFirstname("")
    setLastname("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setPasswordStrength(0)
    setPasswordErrors([])
    setPasswordsMatch(true)
    setPhoneNumber("")
    setSelectedCountry({ code: "PH", dialCode: "+63", flag: "🇵🇭", name: "Philippines" })
    setSelectedRegion("")
    setSelectedRegionName("")
    setSelectedProvince("")
    setSelectedProvinceName("")
    setSelectedCityMunicipality("")
    setSelectedCityMunicipalityName("")
    setSelectedBarangay("")
    setSelectedBarangayName("")
    setService("")
    setServiceCategory("") // Reset service category
    setServicePrice("") // Reset service price
    setSelectedImage([])
  }

  const handleAddSubcontractor = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // First register the user
      const userData = {
        firstname,
        lastname,
        email,
        password,
        phoneNumber: selectedCountry.dialCode + phoneNumber,
        region: selectedRegionName,
        province: selectedProvinceName,
        cityAndMul: selectedCityMunicipalityName,
        barangay: selectedBarangayName,
        role: "SubContractor",
        profilePicture: null,
        isGoogle: false,
        isFacebook: false,
      }

      const token = getAuthToken()

      // Register user - use regular axios for backend API calls
      const userResponse = await axios.post(`${API_BASE_URL}/user/register`, userData)
      const createdUser = userResponse.data
      console.log(userData)

      if (!createdUser || !createdUser.userId) {
        throw new Error("User registration failed")
      }

      // Create subcontractor - use regular axios for backend API calls
      const subcontractorData = {
        user: createdUser,
        service: service,
        serviceCategory: serviceCategory, // Include service category
        servicePrice: parseFloat(servicePrice), // Include service price as number
      }

      const subcontractorResponse = await axios.post(`${API_BASE_URL}/subcontractor/create`, subcontractorData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const createdSubcontractor = subcontractorResponse.data

      // Update the subcontractors list
      setSubcontractors((prev) => [...prev, createdSubcontractor])

      setSnackbar({
        open: true,
        message: "Subcontractor added successfully",
        severity: "success",
      })

      handleClose()
    } catch (err) {
      console.error("Error adding subcontractor:", err)
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add subcontractor",
        severity: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    // Check if required fields are filled (including service category and price)
    if (!firstname || !lastname || !email || !password || !service || !serviceCategory || !servicePrice || !phoneNumber) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "warning",
      })
      return false
    }

    // Validate service price
    const priceValue = parseFloat(servicePrice)
    if (isNaN(priceValue) || priceValue <= 0) {
      setSnackbar({
        open: true,
        message: "Please enter a valid service price greater than 0",
        severity: "warning",
      })
      return false
    }

    // Check if password is strong enough
    if (passwordStrength < 3) {
      setSnackbar({
        open: true,
        message: "Password does not meet strength requirements",
        severity: "warning",
      })
      return false
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Passwords do not match",
        severity: "warning",
      })
      return false
    }

    // Check if location is selected
    if (!selectedRegionName || !selectedProvinceName || !selectedCityMunicipalityName || !selectedBarangayName) {
      setSnackbar({
        open: true,
        message: "Please select your complete location",
        severity: "warning",
      })
      return false
    }

    return true
  }

  const handleDeleteSubcontractor = async (id) => {
    try {
      const token = getAuthToken()
      // Use regular axios for backend API calls
      await axios.delete(`${API_BASE_URL}/subcontractor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update the subcontractors list
      setSubcontractors((prev) => prev.filter((subcontractor) => subcontractor.subcontractor_Id !== id))

      setSnackbar({
        open: true,
        message: "Subcontractor deleted successfully",
        severity: "success",
      })
    } catch (err) {
      console.error("Error deleting subcontractor:", err)
      setSnackbar({
        open: true,
        message: "Failed to delete subcontractor",
        severity: "error",
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const handleImageChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    const files = event.target.files
    const imageArray = Array.from(files).map((file) => ({
      title: file.name,
      image: URL.createObjectURL(file),
      file,
    }))
    setSelectedImage((prev) => [...prev, ...imageArray])
  }

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImage((prev) => prev.filter((_, i) => i !== indexToRemove))
  }

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <Navbar />
      <div className="grid lg:grid-cols-[1fr_3fr]">
        <div className="shadow hidden lg:block p-5">
          <AdminSideBar />
        </div>
        <div className="flex flex-col direct rounded-lg gap-4 bg-gray-100 md:px-10 md:py-10">
          <div className="flex items-center bg-white p-5 md:p-10 shadow-lg">
            <img
              src="https://s3-alpha-sig.figma.com/img/77cd/766b/225481949bb96c1ee92e2969c13f92f6?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=MgA~u1aSsMJWwuIpk-E5xBEOi8XPMninH2z6y2KAx~Azfo37d6ks4SqAolAPot7xsHEQShMTQvRSvv2ClxROmBPnuFzb4JiO7J3woNLPb897H5ndYRF-DWZM8Sa0VAJ6JXOYGEW~T9MVAM0ekDuikPDxbYMydG2BNtvD9lJozuraR2NtjgqszlfemHOanssPqdWEKzriBQjI0JGLu8ULQat5G6sXUQ-wlgwFUOk9L2Cs0ACDND5UVeaOAfrTT8Jh~n6hK9XQ~guO6IMNo47QZ-aR8g-7dP0uSWZmkm7WAsrhh3BYw0LzMYlTzkrGNyWjFd31cLCysbnYIrGUQ9FcMQ__"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="ml-4">
              <h2 className="text-lg font-semibold">James Wilson</h2>
              <p className="text-gray-500">ADMIN</p>
            </div>
          </div>

          {/* Subcontractors Section */}
          <div className="flex flex-col bg-white rounded-lg shadow-lg p-4 lg:p-15 gap-4">
            <div className="flex flex-row w-full justify-between items-center md:p-4">
              <h1 className="md:text-xl font-poppins">Subcontractors</h1>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center">
                  <button
                    className="rounded-xl font-poppins text-white bg-blue-500 md:text-lg px-4 py-1 hover:bg-blue-600 transition duration-200"
                    onClick={handleOpen}
                  >
                    Add Subcontractor
                  </button>
                </div>
                <div className="block sm:hidden">
                  <AddIcon
                    className="bg-blue-500 text-white rounded-xl p-2"
                    sx={{ fontSize: 40 }}
                    onClick={handleOpen}
                  />
                </div>
              </div>
            </div>
            <Divider />

            {/* Subcontractors Grid */}
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <Alert severity="error">{error}</Alert>
              </Box>
            ) : (
              <Grid container spacing={3} className="p-4">
                {subcontractors.length === 0 ? (
                  <Box width="100%" textAlign="center" p={4}>
                    <Typography variant="body1" color="text.secondary">
                      No subcontractors found. Add your first subcontractor!
                    </Typography>
                  </Box>
                ) : (
                  subcontractors.map((subcontractor) => (
                    <Grid item xs={12} sm={6} md={4} key={subcontractor.subcontractor_Id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 3,
                            position: "relative",
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: "rgba(255,255,255,0.8)",
                              "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                            }}
                            onClick={() => handleDeleteSubcontractor(subcontractor.subcontractor_Id)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>

                          <Avatar
                            src={subcontractor.user.profilePicture || "/placeholder.svg?height=200&width=200"}
                            alt={`${subcontractor.user.firstname} ${subcontractor.user.lastname}`}
                            sx={{ width: 100, height: 100, mb: 2 }}
                          />
                          <Typography variant="h6" component="h3" gutterBottom>
                            {subcontractor.user.firstname} {subcontractor.user.lastname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {subcontractor.service}
                          </Typography>
                          {/* Display service category if available */}
                          {subcontractor.serviceCategory && (
                            <Typography variant="caption" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
                              {subcontractor.serviceCategory}
                            </Typography>
                          )}
                          {/* Display service price if available */}
                          {subcontractor.servicePrice && (
                            <Typography variant="h6" color="success.main" gutterBottom sx={{ fontWeight: 600 }}>
                              {formatPrice(subcontractor.servicePrice)}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {subcontractor.user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {subcontractor.user.phoneNumber}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => (window.location.href = `/subcontractor/${subcontractor.subcontractor_Id}`)}
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}

            <Divider />
            <div className="md:p-4">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="medium" className="font-poppins md:text-lg">
                  About us
                </Typography>
                <IconButton size="small" onClick={() => setIsEditingAbout((prev) => !prev)} sx={{ color: "gray" }}>
                  <EditIcon sx={{ color: "grey-600" }} />
                </IconButton>
              </Box>

              {!isEditingAbout ? (
                <Typography className="font-poppins md:text-md text-gray-600 whitespace-pre-line">
                  {aboutUsText}
                </Typography>
              ) : (
                <Box mt={2}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={aboutUsText}
                    onChange={(e) => setAboutUsText(e.target.value)}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button variant="contained" size="small" onClick={() => setIsEditingAbout(false)}>
                      Save
                    </Button>
                  </Box>
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Subcontractor Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            maxHeight: "90vh",
            bgcolor: "#fff",
            borderRadius: "12px",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight={600}>
              Add Subcontractor
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Fields */}
          <Stack spacing={3}>
            {/* First Name and Last Name */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="John"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </Grid>
            </Grid>

            {/* Email */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />

            {/* Phone Number with country code */}
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Phone Number
              </Typography>
              <Box display="flex">
                <Box position="relative" mr={1}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowCountryList(!showCountryList)}
                    sx={{
                      height: "56px",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 10px",
                      minWidth: "100px",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ marginRight: "8px", fontSize: "1.2rem" }}>{selectedCountry.flag}</span>
                    <span>{selectedCountry.dialCode}</span>
                    <KeyboardArrowDown />
                  </Button>

                  {showCountryList && (
                    <Box
                      ref={countryListRef}
                      sx={{
                        position: "absolute",
                        zIndex: 10,
                        mt: 1,
                        width: 250,
                        maxHeight: 300,
                        overflowY: "auto",
                        bgcolor: "background.paper",
                        boxShadow: 5,
                        borderRadius: 1,
                      }}
                    >
                      <TextField
                        placeholder="Search countries..."
                        fullWidth
                        size="small"
                        sx={{ p: 1, position: "sticky", top: 0, bgcolor: "white", zIndex: 1 }}
                      />
                      {countries.map((country) => (
                        <MenuItem
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowCountryList(false)
                          }}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            py: 1.5,
                          }}
                        >
                          <Box display="flex" alignItems="center">
                            <span style={{ marginRight: "8px", fontSize: "1.2rem" }}>{country.flag}</span>
                            <Typography variant="body2">{country.name}</Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {country.dialCode}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setPhoneNumber(value)
                  }}
                  placeholder="9123456789"
                  required
                  helperText="Enter your number without the country code"
                />
              </Box>
            </Box>

            {/* Service Category, Service Name, and Price */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Service Category</InputLabel>
                  <Select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    label="Service Category"
                  >
                    <MenuItem value="">
                      <em>Select Category</em>
                    </MenuItem>
                    {SERVICE_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Service Name"
                  fullWidth
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g., Wedding Catering, Portrait Photography"
                  required
                  helperText="Specific service provided"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Service Price"
                  fullWidth
                  value={servicePrice}
                  onChange={handleServicePriceChange}
                  placeholder="0.00"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                  }}
                  helperText={servicePrice ? `Preview: ${formatPrice(servicePrice)}` : "Enter price in PHP"}
                />
              </Grid>
            </Grid>

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength */}
            {password && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Password Strength
                </Typography>
                <Box sx={{ width: "100%", height: 8, bgcolor: "grey.200", borderRadius: 4, overflow: "hidden" }}>
                  <Box
                    sx={{
                      width: `${(passwordStrength / 3) * 100}%`,
                      height: "100%",
                      bgcolor:
                        passwordStrength === 3
                          ? "success.main"
                          : passwordStrength === 2
                            ? "warning.main"
                            : "error.main",
                      transition: "width 0.3s ease-in-out",
                    }}
                  />
                </Box>
                {passwordErrors.length > 0 && (
                  <Box mt={1}>
                    {passwordErrors.map((error, index) => (
                      <Typography key={index} variant="caption" color="error" display="block">
                        {error}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            {/* Confirm Password */}
            {passwordStrength === 3 && (
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                error={!passwordsMatch && confirmPassword !== ""}
                helperText={!passwordsMatch && confirmPassword !== "" ? "Passwords do not match" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* Region and Province */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Region</InputLabel>
                  <Select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    label="Region"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Region</em>
                    </MenuItem>
                    {regions.map((region) => (
                      <MenuItem key={region.code} value={region.code}>
                        {region.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!selectedRegion}>
                  <InputLabel>Province</InputLabel>
                  <Select
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    label="Province"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Province</em>
                    </MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province.code} value={province.code}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* City/Municipality and Barangay */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!selectedProvince}>
                  <InputLabel>City/Municipality</InputLabel>
                  <Select
                    value={selectedCityMunicipality}
                    onChange={handleCityMunicipalityChange}
                    label="City/Municipality"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select City/Municipality</em>
                    </MenuItem>
                    {citiesMunicipalities.map((city) => (
                      <MenuItem key={city.code} value={city.code}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!selectedCityMunicipality}>
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    value={selectedBarangay}
                    onChange={handleBarangayChange}
                    label="Barangay"
                    required
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Select Barangay</em>
                    </MenuItem>
                    {barangays.map((barangay) => (
                      <MenuItem key={barangay.code} value={barangay.code}>
                        {barangay.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Profile Picture Upload */}
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Profile Picture (Optional)
              </Typography>
              <Box
                ref={dropRef}
                onClick={() => document.getElementById("upload-image-button")?.click()}
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: "12px",
                  padding: "32px",
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <CloudUploadIcon sx={{ color: "#90a4ae", fontSize: 40 }} />
                <Typography mt={1} fontSize="0.9rem">
                  <span style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}>Click here</span>{" "}
                  to upload a profile picture
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="upload-image-button"
                />
              </Box>
            </Box>

            {/* Preview Section */}
            {selectedImage.length > 0 && (
              <Box display="flex" justifyContent="center" mt={2}>
                <Avatar src={selectedImage[0].image} alt="Profile Preview" sx={{ width: 100, height: 100 }} />
              </Box>
            )}

            {/* Actions */}
            <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddSubcontractor} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Subcontractor"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
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

export default AdminSubContractors