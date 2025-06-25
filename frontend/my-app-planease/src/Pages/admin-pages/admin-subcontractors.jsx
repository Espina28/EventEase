"use client"

import { useState, useRef, useEffect } from "react"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from "@mui/material/Divider"
import Navbar from "../../Components/Navbar"
import Typography from "@mui/material/Typography"
import AddIcon from "@mui/icons-material/Add"
import CloseIcon from "@mui/icons-material/Close"
import EditIcon from "@mui/icons-material/Edit"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import AdminSideBar from '../../Components/admin-sidebar.jsx';
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
  Chip,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import axios from "axios"
import { Visibility, VisibilityOff, KeyboardArrowDown } from "@mui/icons-material"
import RestaurantIcon from "@mui/icons-material/Restaurant"
import CameraAltIcon from "@mui/icons-material/CameraAlt"
import VideocamIcon from "@mui/icons-material/Videocam"
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"
import LocalFloristIcon from "@mui/icons-material/LocalFlorist"
import SettingsIcon from "@mui/icons-material/Settings"
import EventIcon from "@mui/icons-material/Event"
import SecurityIcon from "@mui/icons-material/Security"
import CleaningServicesIcon from "@mui/icons-material/CleaningServices"
import GroupsIcon from "@mui/icons-material/Groups"
import DesignServicesIcon from "@mui/icons-material/DesignServices"
import MicIcon from "@mui/icons-material/Mic"

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

  // State for category counts
  const [categoryCounts, setCategoryCounts] = useState(null)
  const [loadingCategoryCounts, setLoadingCategoryCounts] = useState(true)

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

  const [openModal, setOpenModal] = useState(false)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null)
  const [loadingSubcontractorDetails, setLoadingSubcontractorDetails] = useState(false)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)

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
    fetchCategoryCounts()
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
      console.log(response.data)
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

  // Fetch category counts from backend
  const fetchCategoryCounts = async () => {
    setLoadingCategoryCounts(true)
    try {
      const token = getAuthToken()
      const response = await axios.get(`${API_BASE_URL}/subcontractor/category-counts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Category counts:', response.data)
      setCategoryCounts(response.data || [])
    } catch (err) {
      console.error("Error fetching category counts:", err)
      // Fallback to client-side counting if API fails
      setCategoryCounts(null)
    } finally {
      setLoadingCategoryCounts(false)
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
        profilePicture: "https://example.com/profile-pic.jpg",
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
      
      // Update the category counts after successful deletion
      fetchCategoryCounts()

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

  // Group subcontractors by category for summary
  const getSubcontractorsByCategory = () => {
    // If we have category counts from the API, use those
    if (categoryCounts) {
      const categories = {};
      
      // Transform the API response to the format we need
      categoryCounts.forEach(item => {
        const category = item.category || 'Other';
        categories[category] = Number(item.count);
      });
      
      return categories;
    }
    
    // Fallback to client-side counting if API data is not available
    const categories = {};
    
    // Initialize with total count
    categories['total'] = subcontractors.length;
    
    // Count by service category
    subcontractors.forEach(subcontractor => {
      const category = subcontractor.serviceCategory || 'Other';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    
    return categories;
  };

  const subcontractorCategories = getSubcontractorsByCategory();
  
  // Get icon for each category
  const getCategoryIcon = (category) => {
    // Convert to lowercase and handle plurals by removing trailing 's'
    const normalizedCategory = category.toLowerCase().replace(/s$/, '');
    
    switch(normalizedCategory) {
      case 'food & catering':
      case 'catering':
      case 'food':
        return <RestaurantIcon fontSize="large" />;
      case 'photography':
      case 'photo':
        return <CameraAltIcon fontSize="large" />;
      case 'videography':
      case 'video':
        return <VideocamIcon fontSize="large" />;
      case 'decoration & styling':
      case 'decoration':
      case 'decorator':
      case 'design':
        return <DesignServicesIcon fontSize="large" />;
      case 'transportation':
      case 'car rental':
      case 'car':
        return <DirectionsCarIcon fontSize="large" />;
      case 'venue & location':
      case 'venue':
      case 'location':
        return <LocationOnIcon fontSize="large" />;
      case 'entertainment & music':
      case 'entertainment':
      case 'music':
        return <MusicNoteIcon fontSize="large" />;
      case 'floral arrangements':
      case 'floral':
      case 'flower':
        return <LocalFloristIcon fontSize="large" />;
      case 'audio & visual equipment':
      case 'audio':
      case 'equipment':
        return <SettingsIcon fontSize="large" />;
      case 'event planning & coordination':
      case 'event planning':
      case 'event':
      case 'planning':
        return <EventIcon fontSize="large" />;
      case 'security services':
      case 'security':
        return <SecurityIcon fontSize="large" />;
      case 'cleaning services':
      case 'cleaning':
        return <CleaningServicesIcon fontSize="large" />;
      case 'hosting':
      case 'host':
        return <MicIcon fontSize="large" />;
      case 'total':
        return <GroupsIcon fontSize="large" />;
      default:
        return <SettingsIcon fontSize="large" />;
    }
  };

  // For pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter subcontractors based on search and category
  const filteredSubcontractors = subcontractors.filter(subcontractor => {
    const nameMatch = subcontractor.user && 
      `${subcontractor.user.firstname} ${subcontractor.user.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    
    const categoryMatch = selectedCategory === 'All Categories' || 
      subcontractor.serviceCategory === selectedCategory;
    
    return nameMatch && categoryMatch;
  });

  // Get all unique categories for dropdown
  const allCategories = ['All Categories', ...new Set(subcontractors
    .map(s => s.serviceCategory)
    .filter(Boolean))];

  // Handle opening and closing the subcontractor details modal
  const handleOpenModal = async (subcontractorId) => {
    setLoadingSubcontractorDetails(true)
    setOpenModal(true)
    
    try {
      const response = await axios.get(`${API_BASE_URL}/subcontractor/${subcontractorId}`)
      setSelectedSubcontractor(response.data)
    } catch (error) {
      console.error("Error fetching subcontractor details:", error)
    } finally {
      setLoadingSubcontractorDetails(false)
    }
  }
  
  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedSubcontractor(null)
  };

  const handleOpenDeleteConfirmation = () => {
    setOpenDeleteConfirmation(true)
  };
  
  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false)
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-64 border-r bg-white">
          <AdminSideBar />
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-10 bg-gray-50 overflow-auto">
          <h2 className="text-2xl font-bold mb-6">Create Account for Subcontractors</h2>
          
          {/* Manage Subcontractors Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold">Manage Your Subcontractors</h3>
                <p className="text-sm text-gray-500">Register new vendors and manage existing ones.</p>
              </div>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#FFA500',
                  '&:hover': { bgcolor: '#FF8C00' },
                  borderRadius: '8px',
                  boxShadow: 'none',
                  fontWeight: 'bold'
                }}
                onClick={handleOpen}
              >
                Add Subcontractor
              </Button>
            </div>
            
            {/* Subcontractor Category Cards */}
            {loading || loadingCategoryCounts ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Total subcontractors card */}
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Card 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      borderLeft: '6px solid #3498db',
                      height: '100%'
                    }}
                  >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar sx={{ bgcolor: '#E3F2FD', color: '#3498db', width: 56, height: 56, mr: 2 }}>
                        {getCategoryIcon('total')}
                      </Avatar>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {subcontractorCategories['total'] || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total subcontractors
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                {/* Category cards - display top 5 categories */}
                {Object.entries(subcontractorCategories)
                  .filter(([category]) => category !== 'total')
                  .sort(([, countA], [, countB]) => countB - countA)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <Grid item xs={12} sm={6} md={4} lg={4} key={category}>
                      <Card 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          borderLeft: '6px solid #FFA500',
                          height: '100%'
                        }}
                      >
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Avatar sx={{ bgcolor: '#FFF3E0', color: '#FFA500', width: 56, height: 56, mr: 2 }}>
                            {getCategoryIcon(category)}
                          </Avatar>
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {count}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {category}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            )}
          </div>
          
          {/* Subcontractors List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">List of subcontractors</h3>
            
            {/* Search and Filter */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                sx={{ width: 250 }}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  sx: { borderRadius: '4px', bgcolor: '#f5f5f5' }
                }}
              />
              
              <FormControl size="small" sx={{ width: 180 }}>
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(0);
                  }}
                  displayEmpty
                  sx={{ borderRadius: '4px' }}
                >
                  {allCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {/* Subcontractors Table */}
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box display="flex" justifyContent="center" alignItems="center" p={4}>
                <Alert severity="error">{error}</Alert>
              </Box>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSubcontractors
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((subcontractor) => (
                          <tr key={subcontractor.subcontractor_Id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <Avatar 
                                    src={subcontractor.user?.profilePicture || "/placeholder.svg?height=40&width=40"}
                                    alt={subcontractor.user ? `${subcontractor.user.firstname} ${subcontractor.user.lastname}` : "Subcontractor"}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {subcontractor.user
                                      ? `${subcontractor.user.firstname} ${subcontractor.user.lastname}`
                                      : "No Name"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {subcontractor.user?.email || "No email"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="mr-2 flex-shrink-0">
                                  {getCategoryIcon(subcontractor.subcontractor_serviceCategory || 'Other')}
                                </div>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {subcontractor.subcontractor_serviceCategory || "Other"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button
                                variant="outlined"
                                size="small"
                                color="primary"
                                onClick={() => handleOpenModal(subcontractor.subcontractor_Id)}
                              >
                                View Profile
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <Box display="flex" justifyContent="center" mt={3}>
                  <div className="flex items-center space-x-1">
                    <button 
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      disabled={page === 0}
                      onClick={() => setPage(page - 1)}
                    >
                      &lt;
                    </button>
                    
                    {[...Array(Math.ceil(filteredSubcontractors.length / rowsPerPage)).keys()].map(number => (
                      <button
                        key={number}
                        className={`px-3 py-1 rounded-md ${page === number ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        onClick={() => setPage(number)}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button 
                      className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                      disabled={page >= Math.ceil(filteredSubcontractors.length / rowsPerPage) - 1}
                      onClick={() => setPage(page + 1)}
                    >
                      &gt;
                    </button>
                  </div>
                </Box>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Subcontractor Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#f5f5f5', pb: 1 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            Subcontractor Details
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {loadingSubcontractorDetails ? (
            <Box display="flex" justifyContent="center" alignItems="center" p={4}>
              <CircularProgress />
            </Box>
          ) : selectedSubcontractor ? (
            <Box>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={selectedSubcontractor.user?.profilePicture || "/placeholder.svg"}
                  alt={selectedSubcontractor.user ? `${selectedSubcontractor.user.firstname} ${selectedSubcontractor.user.lastname}` : "Subcontractor"}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {selectedSubcontractor.user
                      ? `${selectedSubcontractor.user.firstname} ${selectedSubcontractor.user.lastname}`
                      : "No Name"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedSubcontractor.user?.email || "No email"}
                  </Typography>
                  <Chip 
                    icon={getCategoryIcon(selectedSubcontractor.subcontractor_serviceCategory || 'Other')}
                    label={selectedSubcontractor.subcontractor_serviceCategory || "Other"}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Business Name
                </Typography>
                <Typography variant="body1">
                  {selectedSubcontractor.subcontractor_serviceName || "Not specified"}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedSubcontractor.subcontractor_description || "No description available"}
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Base Price
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="medium">
                  ₱{selectedSubcontractor.subcontractor_service_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "Not specified"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" color="error">
              Failed to load subcontractor details.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleOpenDeleteConfirmation}
            startIcon={<CloseIcon />}
            disabled={loadingSubcontractorDetails || !selectedSubcontractor}
          >
            Delete Subcontractor
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleCloseModal} 
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteConfirmation}
        onClose={handleCloseDeleteConfirmation}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ bgcolor: '#f5f5f5' }}>
          {"Confirm Delete"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this subcontractor? This action cannot be undone.
            {selectedSubcontractor && (
              <Typography variant="subtitle2" color="error" sx={{ mt: 1, fontWeight: 'bold' }}>
                {selectedSubcontractor.user
                  ? `${selectedSubcontractor.user.firstname} ${selectedSubcontractor.user.lastname}`
                  : "This subcontractor"} will be permanently removed as a subcontractor.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedSubcontractor) {
                handleDeleteSubcontractor(selectedSubcontractor.subcontractor_Id);
                handleCloseDeleteConfirmation();
                handleCloseModal();
              }
            }} 
            color="error" 
            variant="contained" 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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