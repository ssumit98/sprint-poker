"use client"

import { useState, useEffect } from "react"
import { GiCardKingDiamonds } from "react-icons/gi"
import { ref, set, onValue, push, update } from "firebase/database"
import { database } from "./firebase"
import "./App.css"

function App() {
  const [sprintDetails, setSprintDetails] = useState({
    piName: "",
    sprintName: "",
    stories: [{ id: 1, text: "" }],
  })
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [stories, setStories] = useState([])
  const [happinessIndex, setHappinessIndex] = useState(5)
  const [isPokerStarted, setIsPokerStarted] = useState(false)
  const [flippedCards, setFlippedCards] = useState({})
  const [isMaster, setIsMaster] = useState(true)
  const [roomId, setRoomId] = useState(null)
  const [participantName, setParticipantName] = useState("")
  const [participantId, setParticipantId] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [activeStory, setActiveStory] = useState(null)
  const [participants, setParticipants] = useState({})
  const [roomStatus, setRoomStatus] = useState("waiting") // waiting, voting, revealed
  const [participantStatus, setParticipantStatus] = useState({}) // Track participant statuses

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomId = params.get('room')
    
    // Check for existing user data in localStorage first
    const savedUserData = localStorage.getItem('userData')
    if (savedUserData) {
      const { participantId, participantName, roomId: savedRoomId, isMaster: savedIsMaster } = JSON.parse(savedUserData)
      
      if (savedIsMaster) {
        // This is the master's session
        setIsMaster(true)
        setRoomId(savedRoomId)
        setShowNameModal(false)
        
        // Subscribe to room updates for master
        const roomRef = ref(database, `rooms/${savedRoomId}`)
        onValue(roomRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            // If room is ended, clear local storage and redirect
            if (data.ended) {
              localStorage.clear()
              setSprintDetails({
                piName: "",
                sprintName: "",
                stories: [{ id: 1, text: "" }],
              })
              setSelectedPoint(null)
              setStories([])
              setHappinessIndex(5)
              setIsPokerStarted(false)
              setFlippedCards({})
              setIsMaster(true)
              setRoomId(null)
              setParticipantName("")
              setParticipantId(null)
              setShowNameModal(true)
              setActiveStory(null)
              setParticipants({})
              setRoomStatus("waiting")
              setParticipantStatus({})
              window.location.href = window.location.origin + window.location.pathname
              return
            }

            // Update all master data from Firebase
            if (data.master) {
              setSprintDetails({
                ...data.master,
                stories: data.master.stories.map(story => ({
                  ...story,
                  points: story.points || undefined
                }))
              })
            }
            
            setStories(data.master?.stories || [])
            setParticipants(data.participants || {})
            setParticipantStatus(data.participantStatus || {})
            setActiveStory(data.activeStory)
            setRoomStatus(data.status || "waiting")
            setIsPokerStarted(true)
          }
        })
      } else if (roomId) {
        // This is a slave joining an existing room
        setIsMaster(false)
        setRoomId(roomId)
        
        if (savedRoomId === roomId) {
          setParticipantId(participantId)
          setParticipantName(participantName)
          setShowNameModal(false)
        } else {
          localStorage.clear()
          setShowNameModal(true)
        }
        
        // Subscribe to room updates for slave
        const roomRef = ref(database, `rooms/${roomId}`)
        onValue(roomRef, (snapshot) => {
          const data = snapshot.val()
          if (data) {
            // If room is ended, clear local storage and redirect
            if (data.ended) {
              localStorage.clear()
              setSprintDetails({
                piName: "",
                sprintName: "",
                stories: [{ id: 1, text: "" }],
              })
              setSelectedPoint(null)
              setStories([])
              setHappinessIndex(5)
              setIsPokerStarted(false)
              setFlippedCards({})
              setIsMaster(true)
              setRoomId(null)
              setParticipantName("")
              setParticipantId(null)
              setShowNameModal(true)
              setActiveStory(null)
              setParticipants({})
              setRoomStatus("waiting")
              setParticipantStatus({})
              window.location.href = window.location.origin + window.location.pathname
              return
            }

            // Update all slave data from Firebase
            if (data.master) {
              setSprintDetails({
                ...data.master,
                stories: data.master.stories.map(story => ({
                  ...story,
                  points: story.points || undefined
                }))
              })
            }
            
            setStories(data.master?.stories || [])
            setParticipants(data.participants || {})
            setParticipantStatus(data.participantStatus || {})
            setActiveStory(data.activeStory)
            setRoomStatus(data.status || "waiting")
            setIsPokerStarted(true)
          }
        })
      }
    } else if (roomId) {
      // New slave joining without saved data
      setIsMaster(false)
      setRoomId(roomId)
      setShowNameModal(true)
      
      // Subscribe to room updates for new slave
      const roomRef = ref(database, `rooms/${roomId}`)
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // If room is ended, clear local storage and redirect
          if (data.ended) {
            localStorage.clear()
            setSprintDetails({
              piName: "",
              sprintName: "",
              stories: [{ id: 1, text: "" }],
            })
            setSelectedPoint(null)
            setStories([])
            setHappinessIndex(5)
            setIsPokerStarted(false)
            setFlippedCards({})
            setIsMaster(true)
            setRoomId(null)
            setParticipantName("")
            setParticipantId(null)
            setShowNameModal(true)
            setActiveStory(null)
            setParticipants({})
            setRoomStatus("waiting")
            setParticipantStatus({})
            window.location.href = window.location.origin + window.location.pathname
            return
          }

          // Update all slave data from Firebase
          if (data.master) {
            setSprintDetails({
              ...data.master,
              stories: data.master.stories.map(story => ({
                ...story,
                points: story.points || undefined
              }))
            })
          }
          
          setStories(data.master?.stories || [])
          setParticipants(data.participants || {})
          setParticipantStatus(data.participantStatus || {})
          setActiveStory(data.activeStory)
          setRoomStatus(data.status || "waiting")
          setIsPokerStarted(true)
        }
      })
    } else {
      // New master creating a new room
      setIsMaster(true)
      const newRoomId = generateRoomId()
      setRoomId(newRoomId)
      
      // Create initial room data
      const roomRef = ref(database, `rooms/${newRoomId}`)
      set(roomRef, {
        master: sprintDetails,
        status: "waiting",
        createdAt: Date.now(),
        participants: {},
        participantStatus: {}
      })
      
      // Save master data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        isMaster: true,
        roomId: newRoomId
      }))
      
      // Subscribe to room updates for new master
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Update all master data from Firebase
          if (data.master) {
            setSprintDetails({
              ...data.master,
              stories: data.master.stories.map(story => ({
                ...story,
                points: story.points || undefined
              }))
            })
          }
          
          setStories(data.master?.stories || [])
          setParticipants(data.participants || {})
          setParticipantStatus(data.participantStatus || {})
          setActiveStory(data.activeStory)
          setRoomStatus(data.status || "waiting")
          setIsPokerStarted(true)
        }
      })
    }
  }, [])

  const handleNameSubmit = () => {
    if (participantName.trim()) {
      const newParticipantRef = push(ref(database, `rooms/${roomId}/participants`))
      setParticipantId(newParticipantRef.key)
      setShowNameModal(false)
      
      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        participantId: newParticipantRef.key,
        participantName,
        roomId
      }))
      
      // Set participant name and initial status in Firebase
      const updates = {}
      updates[`rooms/${roomId}/participants/${newParticipantRef.key}`] = {
        name: participantName,
        joinedAt: Date.now()
      }
      updates[`rooms/${roomId}/participantStatus/${newParticipantRef.key}`] = "active"
      
      update(ref(database), updates)
    }
  }

  const startPoker = () => {
    if (sprintDetails.piName && sprintDetails.sprintName) {
      setIsPokerStarted(true)
      
      // Save master data to localStorage
      localStorage.setItem('userData', JSON.stringify({
        isMaster: true,
        roomId
      }))
      
      // Create initial stories array without undefined points
      const initialStories = sprintDetails.stories.map(story => ({
        id: story.id,
        text: story.text
      }))
      
      // Update room in Firebase
      const roomRef = ref(database, `rooms/${roomId}`)
      update(roomRef, {
        master: {
          ...sprintDetails,
          stories: initialStories
        },
        status: "waiting",
        createdAt: Date.now(),
        participants: {},
        participantStatus: {}
      })
      
      // Create and copy URL
      const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`
      navigator.clipboard.writeText(url)
        .then(() => {
          alert("Room URL copied to clipboard!")
        })
        .catch(err => {
          console.error('Failed to copy URL:', err)
          alert("Room created! Please copy the URL manually: " + url)
        })
    } else {
      alert("Please fill in the PI Name and Sprint Name")
    }
  }

  const selectActiveStory = (story) => {
    if (isMaster) {
      // Create a clean story object without undefined properties
      const cleanStory = {
        id: story.id,
        text: story.text,
        votes: {} // Initialize empty votes object
      }
      
      // Reset all participant statuses to active
      const resetParticipantStatus = {}
      Object.keys(participants).forEach(id => {
        resetParticipantStatus[id] = "active"
      })
      
      const roomRef = ref(database, `rooms/${roomId}`)
      update(roomRef, {
        activeStory: cleanStory,
        status: "voting",
        participantStatus: resetParticipantStatus,
        selectedPoints: {} // Reset all selected points
      })
    }
  }

  // Add useEffect to reset selectedPoint when roomStatus changes to voting
  useEffect(() => {
    if (roomStatus === "voting") {
      setSelectedPoint(null)
    }
  }, [roomStatus])

  const handlePointSelection = (point) => {
    if (!isMaster && activeStory && roomStatus === "voting") {
      setSelectedPoint(point)
      const updates = {}
      updates[`rooms/${roomId}/activeStory/votes/${participantId}`] = point
      updates[`rooms/${roomId}/participantStatus/${participantId}`] = "voted"
      
      update(ref(database), updates)
    }
  }

  const revealVotes = () => {
    if (isMaster) {
      // Calculate average points
      const votes = Object.values(activeStory?.votes || {})
      const validVotes = votes.map(vote => vote === "?" ? 0 : parseInt(vote))
      const averagePoints = validVotes.length > 0 
        ? Math.round(validVotes.reduce((a, b) => a + b, 0) / validVotes.length)
        : 0

      // Create a clean stories array with the updated points
      const updatedStories = sprintDetails.stories.map(story => ({
        id: story.id,
        text: story.text,
        points: story.id === activeStory.id ? averagePoints : (story.points || null)
      }))

      // Update local state first
      setSprintDetails(prev => ({
        ...prev,
        stories: updatedStories
      }))

      // Then update Firebase with clean data
      const roomRef = ref(database, `rooms/${roomId}`)
      update(roomRef, {
        status: "revealed",
        master: {
          piName: sprintDetails.piName,
          sprintName: sprintDetails.sprintName,
          stories: updatedStories
        }
      })
    }
  }

  const handleInputChange = (e, storyId = null) => {
    const { name, value } = e.target
    if (storyId !== null) {
      setSprintDetails(prev => ({
        ...prev,
        stories: prev.stories.map(story => 
          story.id === storyId ? { ...story, text: value } : story
        )
      }))
    } else {
      setSprintDetails(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const addStoryInput = () => {
    setSprintDetails(prev => ({
      ...prev,
      stories: [
        ...prev.stories,
        { id: prev.stories.length + 1, text: "" }
      ]
    }))
  }

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const submitHappiness = () => {
    alert(`Happiness index submitted: ${happinessIndex}/10`)
  }

  const handleCardFlip = (storyId) => {
    setFlippedCards(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }))
  }

  const handleEndPlanning = () => {
    if (window.confirm('Are you sure you want to end planning and delete all data? This action cannot be undone.')) {
      // Delete room data from Firebase and mark as ended
      const roomRef = ref(database, `rooms/${roomId}`)
      set(roomRef, {
        ended: true,
        endedAt: Date.now()
      })
      
      // Clear local storage for master
      localStorage.clear()
      
      // Reset all state variables
      setSprintDetails({
        piName: "",
        sprintName: "",
        stories: [{ id: 1, text: "" }],
      })
      setSelectedPoint(null)
      setStories([])
      setHappinessIndex(5)
      setIsPokerStarted(false)
      setFlippedCards({})
      setIsMaster(true)
      setRoomId(null)
      setParticipantName("")
      setParticipantId(null)
      setShowNameModal(true)
      setActiveStory(null)
      setParticipants({})
      setRoomStatus("waiting")
      setParticipantStatus({})
      
      // Redirect to home page
      window.location.href = window.location.origin + window.location.pathname
    }
  }

  return (
    <div className="app-container">
      {/* Name Modal */}
      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Your Name</h2>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Your name"
            />
            <button onClick={handleNameSubmit}>Join Session</button>
          </div>
        </div>
      )}

      {/* 1. Navbar Section */}
      <nav className="navbar">
        <div className="logo">
          Poker Sprint Planner
          {!isMaster && isPokerStarted && (
            <span className="sprint-info">
              | PI: {sprintDetails.piName} | Sprint: {sprintDetails.sprintName}
            </span>
          )}
        </div>
        {isMaster && (
          <div className="nav-links">
            <span>Home</span>
            <span>Dashboard</span>
            <span>History</span>
          </div>
        )}
      </nav>

      {/* 2. Sprint Details Section - Only show for master */}
      {isMaster && (
        <section className="sprint-details-section">
          <h2>Sprint Details</h2>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="piName">PI Name</label>
              <input
                type="text"
                id="piName"
                name="piName"
                value={sprintDetails.piName}
                onChange={handleInputChange}
                placeholder="Enter PI Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sprintName">Sprint Name</label>
              <input
                type="text"
                id="sprintName"
                name="sprintName"
                value={sprintDetails.sprintName}
                onChange={handleInputChange}
                placeholder="Enter Sprint Name"
              />
            </div>
            <div className="form-group stories-group">
              <label>Sprint Stories</label>
              <div className="stories-inputs">
                {sprintDetails.stories.map((story) => (
                  <div key={story.id} className="story-input-container">
                    <input
                      type="text"
                      value={story.text}
                      onChange={(e) => handleInputChange(e, story.id)}
                      placeholder="Enter story"
                      className="story-input"
                    />
                    {story.id === sprintDetails.stories.length && (
                      <button className="add-story-btn" onClick={addStoryInput}>
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="start-poker-container">
            <button className="start-poker-btn" onClick={startPoker}>
              Start Poker
            </button>
          </div>
        </section>
      )}

      {/* Active Stories Container - Show for both master and slaves */}
      {isPokerStarted && roomId && (
        <section className="active-stories-section">
          <h2>Stories to discuss</h2>
          <div className="active-stories-container">
            <div className="active-stories-list">
              {sprintDetails.stories.map((story) => (
                <div key={story.id} className="active-story-item">
                  <span>{story.text}</span>
                  <div className="story-actions">
                    {story.points !== undefined && (
                      <span className="story-points">Points: {story.points}</span>
                    )}
                    {isMaster ? (
                      <button 
                        className={`story-btn ${activeStory?.id === story.id ? 'active' : ''}`}
                        onClick={() => selectActiveStory(story)}
                        disabled={roomStatus === "voting"}
                      >
                        {activeStory?.id === story.id 
                          ? 'Active' 
                          : story.points !== undefined 
                            ? 'Revisit' 
                            : 'Set Active'}
                      </button>
                    ) : (
                      <button 
                        className={`story-btn ${activeStory?.id === story.id ? 'active' : ''}`}
                        disabled
                      >
                        {activeStory?.id === story.id ? 'Active' : ''}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Active Story Section - Hide for master */}
      {isPokerStarted && roomId && activeStory && !isMaster && (
        <section className="active-story-section">
          <h2>Current Story</h2>
          <div className="active-story-card">
            {activeStory.text}
          </div>
        </section>
      )}

      {/* Sprint Points Section - Hide for master */}
      {isPokerStarted && roomId && roomStatus === "voting" && !isMaster && (
        <section className="sprint-points-section">
          <h2>Select Story Points</h2>
          <div className="points-container">
            {["1", "2", "3", "5", "8", "13", "21", "?"].map((point) => (
              <div
                key={point}
                className={`point-card ${selectedPoint === point ? "selected" : ""}`}
                onClick={() => handlePointSelection(point)}
              >
                {point}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Stories Table Section */}
      {isPokerStarted && roomId && (
        <section className="stories-table-section">
          <h2>Participants</h2>
          <table className="stories-table">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Vote</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(participants).map(([id, participant], index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{participant.name}</td>
                  <td>
                    <span className={`status-badge ${participantStatus[id] || 'active'}`}>
                      {participantStatus[id] || 'active'}
                    </span>
                  </td>
                  <td>
                    <div 
                      className={`poker-card ${roomStatus === "revealed" ? 'flipped' : ''}`}
                    >
                      <div className="card-inner">
                        <div className="card-front">
                          <GiCardKingDiamonds size={60} />
                        </div>
                        <div className="card-back">
                          {roomStatus === "revealed" ? activeStory?.votes?.[id] || "?" : "?"}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isMaster && roomStatus === "voting" && (
            <div className="reveal-votes-container">
              <button className="reveal-btn" onClick={revealVotes}>
                Reveal Votes
              </button>
            </div>
          )}
        </section>
      )}

      {/* 5. Happiness Index Section */}
      {isPokerStarted && roomId && roomStatus === "revealed" && (
        <section className="happiness-section">
          <h2>Happiness Index</h2>
          <div className="happiness-container">
            <label htmlFor="happiness">How satisfied are you with this sprint planning? (1-10)</label>
            <div className="happiness-input-group">
              <input
                type="range"
                id="happiness"
                min="1"
                max="10"
                value={happinessIndex}
                onChange={(e) => setHappinessIndex(e.target.value)}
              />
              <span className="happiness-value">{happinessIndex}</span>
            </div>
            <button className="submit-btn" onClick={submitHappiness}>
              Submit Feedback
            </button>
          </div>
        </section>
      )}

      {/* End Planning Button - Only show for master */}
      {isPokerStarted && roomId && isMaster && (
        <section className="end-planning-section">
          <button className="end-planning-btn" onClick={handleEndPlanning}>
            End Planning & Delete Data
          </button>
        </section>
      )}
    </div>
  )
}

export default App

