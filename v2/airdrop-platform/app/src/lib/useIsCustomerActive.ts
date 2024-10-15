import { useCustomerStatus } from "@compilot/react-sdk";

export const useIsCustomerActive = () => {
  const { data: status } = useCustomerStatus();
  return status === undefined ? undefined : status === "Active";
};
