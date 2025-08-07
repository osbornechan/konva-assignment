import { ReactNode, Dispatch, SetStateAction } from "react";
import { Button, Tooltip } from "@mui/material";
import { UTILITY_BUTTONS } from "./constants";

type UtilitiesButtonProps = {
  children: string | ReactNode;
  tooltipTitle: string;
  isSelected?: boolean;
  startIcon?: ReactNode;
  setActiveUtilityButton: Dispatch<
    SetStateAction<(typeof UTILITY_BUTTONS)[keyof typeof UTILITY_BUTTONS]>
  >;
  handleClick?: () => void;
};

export default function UtilitiesButton({
  children,
  tooltipTitle,
  isSelected = false,
  startIcon,
  setActiveUtilityButton,
  handleClick,
}: UtilitiesButtonProps) {
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        sx={{ fontWeight: 550 }}
        startIcon={startIcon}
        variant={isSelected ? "contained" : "outlined"}
        onClick={() => {
          setActiveUtilityButton(tooltipTitle);
          if (handleClick) {
            handleClick();
          }
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
