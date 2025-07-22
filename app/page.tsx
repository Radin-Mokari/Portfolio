"use client"
import { Canvas, extend } from "@react-three/fiber"
import type React from "react"

import { useGLTF, useTexture, Environment, Lightformer } from "@react-three/drei"
import { Physics } from "@react-three/rapier"
import { MeshLineGeometry, MeshLineMaterial } from "meshline"
import Band from "@/components/band"
import SimpleCard from "@/components/simple-card"
import Scene3D from "@/components/scene3d"
import { useState, useEffect, useRef, useCallback, Suspense } from "react" // Added for terminal functionality

extend({ MeshLineGeometry, MeshLineMaterial })

// Clear any cached texture references and force local loading
useGLTF.preload("/assets/3d/card.glb")
useTexture.preload("/assets/images/lanyard_texture.png") // Using new texture name

interface TerminalLine {
  type: "command" | "output" | "welcome" | "error"
  content: string
  timestamp?: string
}

const commands = {
  help: `Available commands:
about            - Learn about me
experience       - My work experience
projects         - View my projects  
education        - My educational background
achievements     - View my awards & certificates
extra-curricular - My activities and leadership roles
contact          - How to reach me
clear            - Clear the terminal
exit             - Close terminal session

Type any command to continue...`,

  about: `Personal Profile:
================

Penultimate-year BSc Computer Science student with hands-on experience in data 
analysis using Python, SQL, and Excel.

Applied data cleaning, transformation, and visualization techniques in academic 
and personal projects to support evidence-based insights.

Proficient in tools such as Pandas, Matplotlib, NumPy, and Amazon QuickSight.

Strong attention to detail, analytical thinking, and ability to work independently 
in remote and team-based environments.

Current Status: First Year Average Score: 76.31%
Location: Currently Bradford-based but flexible on location`,

  experience: `Employment & Volunteer Work Experience:
========================================

[1] Student Ambassador                                    Nov 2024 - Current
    University of Bradford
    ────────────────────────────────────────────────────────────────
    • Guided 100+ visitors per event, ensuring welcoming experience
    • Demonstrated flexibility during open days and HE fairs
    • Engaged with young students in group projects
    • Facilitated productivity by encouraging collaboration

[2] Sales Assistant Volunteer                           Jun 2024 - Aug 2024
    Cancer Research UK Shop, Bradford
    ────────────────────────────────────────────────────────────────
    • Processed 150+ transactions and assisted 400+ customers
    • Organized and replenished stock, handling 100+ items per shift
    • Maintained displays and shop presentation standards
    • Collaborated with 10+ volunteers for operations and fundraising`,

  projects: `University & Individual Projects:
=================================

[1] YHROCU - Workflow Management System (2nd Year Group Project)
    ──────────────────────────────────────────────────────────────
    • Developed CRUD system for managing users in workflow management
    • Utilized Laravel and PHP for robust backend functionality
    • Enhanced user experience and operational efficiency for client
    • Coordinated with team to meet client deadlines

[2] Predictive ML Models for Disease Detection (2nd Year Project)
    ──────────────────────────────────────────────────────────────
    • Comprehensive data cleaning, augmentation and feature engineering
    • Used Pandas and NumPy for dataset preparation
    • Trained Random Forest, Decision Tree and CNN algorithms
    • Applied Scikit-learn and TensorFlow for model development
    • Conducted hyperparameter tuning with GridSearchCV

[3] Data Visualization with Amazon QuickSight (Individual Project)
    ──────────────────────────────────────────────────────────────
    • Uploaded large Netflix datasets to Amazon S3
    • Connected datasets to QuickSight for actionable insights
    • Created donut charts, bar graphs, and tables
    • Guided strategic decision making through visualizations

[4] Website Hosting on Amazon S3 (Individual Project)
    ──────────────────────────────────────────────────────────────
    • Created and configured S3 bucket with ACLs and versioning
    • Uploaded HTML, CSS, and JavaScript content
    • Managed public access settings and website visibility
    • Deep dive into static website functionality`,

  education: `Education and Qualifications:
============================

[1] University of Bradford                              Jan 2024 - May 2026
    BSc (Hons) Computer Science with International Year 1
    First Year Average Score: 76.31%
    ──────────────────────────────────────────────────────────────
    Key Modules Year 2:
    • Enterprise Pro: Combined transferable and technical skills
    • Contributed to multiple aspects of SDLC
    • Coordinated with team to meet client deadlines
    
    Key Modules Year 1:
    • Database Systems: Mastered comprehensive SQL query principles
    • Analyzed large-scale datasets through complex queries

[2] Halkali Toplu Konut Multi-Program Anatolian High School, Turkey
    Sep 2012 - May 2018
    Overall Grade: 86.56%
    ──────────────────────────────────────────────────────────────
    Subject Breakdown:
    • Mathematics: 94%
    • Sciences: 90.60%
    • Visual Arts/Music: 98.25%
    
    Additional Experience:
    • Teaching Assistant: Helped 50+ Year 11 students with mathematics
    • Developed creative thinking skills through multiple explanation methods`,

  achievements: `Awards & Certificates:
=====================

[1] Winner of BRADHACK 12-Hours Hackathon                        Apr 2025
    PYSOC & AAIS – University of Bradford
    ──────────────────────────────────────────────────────────────
    • Built gamified learning project using Python
    • Developed math calculation game for young students
    • Added player levels and live limitations for accuracy
    • Implemented retro game sound effects

[2] Kickstart Level 1 for Student Representative Recognition
    ──────────────────────────────────────────────────────────────
    • Recognition for outstanding student leadership
    • Demonstrated commitment to student community

[3] AWS Cloud Practitioner Essentials
    ──────────────────────────────────────────────────────────────
    • Comprehensive understanding of AWS cloud services
    • Foundation in cloud computing concepts

[4] AWS Technical Essentials
    ──────────────────────────────────────────────────────────────
    • Technical knowledge of AWS infrastructure
    • Hands-on experience with cloud technologies

Academic Excellence:
• First Year Average: 76.31% (First Class Honours track)
• Subject Excellence: Mathematics (94%), Sciences (90.60%)
• Visual Arts/Music (98.25%)`,

  "extra-curricular": `Extra-Curricular Activities:
===========================

[1] BRADHACK Hackathon Winner                                    Apr 2025
    PYSOC & AAIS – University of Bradford
    ──────────────────────────────────────────────────────────────
    • Led team to victory in 12-hour coding competition
    • Built gamified learning project using Python game frameworks
    • Developed educational game for faster math calculations
    • Added retro sound effects for nostalgic user experience
    • Implemented player levels and live limitations

[2] Student Representative                                Oct 2024 - Current
    University of Bradford Students Union
    ──────────────────────────────────────────────────────────────
    • Represent over 200 Computer Science students
    • Act as liaison between students and faculty
    • Achieved 20% improvement in response time to student queries
    • Collaborated with university committees on curriculum concerns
    • Resulted in 15% increase in student satisfaction

[3] Teaching Assistant                                    Sep 2012 - May 2018
    High School Mathematics
    ──────────────────────────────────────────────────────────────
    • Helped over 50 Year 11 students with mathematics homework
    • Developed multiple explanation methods for complex concepts
    • Gained creative thinking and mentoring skills

Community Involvement:
• Active member of PYSOC (Python Society)
• Participant in AAIS activities
• Volunteer work with Cancer Research UK`,

  contact: `Contact Information:
===================

Personal Details:
─────────────────
Name:     Radin Mokari
Phone:    07867 913 661
Email:    radinmokariii@gmail.com
Location: Currently Bradford-based but flexible on location

Professional Links:
───────────────────
LinkedIn: www.linkedin.com/in/radin-mokari
GitHub:   https://github.com/Radin-Mokari

I'm always open to discussing:
• Data analysis and machine learning opportunities
• Software development projects
• Academic collaborations
• Internship and graduate opportunities
• Tech meetups and hackathons

References:
───────────
[1] Raizana Razeen, Education Officer
    Email: f.r.m.razeen@bradford.ac.uk

[2] Dr. Behruz Khaghani, Lecturer in Biomedical Engineering
    Email: s.khaghani@bradford.ac.uk

Feel free to reach out for networking, project collaborations,
or just to chat about technology and data science!`,

  clear: "CLEAR_TERMINAL",

  exit: `Session terminated.

Thank you for exploring my portfolio!

Connection to radin@portfolio closed.`,
}

export default function Portfolio() {
  // Initialize with static content first to avoid hydration mismatch
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    {
      type: "welcome",
      content: `Welcome to Radin Mokari's Portfolio Terminal v2.1.0

Last login: [Loading...] from portfolio.local

radin@portfolio:~$ welcome`,
    },
    {
      type: "output",
      content: `Hi, I'm Radin Mokari, a Computer Science student and Data Analyst.

Currently Bradford-based but flexible on location.
Welcome to my interactive portfolio terminal!

Type 'help' to see available commands or start exploring with 'about'.`,
    },
  ])

  const [currentCommand, setCurrentCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentTime, setCurrentTime] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update timestamp after hydration to avoid mismatch
  useEffect(() => {
    const now = new Date()
    const dateString = now.toDateString()
    const timeString = now.toLocaleTimeString()
    
    setCurrentTime(`${now.toLocaleDateString()} ${timeString}`)
    
    setTerminalLines(prev => prev.map((line, index) => 
      index === 0 ? {
        ...line,
        content: `Welcome to Radin Mokari's Portfolio Terminal v2.1.0

Last login: ${dateString} ${timeString} from portfolio.local

radin@portfolio:~$ welcome`
      } : line
    ))
  }, [])

  // Optimized scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      const element = terminalRef.current
      element.scrollTop = element.scrollHeight
    }
  }, [])

  // Auto-scroll when new content is added
  useEffect(() => {
    scrollToBottom()
  }, [terminalLines, scrollToBottom])

  // Focus input on mount and when clicking terminal
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    focusInput()

    // Add click listener to terminal for focus
    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", focusInput)
      return () => terminal.removeEventListener("click", focusInput)
    }
  }, [])

  const handleCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim()

    if (trimmedCmd === "") return

    // Add command to history
    setCommandHistory((prev) => [...prev, trimmedCmd])
    setHistoryIndex(-1)

    // Add command line to terminal immediately
    const commandLine: TerminalLine = {
      type: "command",
      content: `radin@portfolio:~$ ${trimmedCmd}`,
      timestamp: new Date().toLocaleTimeString(),
    }

    // Handle clear command
    if (trimmedCmd.toLowerCase() === "clear") {
      setTerminalLines([
        {
          type: "welcome",
          content: `radin@portfolio:~$ clear

Terminal cleared.`,
        },
      ])
      return
    }

    // Handle exit command
    if (trimmedCmd.toLowerCase() === "exit") {
      setTerminalLines((prev) => [
        ...prev,
        commandLine,
        {
          type: "output",
          content: commands.exit,
        },
      ])
      return
    }

    // Handle other commands - INSTANT response like real CLI
    const response = commands[trimmedCmd.toLowerCase() as keyof typeof commands]

    const outputLine: TerminalLine = {
      type: response ? "output" : "error",
      content:
        response ||
        `bash: ${trimmedCmd}: command not found

Type 'help' to see available commands.`,
    }

    // Add both command and response instantly
    setTerminalLines((prev) => [...prev, commandLine, outputLine])
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleCommand(currentCommand)
        setCurrentCommand("")
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
          setHistoryIndex(newIndex)
          setCurrentCommand(commandHistory[newIndex])
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (historyIndex !== -1) {
          const newIndex = historyIndex + 1
          if (newIndex >= commandHistory.length) {
            setHistoryIndex(-1)
            setCurrentCommand("")
          } else {
            setHistoryIndex(newIndex)
            setCurrentCommand(commandHistory[newIndex])
          }
        }
      } else if (e.key === "Tab") {
        e.preventDefault()
        // Simple autocomplete
        const availableCommands = Object.keys(commands).filter(
          (cmd) => cmd.startsWith(currentCommand.toLowerCase()) && cmd !== "clear",
        )
        if (availableCommands.length === 1) {
          setCurrentCommand(availableCommands[0])
        }
      } else if (e.key === "l" && e.ctrlKey) {
        // Ctrl+L to clear (common terminal shortcut)
        e.preventDefault()
        handleCommand("clear")
        setCurrentCommand("")
      }
    },
    [currentCommand, commandHistory, historyIndex, handleCommand],
  )

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex">
      {/* Left Side - 3D Hanging ID Card with dark background */}
      <div className="w-1/2 flex flex-col items-center justify-center relative bg-gray-900 overflow-hidden">
        <div className="w-full h-full relative">
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-green-400 animate-pulse text-lg mb-2">Loading 3D Interactive Card...</div>
                  <div className="text-gray-500 text-sm">Initializing physics engine...</div>
                </div>
              </div>
            }
          >
            <Scene3D />
          </Suspense>
        </div>

        {/* Instructions overlay - Repositioned for better alignment with new card position */}
        <div className="absolute bottom-6 left-6 right-6 text-center z-10">
          <div className="bg-black/95 backdrop-blur-sm rounded-lg p-3 border border-green-400/40">
            <p className="text-green-400 text-sm font-semibold">[Interactive 3D Card]</p>
            <p className="text-gray-300 text-xs mt-1">
              Click and drag the card to interact with it!
              <br />
              Experience realistic physics simulation.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Terminal - Enhanced layout matching reference */}
      <div className="w-1/2 p-6 flex flex-col bg-black">
        {/* Terminal Header - Professional styling */}
        <div className="bg-gray-900 rounded-t-lg p-3 flex items-center space-x-2 border-b border-gray-700">
          <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors"></div>
          <span className="text-gray-400 text-sm ml-4 font-semibold">radin@portfolio: ~</span>
          <div className="flex-1"></div>
          <span className="text-gray-600 text-xs">Terminal v2.1.0</span>
        </div>

        {/* Terminal Content - Optimized height and scrolling */}
        <div
          ref={terminalRef}
          className="bg-black rounded-b-lg p-4 flex-1 overflow-y-auto border border-gray-800 border-t-0 scroll-smooth"
          style={{
            maxHeight: "calc(100vh - 200px)",
            scrollBehavior: "smooth",
            overflowAnchor: "auto",
          }}
        >
          {/* Available Commands Header - Enhanced visibility */}
          <div className="text-green-400 text-xs mb-4 border-b border-gray-800 pb-2 opacity-80 font-mono">
            Available: help | about | experience | projects | education | achievements | extra-curricular | contact |
            clear | exit
          </div>

          {/* Terminal Lines */}
          {terminalLines.map((line, index) => (
            <div key={index} className="mb-1">
              <div
                className={`${
                  line.type === "command"
                    ? "text-green-400"
                    : line.type === "welcome"
                      ? "text-blue-400"
                      : line.type === "error"
                        ? "text-red-400"
                        : "text-gray-300"
                } whitespace-pre-wrap font-mono leading-relaxed text-sm`}
              >
                {line.content}
              </div>
            </div>
          ))}

          {/* Current Input Line - Enhanced styling */}
          <div className="flex items-center text-green-400 mt-3">
            <span className="mr-2 text-blue-400 font-semibold">radin@portfolio</span>
            <span className="mr-2 text-white">:</span>
            <span className="mr-2 text-blue-400">~</span>
            <span className="mr-2 text-white">$</span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none w-full text-green-400 font-mono terminal-input text-sm"
                placeholder=""
                autoComplete="off"
                spellCheck="false"
              />
              <span
                className="absolute top-0 text-green-400 animate-blink pointer-events-none"
                style={{ left: `${currentCommand.length}ch` }}
              >
                █
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Footer - Enhanced information */}
        <div className="bg-gray-900 px-4 py-2 text-gray-600 text-xs flex justify-between border border-gray-800 border-t-0 rounded-b-lg">
          <span>Use Tab for autocomplete • ↑↓ for history • Ctrl+L to clear</span>
          <span>
            {currentTime || "Loading..."}
          </span>
        </div>
      </div>
    </div>
  )
}
