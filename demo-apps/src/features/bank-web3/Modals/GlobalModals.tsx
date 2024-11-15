import { CenterModal } from "@/features/bank-web3/Modals/CenterModal";
import { shallow } from "zustand/shallow";

import { useGlobalModals } from "./useGlobalModals";
import { LogOnModal } from "@/features/bank-web3/identity/LogOnModal";

export const GlobalModals = () => {
  const { view, isOpen, close, attributes } = useGlobalModals(
    (state) => ({
      view: state.view,
      isOpen: state.isOpen,
      close: state.close,
      attributes: state.attributes,
    }),
    shallow,
  );

  switch (attributes?.modalType) {
    case "center":
      return (
        <CenterModal
          isOpen={isOpen}
          onClose={close}
          style={attributes.style}
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          bg={attributes.bg}
          overlay
        >
          {view === "LogOnModal" && <LogOnModal />}
        </CenterModal>
      );
    default:
      return <></>;
  }
};
