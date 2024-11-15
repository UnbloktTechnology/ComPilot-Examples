import type { ReactNode } from "react";
import type { BackgroundType } from "@/features/bank-web3/Layout";
import { create } from "zustand";

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
  isCompliant?: boolean;
}

interface IModalStore {
  isOpen: boolean;
  view?: "KycModal" | "LogOnModal" | "AbnModal";
  attributes?: ModalStoreAttributes;
  data?: ModalData;
  open: (
    view: IModalStore["view"],
    attributes?: ModalStoreAttributes,
    data?: ModalData,
  ) => void;
  close: () => void;
  setIsCompliant: (isCompliant: boolean) => void;
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
  setIsCompliant: (isCompliant: boolean) => {
    set((state) => ({
      ...state,
      data: {
        ...state.data,
        isCompliant,
      },
    }));
  },
}));
