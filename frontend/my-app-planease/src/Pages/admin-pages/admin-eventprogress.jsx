"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import AdminSideBar from "../../Components/admin-sidebar.jsx"
import Navbar from "../../Components/Navbar"
import {
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  AvatarGroup,
  Tooltip,
} from "@mui/material"
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Group as GroupIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"

const EventTrackingAdmin = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showSubcontractorModal, setShowSubcontractorModal] = useState(false)
  const [showIndividualUpdateModal, setShowIndividualUpdateModal] = useState(false)
  const [showSubcontractorSelectionModal, setShowSubcontractorSelectionModal] = useState(false)
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "",
    checkInStatus: "",
    notes: "",
    progressPercentage: 0,
  })

  useEffect(() => {
    fetchEventsProgress()
  }, [])

  const fetchEventsProgress = async () => {
    try {
      const token = localStorage.getItem("token")
      // Fetch all transactions for admin (no email filter)
      const response = await axios.get("http://localhost:8080/api/transactions/getAllTransactions", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch subcontractor progress data for each transaction
      const eventsData = await Promise.all(
        response.data.map(async (transaction) => {
          try {
            const subcontractorProgressResponse = await axios.get(
              `http://localhost:8080/api/transactions/subcontractor-progress/${transaction.transaction_Id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            )
            const subcontractorProgressData = subcontractorProgressResponse.data
            console.log(`DEBUG: Subcontractor progress data for transaction ${transaction.transaction_Id}:`, subcontractorProgressData)

            // Merge subcontractor data with progress data
            const subcontractors = transaction.subcontractors.map((sub) => {
                const progressData = subcontractorProgressData.find(
                  (progress) => progress.userId === parseInt(sub.subcontractorUserId)
                )
                console.log(`DEBUG: For subcontractor ${sub.subcontractorUserId} (${sub.subcontractorName}), progressData found:`, progressData)

                return {
                  id: sub.subcontractorUserId.toString(),
                  progressId: progressData?.subcontractorProgressId, // Store the subcontractor progress ID for individual endpoint
                  name: progressData?.subcontractorName || sub.subcontractorName,
                  role: progressData?.subcontractorServiceCategory || sub.serviceCategory,
                  progressPercentage: progressData?.progressPercentage ?? sub.progressPercentage ?? 0,
                  checkInStatus: progressData?.checkInStatus?.toLowerCase() || sub.checkInStatus || "pending",
                  notes: progressData?.progressNotes || sub.notes || "",
                  progressImageUrl: progressData?.progressImageUrl || "",
                  lastUpdate: progressData?.updatedAt || sub.lastUpdate || "",
                  avatar: progressData?.subcontractorAvatar || "/placeholder.svg?key=" + sub.subcontractorUserId, // Use avatar from progress data if available
                }
              })

            return {
              id: transaction.transaction_Id.toString(),
              eventName: transaction.eventName || transaction.packages || "N/A",
              subcontractors: subcontractors,
              currentStatus: transaction.transactionStatus.toLowerCase(),
              location: transaction.transactionVenue || "N/A",
              startDate: transaction.transactionDate || "",
              lastUpdate: transaction.lastUpdate || "",
              checkInStatus: getOverallCheckInStatus(subcontractors),
              notes: transaction.transactionNote || "",
              progressPercentage: calculateOverallProgress(subcontractors),
            }
          } catch (error) {
            console.error(`Failed to fetch subcontractor progress for transaction ${transaction.transaction_Id}:`, error)
            // Fallback to original data if subcontractor progress fetch fails
            return {
              id: transaction.transaction_Id.toString(),
              eventName: transaction.eventName || transaction.packages || "N/A",
              subcontractors: transaction.subcontractors.map((sub) => ({
                id: sub.subcontractorUserId.toString(),
                name: sub.subcontractorName,
                role: sub.serviceCategory,
                progressPercentage: sub.progressPercentage || 0,
                checkInStatus: sub.checkInStatus || "pending",
                notes: sub.notes || "",
                progressImageUrl: "",
                lastUpdate: sub.lastUpdate || "",
                avatar: "/placeholder.svg?key=" + sub.subcontractorUserId, // Placeholder avatar, replace with actual if available
              })),
              currentStatus: transaction.transactionStatus.toLowerCase(),
              location: transaction.transactionVenue || "N/A",
              startDate: transaction.transactionDate || "",
              lastUpdate: transaction.lastUpdate || "",
              checkInStatus: getOverallCheckInStatus(transaction.subcontractors),
              notes: transaction.transactionNote || "",
              progressPercentage: calculateOverallProgress(transaction.subcontractors),
            }
          }
        })
      )

      setEvents(eventsData)
    } catch (error) {
      console.error("Failed to fetch all transactions for admin:", error)
    }
  }

  const calculateOverallProgress = (subcontractors) => {
    if (subcontractors.length === 1) return subcontractors[0].progressPercentage
    const totalProgress = subcontractors.reduce((sum, sub) => sum + sub.progressPercentage, 0)
    return Math.round(totalProgress / subcontractors.length)
  }

  const getOverallCheckInStatus = (subcontractors) => {
    if (subcontractors.length === 1) return subcontractors[0].checkInStatus
    const hasRejected = subcontractors.some((sub) => sub.checkInStatus === "rejected")
    const hasPending = subcontractors.some((sub) => sub.checkInStatus === "pending")
    const allApproved = subcontractors.every((sub) => sub.checkInStatus === "approved")

    if (hasRejected) return "rejected"
    if (hasPending) return "pending"
    if (allApproved) return "approved"
    return "pending"
  }

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event)
    setUpdateData({
      status: event.currentStatus,
      checkInStatus: event.checkInStatus,
      notes: event.notes,
      progressPercentage: event.progressPercentage,
    })
    setShowModal(true)
  }

  const handleViewSubcontractors = (event) => {
    setSelectedEvent(event)
    setShowSubcontractorSelectionModal(true)
  }

  const handleSubmitUpdate = async () => {
    if (selectedEvent) {
      try {
        const token = localStorage.getItem("token")
        await axios.put(
          `http://localhost:8080/api/transactions/updateProgress/${selectedEvent.id}`,
          null,
          {
            params: {
              progressPercentage: updateData.progressPercentage,
              message: updateData.notes,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id
              ? {
                  ...event,
                  currentStatus: updateData.status,
                  checkInStatus: updateData.checkInStatus,
                  notes: updateData.notes,
                  progressPercentage: updateData.progressPercentage,
                  lastUpdate: new Date().toLocaleString(),
                }
              : event,
          ),
        )
        setShowModal(false)
        setSelectedEvent(null)
      } catch (error) {
        console.error("Failed to update event progress:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "in-progress":
        return "info"
      case "review":
        return "secondary"
      case "completed":
        return "success"
      default:
        return "default"
    }
  }

  const getCheckInColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "approved":
        return "success"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  const renderSubcontractorProfiles = (subcontractors) => {
    if (subcontractors.length === 1) {
      return (
        <Box className="flex items-center gap-2">
          <Avatar src={subcontractors[0].avatar} alt={subcontractors[0].name} sx={{ width: 32, height: 32 }} />
          <Typography variant="body2" className="text-[#667085]">
            {subcontractors[0].name}
          </Typography>
        </Box>
      )
    }

    if (subcontractors.length <= 3) {
      return (
        <Tooltip
          title={
            <Box>
              {subcontractors.map((sub) => (
                <Box key={sub.id} className="flex items-center gap-2 py-1">
                  <Avatar src={sub.avatar} alt={sub.name} sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2">{sub.name}</Typography>
                </Box>
              ))}
            </Box>
          }
          arrow
        >
          <Box className="flex items-center">
            <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}>
              {subcontractors.map((sub) => (
                <Avatar key={sub.id} src={sub.avatar} alt={sub.name} />
              ))}
            </AvatarGroup>
          </Box>
        </Tooltip>
      )
    }

    return (
      <Tooltip
        title={
          <Box>
            {subcontractors.map((sub) => (
              <Box key={sub.id} className="flex items-center gap-2 py-1">
                <Avatar src={sub.avatar} alt={sub.name} sx={{ width: 24, height: 24 }} />
                <Typography variant="body2">{sub.name}</Typography>
              </Box>
            ))}
          </Box>
        }
        arrow
      >
        <Box className="flex items-center">
          <AvatarGroup max={2} sx={{ "& .MuiAvatar-root": { width: 32, height: 32 } }}>
            {subcontractors.slice(0, 2).map((sub) => (
              <Avatar key={sub.id} src={sub.avatar} alt={sub.name} />
            ))}
            <Avatar sx={{ bgcolor: "#FFB22C", width: 32, height: 32, fontSize: "0.75rem" }}>
              +{subcontractors.length - 2}
            </Avatar>
          </AvatarGroup>
        </Box>
      </Tooltip>
    )
  }

  const handleUpdateSubcontractor = async (event, subcontractor) => {
    setSelectedEvent(event)
    setSelectedSubcontractor(subcontractor)
    setUpdateData({
      status: event.currentStatus,
      checkInStatus: subcontractor.checkInStatus,
      notes: subcontractor.notes,
      progressPercentage: subcontractor.progressPercentage,
    })

    // Fetch detailed progress data using the individual endpoint
    try {
      const token = localStorage.getItem("token")
      console.log("DEBUG: Calling API with progressId:", subcontractor.progressId)
      const progressResponse = await axios.get(
        `http://localhost:8080/api/transactions/subcontractor-progress/id/${subcontractor.progressId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      console.log("DEBUG: Detailed subcontractor progress data fetched:", progressResponse.data)

      // Update subcontractor with fresh data from individual endpoint
      const detailedProgress = progressResponse.data
      setSelectedSubcontractor({
        ...subcontractor,
        name: detailedProgress.subcontractorName,
        role: detailedProgress.subcontractorServiceCategory,
        progressPercentage: detailedProgress.progressPercentage,
        checkInStatus: detailedProgress.checkInStatus?.toLowerCase(),
        notes: detailedProgress.progressNotes,
        progressImageUrl: detailedProgress.progressImageUrl,
        lastUpdate: detailedProgress.updatedAt,
        avatar: detailedProgress.subcontractorAvatar,
      })
    } catch (error) {
      console.error("Failed to fetch detailed subcontractor progress:", error)
      // Fall back to existing data if individual endpoint fails
    }

    setShowIndividualUpdateModal(true)
  }

  const handleMarkComplete = async (event, subcontractor) => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://localhost:8080/api/transactions/subcontractor-progress/${event.id}/${subcontractor.id}`,
        null,
        {
          params: {
            progressPercentage: 100,
            checkInStatus: "approved",
            notes: subcontractor.notes,
          },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setEvents(
        events.map((e) =>
          e.id === event.id
            ? {
                ...e,
                subcontractors: e.subcontractors.map((sub) =>
                  sub.id === subcontractor.id
                    ? {
                        ...sub,
                        checkInStatus: "approved",
                        progressPercentage: 100,
                        lastUpdate: new Date().toLocaleString(),
                      }
                    : sub,
                ),
                lastUpdate: new Date().toLocaleString(),
              }
            : e,
        ),
      )
    } catch (error) {
      console.error("Failed to mark subcontractor as complete:", error)
    }
  }

  const handleSubmitSubcontractorUpdate = async () => {
    if (selectedEvent && selectedSubcontractor) {
      try {
        const token = localStorage.getItem("token")
        await axios.put(
          `http://localhost:8080/api/transactions/subcontractor-progress/${selectedEvent.id}/${selectedSubcontractor.id}`,
          null,
          {
            params: {
              progressPercentage: updateData.progressPercentage,
              checkInStatus: updateData.checkInStatus,
              notes: updateData.notes,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id
              ? {
                  ...event,
                  subcontractors: event.subcontractors.map((sub) =>
                    sub.id === selectedSubcontractor.id
                      ? {
                          ...sub,
                          checkInStatus: updateData.checkInStatus,
                          notes: updateData.notes,
                          progressPercentage: updateData.progressPercentage,
                          lastUpdate: new Date().toLocaleString(),
                        }
                      : sub,
                  ),
                  lastUpdate: new Date().toLocaleString(),
                }
              : event,
          ),
        )
        setShowIndividualUpdateModal(false)
        setSelectedEvent(null)
        setSelectedSubcontractor(null)
      } catch (error) {
        console.error("Failed to update subcontractor progress:", error)
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
            <div>
              <Typography variant="h4" component="h2" className="font-bold">
                Event Tracking Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary" className="mt-1">
                Monitor events in progress and manage subcontractor updates
              </Typography>
            </div>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              sx={{
                backgroundColor: "#FFB22C",
                "&:hover": { backgroundColor: "#e6a028" },
              }}
              onClick={fetchEventsProgress}
            >
              Refresh Status
            </Button>
          </div>

          <Grid container spacing={3} className="mb-6">
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Events
                  </Typography>
                  <Typography variant="h4" component="p" className="font-bold">
                    {events.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                  <Typography variant="h4" component="p" className="font-bold text-blue-600">
                    {events.filter((e) => e.currentStatus === "in-progress").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Pending Check-ins
                  </Typography>
                  <Typography variant="h4" component="p" className="font-bold text-orange-600">
                    {events.filter((e) => e.checkInStatus === "pending").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                  <Typography variant="h4" component="p" className="font-bold text-green-600">
                    {events.filter((e) => e.currentStatus === "completed").length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <TableContainer component={Paper} className="shadow rounded-lg">
            <Table>
              <TableHead sx={{ backgroundColor: "#F1F1FB" }}>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Subcontractor(s)</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Check-in</TableCell>
                  <TableCell>Last Update</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Typography variant="body2" className="font-medium text-[#667085]">
                        {event.eventName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        {renderSubcontractorProfiles(event.subcontractors)}
                        {event.subcontractors.length > 1 && (
                          <Button
                            size="small"
                            onClick={() => handleViewSubcontractors(event)}
                            sx={{
                              color: "#FFB22C",
                              textTransform: "none",
                              fontSize: "0.75rem",
                              "&:hover": {
                                backgroundColor: "rgba(255, 178, 44, 0.1)",
                              },
                            }}
                          >
                            View All ({event.subcontractors.length})
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-[#667085]" noWrap>
                        {event.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className="flex items-center gap-2">
                        <LinearProgress
                          variant="determinate"
                          value={calculateOverallProgress(event.subcontractors)}
                          sx={{
                            width: 64,
                            height: 8,
                            borderRadius: 4,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#FFB22C",
                            },
                          }}
                        />
                        <Typography variant="caption" className="text-gray-600">
                          {calculateOverallProgress(event.subcontractors)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.currentStatus.replace("-", " ")}
                        color={getStatusColor(event.currentStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getOverallCheckInStatus(event.subcontractors)}
                        color={getCheckInColor(getOverallCheckInStatus(event.subcontractors))}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" className="text-[#667085]">
                        {event.lastUpdate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewSubcontractors(event)}
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{
                          color: "#FFB22C",
                          "&:hover": {
                            backgroundColor: "rgba(255, 178, 44, 0.1)",
                            color: "#e6a028",
                          },
                        }}
                      >
                        View Details ({event.subcontractors.length})
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>

      <Dialog open={showSubcontractorSelectionModal} onClose={() => setShowSubcontractorSelectionModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Subcontractor to Review</DialogTitle>
        <DialogContent>
          {selectedEvent && selectedEvent.subcontractors.map((sub) => (
            <Box key={sub.id} className="flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-50" onClick={() => { handleUpdateSubcontractor(selectedEvent, sub); setShowSubcontractorSelectionModal(false); }}>
              <Box className="flex items-center gap-3">
                <Avatar src={sub.avatar} alt={sub.name} sx={{ width: 32, height: 32 }} />
                <Box>
                  <Typography variant="body1" className="font-medium">{sub.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{sub.role}</Typography>
                </Box>
              </Box>
              <Box className="flex items-center gap-2">
                <LinearProgress variant="determinate" value={sub.progressPercentage} sx={{ width: 60, height: 6 }} />
                <Typography variant="caption">{sub.progressPercentage}%</Typography>
                <Chip label={sub.checkInStatus} color={getCheckInColor(sub.checkInStatus)} size="small" />
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Update Event Progress</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box className="space-y-4 pt-4">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Event Name
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    {selectedEvent.eventName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Subcontractor
                  </Typography>
                  <Typography variant="body2" className="mt-1">
                    {selectedEvent.subcontractors[0].name}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Event Status</InputLabel>
                    <Select
                      value={updateData.status}
                      label="Event Status"
                      onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="review">Under Review</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Check-in Status</InputLabel>
                    <Select
                      value={updateData.checkInStatus}
                      label="Check-in Status"
                      onChange={(e) => setUpdateData({ ...updateData, checkInStatus: e.target.value })}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                fullWidth
                type="number"
                label="Progress Percentage"
                inputProps={{ min: 0, max: 100 }}
                value={updateData.progressPercentage}
                onChange={(e) =>
                  setUpdateData({ ...updateData, progressPercentage: Number.parseInt(e.target.value) || 0 })
                }
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Update Notes"
                value={updateData.notes}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                placeholder="Add notes about the current progress..."
              />

              <Box className="flex justify-end gap-4 pt-4">
                <Button variant="outlined" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitUpdate}
                  sx={{
                    backgroundColor: "#FFB22C",
                    "&:hover": { backgroundColor: "#e6a028" },
                  }}
                >
                  Update Progress
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showIndividualUpdateModal}
        onClose={() => setShowIndividualUpdateModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex items-center justify-between">
            <Typography variant="h6">Review Subcontractor Submission</Typography>
            <Chip
              label={selectedSubcontractor?.checkInStatus || "pending"}
              color={getCheckInColor(selectedSubcontractor?.checkInStatus || "pending")}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedSubcontractor && selectedEvent && (
            <Box className="space-y-6 pt-4">
              {/* Header Info */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Event
                  </Typography>
                  <Typography variant="h6" className="font-medium">
                    {selectedEvent.eventName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" className="mb-1">
                    Subcontractor
                  </Typography>
                  <Box className="flex items-center gap-3">
                    <Avatar
                      src={selectedSubcontractor.avatar}
                      alt={selectedSubcontractor.name}
                      sx={{ width: 40, height: 40 }}
                    />
                    <Box>
                      <Typography variant="h6" className="font-medium">
                        {selectedSubcontractor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedSubcontractor.role}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Submission Content */}
              <Box className="bg-gray-50 rounded-lg p-6">
                <Typography variant="h6" className="mb-4 font-medium">
                  Submission Details
                </Typography>

                {selectedSubcontractor.progressImageUrl ? (
                  <Box className="mb-6">
                    <Typography variant="body2" color="text.secondary" className="mb-3">
                      Progress Image
                    </Typography>
                    <Box className="flex justify-center">
                      <img
                        src={selectedSubcontractor.progressImageUrl}
                        alt="Subcontractor progress submission"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          objectFit: 'contain',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box className="mb-6 text-center py-8">
                    <Typography variant="body1" color="text.secondary">
                      No image submitted
                    </Typography>
                  </Box>
                )}

                <Box className="mb-4">
                  <Typography variant="body2" color="text.secondary" className="mb-2">
                    Description
                  </Typography>
                  <Box className="bg-white p-4 rounded-lg border">
                    <Typography variant="body1">
                      {selectedSubcontractor.notes || "No description provided"}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Box className="flex items-center gap-2 mt-1">
                      <LinearProgress
                        variant="determinate"
                        value={selectedSubcontractor.progressPercentage}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#FFB22C",
                          },
                        }}
                      />
                      <Typography variant="body2" className="font-medium min-w-[40px]">
                        {selectedSubcontractor.progressPercentage}%
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      {selectedSubcontractor.lastUpdate || "Not available"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Review Actions */}
              {/* Removed Review Actions section as per user request */}

              {/* Action Buttons */}
              <Box className="flex justify-between items-center pt-4">
                <Button
                  variant="outlined"
                  onClick={() => setShowIndividualUpdateModal(false)}
                >
                  Close Review
                </Button>

                {selectedSubcontractor.checkInStatus !== "approved" && (
                  <Button
                    variant="contained"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleMarkComplete(selectedEvent, selectedSubcontractor)}
                    sx={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#45a049",
                      },
                    }}
                  >
                    Mark as Complete
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showSubcontractorModal} onClose={() => setShowSubcontractorModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box className="flex items-center gap-2">
            <GroupIcon sx={{ color: "#FFB22C" }} />
            Subcontractor Progress Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box className="space-y-4 pt-4">
              <Typography variant="h6" className="mb-4">
                {selectedEvent.eventName} - {selectedEvent.location}
              </Typography>

              {selectedEvent.subcontractors.map((subcontractor, index) => (
                <Accordion key={subcontractor.id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box className="flex items-center justify-between w-full mr-4">
                      <Box className="flex items-center gap-3">
                        <Avatar src={subcontractor.avatar} alt={subcontractor.name} sx={{ width: 32, height: 32 }} />
                        <Typography variant="subtitle1" className="font-medium">
                          {subcontractor.name}
                        </Typography>
                        <Chip
                          label={subcontractor.role}
                          size="small"
                          sx={{ backgroundColor: "#FFB22C", color: "white" }}
                        />
                      </Box>
                      <Box className="flex items-center gap-3">
                        <LinearProgress
                          variant="determinate"
                          value={subcontractor.progressPercentage}
                          sx={{
                            width: 80,
                            height: 6,
                            borderRadius: 3,
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: "#FFB22C",
                            },
                          }}
                        />
                        <Typography variant="body2" className="min-w-[40px]">
                          {subcontractor.progressPercentage}%
                        </Typography>
                        <Chip
                          label={subcontractor.checkInStatus}
                          color={getCheckInColor(subcontractor.checkInStatus)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Last Update
                        </Typography>
                        <Typography variant="body2">{subcontractor.lastUpdate}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Check-in Status
                        </Typography>
                        <Chip
                          label={subcontractor.checkInStatus}
                          color={getCheckInColor(subcontractor.checkInStatus)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {subcontractor.progressImageUrl && (
                          <Box className="mb-4">
                            <Typography variant="body2" color="text.secondary" className="mb-2">
                              Submission Image
                            </Typography>
                            <img
                              src={subcontractor.progressImageUrl}
                              alt="Subcontractor submission"
                              style={{ width: '100%', maxWidth: 300, height: 200, objectFit: 'cover', borderRadius: 8 }}
                            />
                          </Box>
                        )}
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Progress Notes
                        </Typography>
                        <Typography variant="body2" className="bg-gray-50 p-3 rounded">
                          {subcontractor.notes}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box className="flex justify-end gap-2">
                          <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleUpdateSubcontractor(selectedEvent, subcontractor)}
                            sx={{
                              color: "#FFB22C",
                              borderColor: "#FFB22C",
                              "&:hover": {
                                backgroundColor: "rgba(255, 178, 44, 0.1)",
                                borderColor: "#e6a028",
                              },
                            }}
                          >
                            Update This Subcontractor
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleMarkComplete(selectedEvent, subcontractor)}
                            sx={{
                              backgroundColor: "#4caf50",
                              "&:hover": {
                                backgroundColor: "#388e3c",
                              },
                            }}
                          >
                            Mark as Complete
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Box className="flex justify-end pt-4">
                <Button variant="outlined" onClick={() => setShowSubcontractorModal(false)}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EventTrackingAdmin
