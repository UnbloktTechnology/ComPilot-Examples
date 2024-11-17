import { CenterModal } from "@/features/defi-offchain-zkp/Modals/CenterModal";
import { shallow } from "zustand/shallow";
import { useGlobalModals } from "./Hooks/useGlobalModals";
import { LogOnModal } from "@/features/defi-offchain-zkp/identity/LogOnModal";

export const GlobalModals = () => {
  const { isOpen, close, attributes } = useGlobalModals(
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
          <LogOnModal />
        </CenterModal>
      );
    default:
      return <></>;
  }
};
