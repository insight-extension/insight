import { Wallet } from "~components/Wallet"

function IndexPopup() {
  return (
    <div
      style={{
        padding: "10px",
        border: "3px solid black",
        width: "300px",
        height: "800px"
      }}>
      <h1>WALLET</h1>

      <Wallet />
    </div>
  )
}

export default IndexPopup
