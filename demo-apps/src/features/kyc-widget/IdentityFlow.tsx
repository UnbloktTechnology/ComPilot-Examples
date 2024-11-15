import React from "react";
import {
  useAuthenticate,
  useOpenWidget,
  useCustomerStatus,
} from "@compilot/react-sdk";

export const IdentityFlow = () => {
  const openWidget = useOpenWidget();
  const authenticate = useAuthenticate();
  const customerStatus = useCustomerStatus();
  const isCompliant = customerStatus.data === "Active";
  const isLoading =
    openWidget.isPending || authenticate.isPending || customerStatus.isLoading;

  let buttonText: string;
  let buttonEnabled = true;
  if (isLoading) {
    buttonText = "Loading...";
  } else if (authenticate.data === false) {
    buttonText = "Start KYC";
  } else if (customerStatus.data && customerStatus.data !== "Active") {
    buttonText = "Not Compliant";
    buttonEnabled = false;
  } else if (customerStatus.data === "Active") {
    buttonText = "Verified!";
    buttonEnabled = false;
  } else {
    buttonText = "Verify";
  }

  return (
    <div>
      <h1>Identity Flow</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {isCompliant && <div className="text-green-500">Verified!</div>}
        {!isCompliant && (
          <button
            disabled={!buttonEnabled}
            style={{
              padding: "16px 24px",
              borderRadius: 16,
              cursor: buttonEnabled ? "pointer" : "not-allowed",
              backgroundColor: buttonEnabled ? "#0258FD" : "#ccc",
              color: buttonEnabled ? "white" : "black",
              fontWeight: buttonEnabled ? "bold" : "normal",
              fontSize: "16px",
              border: "none",
            }}
            onClick={() => void openWidget.openWidget()}
            id="identity-btn"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};
