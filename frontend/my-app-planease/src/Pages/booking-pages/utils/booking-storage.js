// Booking storage utility functions

// Storage keys
const STORAGE_KEYS = {
  PERSONAL_INFO: "bookingPersonalInfo",
  EVENT_DETAILS: "bookingEventDetails",
  SERVICES_DATA: "bookingServicesData",
  AVAILABLE_SERVICES: "availableServices",
}

// Personal Info functions
export const savePersonalInfo = (data) => {
  sessionStorage.setItem(STORAGE_KEYS.PERSONAL_INFO, JSON.stringify(data))
}

export const getPersonalInfo = () => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.PERSONAL_INFO)
  return stored
    ? JSON.parse(stored)
    : {
        firstName: "",
        lastName: "",
        email: "",
        contact: "",
      }
}

// Event Details functions
export const saveEventDetails = (data) => {
  sessionStorage.setItem(STORAGE_KEYS.EVENT_DETAILS, JSON.stringify(data))
}

export const getEventDetails = () => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.EVENT_DETAILS)
  return stored
    ? JSON.parse(stored)
    : {
        location: "",
        eventDate: "",
        note: "",
      }
}

// Services Data functions
export const saveServicesData = (data) => {
  const existing = getServicesData()
  const updated = { ...existing, ...data }
  sessionStorage.setItem(STORAGE_KEYS.SERVICES_DATA, JSON.stringify(updated))
}

export const getServicesData = () => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.SERVICES_DATA)
  return stored
    ? JSON.parse(stored)
    : {
        activeTab: "custom",
        selectedServices: {},
        selectedPackage: null,
        availableServices: [],
      }
}

// Individual getters for backward compatibility
export const getActiveTab = () => {
  return getServicesData().activeTab
}

export const getSelectedServices = () => {
  return getServicesData().selectedServices
}

export const getSelectedPackage = () => {
  return getServicesData().selectedPackage
}

// Available Services functions
export const saveAvailableServices = (services) => {
  sessionStorage.setItem(STORAGE_KEYS.AVAILABLE_SERVICES, JSON.stringify(services))
  // Also update in services data
  const servicesData = getServicesData()
  servicesData.availableServices = services
  sessionStorage.setItem(STORAGE_KEYS.SERVICES_DATA, JSON.stringify(servicesData))
}

export const getAvailableServices = () => {
  const stored = sessionStorage.getItem(STORAGE_KEYS.AVAILABLE_SERVICES)
  return stored ? JSON.parse(stored) : []
}

// Complete booking data
export const getCompleteBookingData = () => {
  return {
    personalInfo: getPersonalInfo(),
    eventDetails: getEventDetails(),
    servicesData: getServicesData(),
  }
}

// Clear all booking data
export const clearBookingData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    sessionStorage.removeItem(key)
  })
}
// utils/booking-storage.js (add this if missing)

export const clearSelectedServices = () => {
  const servicesData = getServicesData();
  const resetServicesData = {
    ...servicesData,
    selectedServices: {},
    selectedPackage: null,
    activeTab: "custom",
  };
  sessionStorage.setItem(STORAGE_KEYS.SERVICES_DATA, JSON.stringify(resetServicesData));
};

// Package definitions
export const PACKAGES = [
  {
    id: "cherry-blossom",
    name: "Cherry Blossom Package",
    price: 300000,
    icon: "🌸",
    description: "Includes catering, venue, and basic photography.",
  },
  {
    id: "tulip",
    name: "Tulip Package",
    price: 450000,
    icon: "🌷",
    description: "Includes premium catering, venue, photography, and band.",
  },
  {
    id: "rose",
    name: "Rose Package",
    price: 350000,
    icon: "🌹",
    description: "Includes catering, venue, photography, and hosting.",
  },
]
