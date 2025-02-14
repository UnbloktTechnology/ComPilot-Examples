import { useOpenWidget } from "@compilot/react-sdk";
import { useState } from "react";
import { 
  compilotConfigWalletKYC, 
  compilotConfigWalletKYB,
  compilotConfigRegularKYC,
  compilotConfigRegularKYB 
} from "../pages/_app";

interface ComPilotButtonProps {
  config: 'KYC' | 'KYB';
  hasWallet: boolean;
  setActiveConfig: (config: any) => void;
}

const ComPilotButton = ({ config, hasWallet, setActiveConfig }: ComPilotButtonProps) => {
  const openWidget = useOpenWidget();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!config) return; // Protection contre config undefined

    try {
      setIsLoading(true);
      
      // Sélectionne la bonne configuration selon le cas
      if (hasWallet) {
        setActiveConfig(config === 'KYC' ? compilotConfigWalletKYC : compilotConfigWalletKYB);
      } else {
        setActiveConfig(config === 'KYC' ? compilotConfigRegularKYC : compilotConfigRegularKYB);
      }

      await openWidget.openWidget();
    } catch (error) {
      console.error(`Error starting ${config} verification:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Protection contre config undefined dans le rendu
  if (!config) return null;

  return (
    <button
      id={`compilot-${config.toLowerCase()}-button`}
      disabled={isLoading || openWidget.isPending}
      onClick={handleClick}
    >
      {isLoading || openWidget.isPending ? 'Loading...' : `Start ${config}`}
    </button>
  );
};

export default ComPilotButton;
