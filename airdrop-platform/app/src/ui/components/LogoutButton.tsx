import { useLogout } from "@/lib/useLogout";
import { Button } from "./Button";

interface LogoutButtonProps {
  label?: string;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const LogoutButton = ({
  label,
  variant,
  isLoading,
}: LogoutButtonProps) => {
  const logout = useLogout();

  return (
    <Button
      variant={variant ?? "secondary"}
      onClick={logout}
      isLoading={isLoading}
    >
      {label ?? "Try another wallet"}
    </Button>
  );
};
