"use client"

import { ethers } from "ethers"
import { VotingSystem } from "../types/contracts"

// Contract ABI and address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""
// In blockchain-voting/lib/blockchain.ts
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "getCandidates",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "name", type: "string" },
          { name: "voteCount", type: "uint256" }
        ],
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_candidateId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ name: "voter", type: "address" }],
    name: "hasVoted",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "voter", type: "address" }],
    name: "getVotedCandidate",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "electionActive",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "toggleElectionStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
]

// Mock data for development
const mockData = {
  positions: [
    {
      id: "president",
      title: "President",
      candidates: [
        { id: "1", name: "Alex Johnson", position: "President", party: "Progress Party", votes: 145, percentage: 42.5 },
        { id: "2", name: "Maria Garcia", position: "President", party: "Student Voice", votes: 120, percentage: 35.2 },
        { id: "3", name: "David Kim", position: "President", party: "Independent", votes: 76, percentage: 22.3 },
      ],
      totalVotes: 341,
    },
    {
      id: "vp",
      title: "Vice President",
      candidates: [
        {
          id: "4",
          name: "Sarah Williams",
          position: "Vice President",
          party: "Progress Party",
          votes: 132,
          percentage: 38.7,
        },
        {
          id: "5",
          name: "James Wilson",
          position: "Vice President",
          party: "Student Voice",
          votes: 156,
          percentage: 45.7,
        },
        { id: "6", name: "Emily Chen", position: "Vice President", party: "Independent", votes: 53, percentage: 15.6 },
      ],
      totalVotes: 341,
    },
    {
      id: "secretary",
      title: "Secretary",
      candidates: [
        {
          id: "7",
          name: "Michael Brown",
          position: "Secretary",
          party: "Progress Party",
          votes: 167,
          percentage: 49.0,
        },
        { id: "8", name: "Jessica Lee", position: "Secretary", party: "Student Voice", votes: 174, percentage: 51.0 },
      ],
      totalVotes: 341,
    },
  ],
  voters: [
    {
      id: "1",
      studentId: "ST12345",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      department: "Computer Science",
      registrationDate: "2025-04-15",
      hasVoted: true,
    },
    {
      id: "2",
      studentId: "ST12346",
      walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
      department: "Engineering",
      registrationDate: "2025-04-16",
      hasVoted: true,
    },
    {
      id: "3",
      studentId: "ST12347",
      walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
      department: "Business",
      registrationDate: "2025-04-16",
      hasVoted: false,
    },
    {
      id: "4",
      studentId: "ST12348",
      walletAddress: "0x4567890123abcdef4567890123abcdef45678901",
      department: "Arts",
      registrationDate: "2025-04-17",
      hasVoted: true,
    },
    {
      id: "5",
      studentId: "ST12349",
      walletAddress: "0x5678901234abcdef5678901234abcdef56789012",
      department: "Science",
      registrationDate: "2025-04-18",
      hasVoted: false,
    },
  ],
  candidates: [
    { id: "1", name: "Alex Johnson", position: "President", party: "Progress Party" },
    { id: "2", name: "Maria Garcia", position: "President", party: "Student Voice" },
    { id: "3", name: "David Kim", position: "President", party: "Independent" },
    { id: "4", name: "Sarah Williams", position: "Vice President", party: "Progress Party" },
    { id: "5", name: "James Wilson", position: "Vice President", party: "Student Voice" },
    { id: "6", name: "Emily Chen", position: "Vice President", party: "Independent" },
    { id: "7", name: "Michael Brown", position: "Secretary", party: "Progress Party" },
    { id: "8", name: "Jessica Lee", position: "Secretary", party: "Student Voice" },
  ],
}

// Connect to wallet
export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed")
    }

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    const targetChainId = process.env.NEXT_PUBLIC_NETWORK_ID || '0x539' // 1337 in hex

    if (chainId !== targetChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        })
      } catch (error) {
        // Type guard for MetaMask error
        const switchError = error as { code: number }
        // If the network is not added to MetaMask
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: targetChainId,
              chainName: 'Localhost',
              rpcUrls: ['http://127.0.0.1:8545'],
            }],
          })
        }
      }
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return accounts[0]
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    throw error
  }
}

// Get contract instance
export async function getContract() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("MetaMask is not installed")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer) as unknown as VotingSystem
}

// Register voter
export const registerVoter = async (studentData: any) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Registering voter:", studentData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error("Error registering voter:", error)
    throw error
  }
}

// Check voter status
export const checkVoterStatus = async () => {
  try {
    // In a real implementation, this would check the blockchain
    console.log("Checking voter status")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // For demo purposes, return false to allow voting
    return { hasVoted: false }
  } catch (error) {
    console.error("Error checking voter status:", error)
    throw error
  }
}

// Get election data
export const getElectionData = async () => {
  try {
    // In a real implementation, this would fetch from the blockchain
    console.log("Getting election data")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return { positions: mockData.positions }
  } catch (error) {
    console.error("Error getting election data:", error)
    throw error
  }
}

// Cast vote
export const castVote = async (selectedCandidates: Record<string, string>) => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed")
    }

    const contract = await getContract()
    const provider = new ethers.BrowserProvider(window.ethereum as any)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    
    // Check if user has already voted
    const hasUserVoted = await contract.hasVoted(address)
    if (hasUserVoted) {
      const votedFor = await contract.getVotedCandidate(address)
      throw new Error(`You have already voted for candidate ${votedFor} in this election`)
    }

    // Cast vote for the selected candidate
    const tx = await contract.vote(selectedCandidates.candidateId)
    const receipt = await tx.wait()

    return { 
      success: true, 
      transactionHash: receipt.hash 
    }
  } catch (error) {
    console.error("Error casting vote:", error)
    throw error
  }
}

// Get election results
export const getElectionResults = async () => {
  try {
    const contract = await getContract()
    const candidates = await contract.getCandidates()
    
    // Calculate total votes
    const totalVotes = candidates.reduce((sum: number, candidate: any) => 
      sum + Number(candidate.voteCount), 0)

    // Format the results
    const positions = [{
      id: "election",
      title: "Election Results",
      candidates: candidates.map((candidate: any) => ({
        id: candidate.id.toString(),
        name: candidate.name,
        position: "Candidate",
        party: "Independent",
        votes: Number(candidate.voteCount),
        percentage: totalVotes > 0 
          ? (Number(candidate.voteCount) / totalVotes * 100).toFixed(1)
          : "0"
      })),
      totalVotes
    }]

    return { positions }
  } catch (error) {
    console.error("Error getting election results:", error)
    throw error
  }
}

// Get admin data
export const getAdminData = async () => {
  try {
    // In a real implementation, this would fetch from the blockchain
    console.log("Getting admin data")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return {
      totalVoters: 500,
      registeredVoters: 341,
      votesCount: 245,
      electionStatus: "Active",
      candidates: mockData.candidates,
      voters: mockData.voters,
    }
  } catch (error) {
    console.error("Error getting admin data:", error)
    throw error
  }
}

// Create election
export const createElection = async (electionData: any) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Creating election:", electionData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { success: true }
  } catch (error) {
    console.error("Error creating election:", error)
    throw error
  }
}

// Add candidate
export const addCandidate = async (candidateData: any) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Adding candidate:", candidateData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error("Error adding candidate:", error)
    throw error
  }
}

// Remove candidate
export const removeCandidate = async (candidateId: string) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Removing candidate:", candidateId)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return { success: true }
  } catch (error) {
    console.error("Error removing candidate:", error)
    throw error
  }
}

// Start election
export const startElection = async () => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Starting election")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return { success: true }
  } catch (error) {
    console.error("Error starting election:", error)
    throw error
  }
}

// End election
export const endElection = async () => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Ending election")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return { success: true }
  } catch (error) {
    console.error("Error ending election:", error)
    throw error
  }
}

// Verify student eligibility
export const verifyStudentEligibility = async (studentData: any) => {
  try {
    // In a real implementation, this would check against a university database
    console.log("Verifying student eligibility:", studentData)

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, we'll approve most students
    // In production, this would check against actual university records
    if (!studentData.studentId || !studentData.matricNumber) {
      return {
        eligible: false,
        message: "Invalid student ID or matriculation number.",
      }
    }

    return {
      eligible: true,
      studentId: studentData.studentId,
      department: studentData.department,
      level: studentData.level,
    }
  } catch (error) {
    console.error("Error verifying eligibility:", error)
    throw error
  }
}

// Get voting categories
export const getVotingCategories = async () => {
  try {
    // In a real implementation, this would fetch from the blockchain
    console.log("Getting voting categories")

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock data for demonstration
    return [
      {
        id: "sug",
        name: "Student Union Government",
        description: "Main student representative body",
        positions: ["President", "Vice President", "Secretary", "Treasurer", "PRO"],
      },
      {
        id: "faculty",
        name: "Faculty Representatives",
        description: "Representatives for each faculty",
        positions: ["Faculty Rep", "Assistant Faculty Rep"],
      },
      {
        id: "department",
        name: "Departmental Executives",
        description: "Leadership for individual departments",
        positions: ["President", "Vice President", "Secretary", "Treasurer"],
      },
    ]
  } catch (error) {
    console.error("Error getting voting categories:", error)
    throw error
  }
}

// Add voting category
export const addVotingCategory = async (categoryData: any) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Adding voting category:", categoryData)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    return { success: true }
  } catch (error) {
    console.error("Error adding voting category:", error)
    throw error
  }
}

// Remove voting category
export const removeVotingCategory = async (categoryId: string) => {
  try {
    // In a real implementation, this would interact with the blockchain
    console.log("Removing voting category:", categoryId)

    // Simulate blockchain delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return { success: true }
  } catch (error) {
    console.error("Error removing voting category:", error)
    throw error
  }
}

export async function getCandidates() {
  try {
    const contract = await getContract()
    const candidates = await contract.getCandidates()
    return candidates.map((candidate: any) => ({
      id: candidate.id.toString(),
      name: candidate.name,
      voteCount: candidate.voteCount.toString(),
      position: "Candidate",
      party: "Independent",
      image: `/candidates/candidate-${candidate.id.toString()}.jpg`
    }))
  } catch (error) {
    console.error("Error getting candidates:", error)
    throw error
  }
}

export async function vote(candidateId: string) {
  const contract = await getContract()
  const tx = await contract.vote(candidateId)
  await tx.wait()
  return tx.hash
}

export async function hasVoted(address: string) {
  const contract = await getContract()
  return await contract.hasVoted(address)
}

// Add function to check election status
export const getElectionStatus = async () => {
  try {
    const contract = await getContract()
    return await contract.electionActive()
  } catch (error) {
    console.error("Error getting election status:", error)
    throw error
  }
}

// Add function to get voter's voted candidate
export const getVotedCandidate = async (address: string) => {
  try {
    const contract = await getContract()
    return await contract.getVotedCandidate(address)
  } catch (error) {
    console.error("Error getting voted candidate:", error)
    throw error
  }
}

export const toggleElectionStatus = async () => {
  try {
    const contract = await getContract()
    const tx = await contract.toggleElectionStatus()
    await tx.wait()
    return true
  } catch (error) {
    console.error("Error toggling election status:", error)
    throw error
  }
}
