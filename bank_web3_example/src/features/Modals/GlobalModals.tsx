import { CenterModal } from "@/features/Modals/CenterModal";
import { shallow } from "zustand/shallow";

import { useGlobalModals } from "./useGlobalModals";
import { LogOnModal } from "@/features/identity/LogOnModal";

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
