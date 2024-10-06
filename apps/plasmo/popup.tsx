import { Home } from "@repo/ui/components"
import React, { useState } from "react"

const IndexPopup: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("No Connected Wallet")
  const [balance, setBalance] = useState("0.00 USDC")
  const [status, setStatus] = useState("Idle")
  const [isRecording, setIsRecording] = useState(false)

  const handleConnectWallet = () => {
    // Logic to connect wallet
  }

  const handleDepositFunds = () => {
    // Logic to deposit funds
  }

  const handleStartCapture = () => {
    setIsRecording(true)
    setStatus("Recording...")
  }

  const handleStopCapture = () => {
    setIsRecording(false)
    setStatus("Idle")
  }

  return (
    <div className="min-h-screen bg-cover bg-white bg-top p-5">
      {/* Wallet Section */}
      <div className="mb-6">
        <button className="btn" onClick={handleConnectWallet}>
          Connect Wallet
        </button>
        <button className="btn ml-2" onClick={handleDepositFunds}>
          Deposit Funds
        </button>
        {/* <button className="btn ml-2">Withdraw Funds</button> */}
        <p className="mt-3 font-bold">{walletAddress}</p>
        <p className="font-bold">Balance: {balance}</p>
      </div>

      {/* Capture Section */}
      <div className="mb-6">
        <button
          className="btn"
          onClick={handleStartCapture}
          disabled={isRecording}>
          Start
        </button>
        <button
          className="btn ml-2"
          onClick={handleStopCapture}
          disabled={!isRecording}>
          Stop
        </button>
      </div>

      {/* Sidebar Button */}
      <button className="btn mb-6">Sidebar</button>

      {/* Status */}
      <div className="mb-6 text-lg font-semibold">Status: {status}</div>

      {/* Transcript and Translation Display */}
      <div className="flex space-x-6">
        <div className="transcript-box bg-gray-100">
          <p className="font-bold">Transcript:</p>
        </div>
        <div className="transcript-box bg-green-100">
          <p className="font-bold">Translation:</p>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
