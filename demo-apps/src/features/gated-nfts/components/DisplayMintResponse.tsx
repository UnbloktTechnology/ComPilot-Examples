import { shortAddress } from "@nexeraid/identity-schemas";

import type { MintResponse } from "../utils/evm/evm.schema";

const getTransactionStatus = (props: {
  mintResponse?: MintResponse;
  gasCost?: bigint;
  writeData?: {
    isSuccess: boolean;
    isLoading: boolean;
  };
  error?: string;
}) => {
  if (props.error) {
    return "Failed";
  }

  if (props.writeData?.isLoading) {
    return "Loading...";
  }

  if (props.writeData?.isSuccess) {
    return props.gasCost ? "Success" : "Minting...";
  }

  return "Failed";
};

export const DisplayMintResponse = (props: {
  mintResponse?: MintResponse;
  gasCost?: bigint;
  writeData?: {
    isSuccess: boolean;
    isLoading: boolean;
  };
  error?: string;
}) => {
  return (
    <label>
      {props.mintResponse ? (
        <div>
          <div>
            Authorized:{" "}
            {props.mintResponse.signatureResponse.isAuthorized ? "YES" : "NO"}
          </div>
          {props.mintResponse.signatureResponse.isAuthorized && (
            <>
              <div>
                Payload:{" "}
                {shortAddress(props.mintResponse.signatureResponse.payload)}
              </div>
              <div>
                Block Expiration:{" "}
                {props.mintResponse.signatureResponse.blockExpiration}
              </div>
              <div>
                Signature:{" "}
                {shortAddress(props.mintResponse.signatureResponse.signature)}
              </div>
            </>
          )}
          {props.writeData && (
            <div>Transaction Status: {getTransactionStatus(props)}</div>
          )}
          {!props.error && (
            <div>
              Gas Cost: {props.gasCost ? props.gasCost.toString() : "Pending"}
            </div>
          )}
          {props.error && <div>Error: {props.error}</div>}
        </div>
      ) : (
        "No Response"
      )}
    </label>
  );
};
