"use client"

import { useState } from "react"
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
} from "@mui/icons-material"

const EventTrackingAdmin = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      eventName: "Corporate Conference Setup",
      subcontractors: [
        {
          id: "sub1",
          name: "Elite Events Co.",
          role: "Main Setup",
          progressPercentage: 65,
          checkInStatus: "pending",
          notes: "Stage setup completed, working on lighting and sound system installation",
          lastUpdate: "2024-01-16 14:30",
          avatar: "/elite-events-co-logo.png",
        },
      ],
      currentStatus: "in-progress",
      location: "Downtown Convention Center",
      startDate: "2024-01-15",
      lastUpdate: "2024-01-16 14:30",
      checkInStatus: "pending",
      notes: "Stage setup completed, working on lighting and sound system installation",
      progressPercentage: 65,
    },
    {
      id: "2",
      eventName: "Wedding Reception",
      subcontractors: [
        {
          id: "sub2",
          name: "Dream Weddings LLC",
          role: "Decoration",
          progressPercentage: 90,
          checkInStatus: "approved",
          notes: "Decoration complete, awaiting final inspection from venue manager",
          lastUpdate: "2024-01-16 10:15",
          avatar: "/placeholder-ozhfb.png",
        },
      ],
      currentStatus: "review",
      location: "Garden Villa Resort",
      startDate: "2024-01-14",
      lastUpdate: "2024-01-16 10:15",
      checkInStatus: "approved",
      notes: "Decoration complete, awaiting final inspection from venue manager",
      progressPercentage: 90,
    },
    {
      id: "3",
      eventName: "Product Launch Event",
      subcontractors: [
        {
          id: "sub3a",
          name: "Tech Events Pro",
          role: "AV Equipment",
          progressPercentage: 30,
          checkInStatus: "pending",
          notes: "Equipment delivery scheduled for today, waiting for venue access",
          lastUpdate: "2024-01-16 09:00",
          avatar: "/tech-events-pro-logo.png",
        },
        {
          id: "sub3b",
          name: "Stage Masters Inc.",
          role: "Stage Setup",
          progressPercentage: 20,
          checkInStatus: "pending",
          notes: "Stage design approved, materials being prepared",
          lastUpdate: "2024-01-16 08:30",
          avatar: "/stage-masters-inc-logo.png",
        },
        {
          id: "sub3c",
          name: "Catering Plus",
          role: "Food & Beverage",
          progressPercentage: 25,
          checkInStatus: "approved",
          notes: "Menu finalized, ingredients being sourced",
          lastUpdate: "2024-01-16 07:45",
          avatar: "/catering-plus-logo.png",
        },
        {
          id: "sub3d",
          name: "Security Solutions",
          role: "Event Security",
          progressPercentage: 40,
          checkInStatus: "approved",
          notes: "Security plan approved, personnel assigned",
          lastUpdate: "2024-01-16 08:00",
          avatar: "/security-solutions-logo.png",
        },
      ],
      currentStatus: "pending",
      location: "Innovation Hub",
      startDate: "2024-01-17",
      lastUpdate: "2024-01-16 09:00",
      checkInStatus: "pending",
      notes: "Equipment delivery scheduled for today, waiting for venue access",
      progressPercentage: 25,
    },
    {
      id: "4",
      eventName: "Annual Charity Gala",
      subcontractors: [
        {
          id: "sub4",
          name: "Prestige Event Management",
          role: "Full Service",
          progressPercentage: 100,
          checkInStatus: "approved",
          notes: "Event successfully completed. All equipment removed and venue cleaned",
          lastUpdate: "2024-01-13 22:45",
          avatar: "/placeholder.svg?key=us64g",
        },
      ],
      currentStatus: "completed",
      location: "Grand Ballroom Hotel",
      startDate: "2024-01-12",
      lastUpdate: "2024-01-13 22:45",
      checkInStatus: "approved",
      notes: "Event successfully completed. All equipment removed and venue cleaned",
      progressPercentage: 100,
    },
    {
      id: "5",
      eventName: "Trade Show Exhibition",
      subcontractors: [
        {
          id: "sub5a",
          name: "Expo Masters Inc.",
          role: "Booth Construction",
          progressPercentage: 80,
          checkInStatus: "approved",
          notes: "Booth construction 80% complete, electrical work in progress",
          lastUpdate: "2024-01-16 16:20",
          avatar: "/expo-masters-inc-logo.png",
        },
        {
          id: "sub5b",
          name: "Digital Display Co.",
          role: "Digital Signage",
          progressPercentage: 70,
          checkInStatus: "pending",
          notes: "LED screens installed, content upload in progress",
          lastUpdate: "2024-01-16 15:45",
          avatar: "/digital-display-co-logo.png",
        },
      ],
      currentStatus: "in-progress",
      location: "Metro Exhibition Center",
      startDate: "2024-01-16",
      lastUpdate: "2024-01-16 16:20",
      checkInStatus: "approved",
      notes: "Booth construction 80% complete, electrical work in progress",
      progressPercentage: 75,
    },
    {
      id: "6",
      eventName: "Birthday Party Setup",
      subcontractors: [
        {
          id: "sub6",
          name: "Party Perfect Solutions",
          role: "Decoration",
          progressPercentage: 45,
          checkInStatus: "rejected",
          notes: "Decoration setup needs revision - color scheme doesn't match client requirements",
          lastUpdate: "2024-01-16 11:30",
          avatar: "/placeholder.svg?key=90q4w",
        },
      ],
      currentStatus: "review",
      location: "Riverside Community Center",
      startDate: "2024-01-15",
      lastUpdate: "2024-01-16 11:30",
      checkInStatus: "rejected",
      notes: "Decoration setup needs revision - color scheme doesn't match client requirements",
      progressPercentage: 45,
    },
    {
      id: "7",
      eventName: "Music Festival Stage",
      subcontractors: [
        {
          id: "sub7",
          name: "Sound & Stage Specialists",
          role: "Stage & Audio",
          progressPercentage: 70,
          checkInStatus: "pending",
          notes: "Main stage assembly complete, working on sound system calibration",
          lastUpdate: "2024-01-16 13:15",
          avatar: "/placeholder.svg?key=6369j",
        },
      ],
      currentStatus: "in-progress",
      location: "Central Park Amphitheater",
      startDate: "2024-01-14",
      lastUpdate: "2024-01-16 13:15",
      checkInStatus: "pending",
      notes: "Main stage assembly complete, working on sound system calibration",
      progressPercentage: 70,
    },
    {
      id: "8",
      eventName: "Corporate Team Building",
      subcontractors: [
        {
          id: "sub8",
          name: "Adventure Events Co.",
          role: "Activity Coordination",
          progressPercentage: 15,
          checkInStatus: "pending",
          notes: "Weather conditions being monitored, equipment prep on standby",
          lastUpdate: "2024-01-16 08:45",
          avatar: "/placeholder.svg?key=49r9p",
        },
      ],
      currentStatus: "pending",
      location: "Outdoor Adventure Park",
      startDate: "2024-01-18",
      lastUpdate: "2024-01-16 08:45",
      checkInStatus: "pending",
      notes: "Weather conditions being monitored, equipment prep on standby",
      progressPercentage: 15,
    },
    {
      id: "9",
      eventName: "Art Gallery Opening",
      subcontractors: [
        {
          id: "sub9",
          name: "Cultural Events Ltd.",
          role: "Exhibition Setup",
          progressPercentage: 100,
          checkInStatus: "approved",
          notes: "Successful opening event, all artwork properly displayed and secured",
          lastUpdate: "2024-01-11 19:30",
          avatar: "/placeholder.svg?key=j595x",
        },
      ],
      currentStatus: "completed",
      location: "Modern Art Museum",
      startDate: "2024-01-10",
      lastUpdate: "2024-01-11 19:30",
      checkInStatus: "approved",
      notes: "Successful opening event, all artwork properly displayed and secured",
      progressPercentage: 100,
    },
    {
      id: "10",
      eventName: "Fashion Show Runway",
      subcontractors: [
        {
          id: "sub10",
          name: "Glamour Productions",
          role: "Runway & Lighting",
          progressPercentage: 85,
          checkInStatus: "pending",
          notes: "Runway construction complete, lighting setup requires client approval",
          lastUpdate: "2024-01-16 15:45",
          avatar: "/placeholder.svg?key=49r9p",
        },
      ],
      currentStatus: "review",
      location: "Fashion District Studio",
      startDate: "2024-01-16",
      lastUpdate: "2024-01-16 15:45",
      checkInStatus: "pending",
      notes: "Runway construction complete, lighting setup requires client approval",
      progressPercentage: 85,
    },
    {
      id: "11",
      eventName: "Food Festival Booths",
      subcontractors: [
        {
          id: "sub11a",
          name: "Culinary Event Services",
          role: "Booth Setup",
          progressPercentage: 65,
          checkInStatus: "approved",
          notes: "60% of vendor booths assembled, electrical connections in progress",
          lastUpdate: "2024-01-16 12:00",
          avatar: "/culinary-event-services-logo.png",
        },
        {
          id: "sub11b",
          name: "Power Solutions Pro",
          role: "Electrical",
          progressPercentage: 55,
          checkInStatus: "pending",
          notes: "Main power distribution complete, individual booth connections ongoing",
          lastUpdate: "2024-01-16 11:30",
          avatar: "/power-solutions-pro-logo.png",
        },
      ],
      currentStatus: "in-progress",
      location: "City Square Plaza",
      startDate: "2024-01-15",
      lastUpdate: "2024-01-16 12:00",
      checkInStatus: "approved",
      notes: "60% of vendor booths assembled, electrical connections in progress",
      progressPercentage: 60,
    },
    {
      id: "12",
      eventName: "Graduation Ceremony",
      subcontractors: [
        {
          id: "sub12",
          name: "Academic Events Pro",
          role: "Ceremony Setup",
          progressPercentage: 10,
          checkInStatus: "pending",
          notes: "Venue booking confirmed, equipment list being finalized",
          lastUpdate: "2024-01-16 07:30",
          avatar: "/placeholder.svg?key=49r9p",
        },
      ],
      currentStatus: "pending",
      location: "University Auditorium",
      startDate: "2024-01-19",
      lastUpdate: "2024-01-16 07:30",
      checkInStatus: "pending",
      notes: "Venue booking confirmed, equipment list being finalized",
      progressPercentage: 10,
    },
  ])

  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSubcontractor, setSelectedSubcontractor] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showSubcontractorModal, setShowSubcontractorModal] = useState(false)
  const [showIndividualUpdateModal, setShowIndividualUpdateModal] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "",
    checkInStatus: "",
    notes: "",
    progressPercentage: 0,
  })

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
    setShowSubcontractorModal(true)
  }

  const handleSubmitUpdate = () => {
    if (selectedEvent) {
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

  const handleUpdateSubcontractor = (event, subcontractor) => {
    setSelectedEvent(event)
    setSelectedSubcontractor(subcontractor)
    setUpdateData({
      status: event.currentStatus,
      checkInStatus: subcontractor.checkInStatus,
      notes: subcontractor.notes,
      progressPercentage: subcontractor.progressPercentage,
    })
    setShowIndividualUpdateModal(true)
  }

  const handleSubmitSubcontractorUpdate = () => {
    if (selectedEvent && selectedSubcontractor) {
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
                        onClick={() => {
                          if (event.subcontractors.length <= 1) {
                            handleUpdateEvent(event)
                          } else {
                            handleViewSubcontractors(event)
                          }
                        }}
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
                        {event.subcontractors.length > 1 ? `View All (${event.subcontractors.length})` : "Update"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
      </div>

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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Update Subcontractor Progress</DialogTitle>
        <DialogContent>
          {selectedSubcontractor && selectedEvent && (
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
                  <Box className="flex items-center gap-2 mt-1">
                    <Avatar
                      src={selectedSubcontractor.avatar}
                      alt={selectedSubcontractor.name}
                      sx={{ width: 24, height: 24 }}
                    />
                    <Typography variant="body2">
                      {selectedSubcontractor.name} - {selectedSubcontractor.role}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

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
                <Button variant="outlined" onClick={() => setShowIndividualUpdateModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitSubcontractorUpdate}
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
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Progress Notes
                        </Typography>
                        <Typography variant="body2" className="bg-gray-50 p-3 rounded">
                          {subcontractor.notes}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box className="flex justify-end">
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
