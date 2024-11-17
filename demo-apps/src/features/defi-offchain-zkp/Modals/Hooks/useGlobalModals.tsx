import { type ReactNode } from "react";
import { create } from "zustand";
import { type BackgroundType } from "@/features/defi-offchain-zkp/Layout/Layout";

type CenterModalStyle = "default" | "rounded";

export interface ICenterModal {
  isOpen: boolean;
  children: ReactNode;
  style?: CenterModalStyle;
  overlay?: boolean;
  bg?: BackgroundType;
  onClose?: () => void;
}

interface ModalStoreAttributes {
  title?: string;
  modalType?: "bottom" | "center" | "full" | "empty";
  overlayType?: "base" | "dark";
  style?: CenterModalStyle;
  bg?: BackgroundType;
  arrow?: boolean;
  onArrowClick?: () => void;
}

/**
 * Types
 */
interface ModalData {
  basicData?: {
    ctaButton?: ReactNode;
    text: string;
    title?: string;
    icon?: string;
    textButton?: string;
    onClick?: () => void;
  };
}

interface IModalStore {
  isOpen: boolean;
  view?: "LogOnModal";
  attributes?: ModalStoreAttributes;
  data?: ModalData;
  open: (
    view: IModalStore["view"],
    attributes?: ModalStoreAttributes,
    data?: ModalData,
  ) => void;
  close: () => void;
}

/**
 * Zustand Store
 */

export const useGlobalModals = create<IModalStore>((set) => ({
  isOpen: false,
  view: undefined,
  data: undefined,
  attributes: undefined,
  open: (
    view: IModalStore["view"],
    attributes: ModalStoreAttributes = {
      title: "GlobalModals",
      modalType: "center",
      overlayType: "base",
    },
    data?: ModalData,
  ) => {
    set({
      isOpen: true,
      view,
      data,
      attributes,
    });
  },
  close: () => {
    set({
      isOpen: false,
      view: undefined,
      data: undefined,
      attributes: undefined,
    });
  },
}));
