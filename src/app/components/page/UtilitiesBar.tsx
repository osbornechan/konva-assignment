import { useCallback } from "react";
import { ButtonGroup, Stack, Typography } from "@mui/material";
import {
  Mode,
  EditOff,
  Colorize,
  Clear,
  FileUploadOutlined,
  FileDownloadOutlined,
  SquareOutlined,
  CircleOutlined,
  ChangeHistoryOutlined,
  NorthWestOutlined,
  PanToolOutlined,
} from "@mui/icons-material";
import UtilitiesButton from "./UtilitiesButton";
import { UTILITY_BUTTONS } from "./constants";
import { UtilityButtonProps } from "./type";

const downloadURI = (uri: string | undefined, name: string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri || "";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function UtilitiesBar({
  activeUtilityButton,
  setActiveUtilityButton,
  fileRef,
  stageRef,
}: UtilityButtonProps) {
  const onImportImageClick = useCallback(() => {
    fileRef.current?.click();
  }, [fileRef]);

  const onExportClick = useCallback(() => {
    const dataUri = stageRef?.current?.toDataURL({ pixelRatio: 3 });
    downloadURI(dataUri, "image.png");
    setActiveUtilityButton(UTILITY_BUTTONS.DRAW);
  }, [stageRef, setActiveUtilityButton]);

  return (
    <Stack direction="row" spacing={2}>
      <Stack>
        <Typography variant="caption" color="primary" fontWeight={600}>
          Lines
        </Typography>
        <ButtonGroup>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.DRAW}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.DRAW}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <Mode />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.ERASE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.ERASE}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <EditOff />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.COLOR_PICKER}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.COLOR_PICKER}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <Colorize />
          </UtilitiesButton>
        </ButtonGroup>
      </Stack>

      <Stack>
        <Typography variant="caption" color="primary" fontWeight={600}>
          Shapes
        </Typography>
        <ButtonGroup>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.RECTANGLE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.RECTANGLE}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <SquareOutlined />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.CIRCLE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.CIRCLE}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <CircleOutlined />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.TRIANGLE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.TRIANGLE}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <ChangeHistoryOutlined />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.ARROW}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.ARROW}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <NorthWestOutlined />
          </UtilitiesButton>
        </ButtonGroup>
      </Stack>

      <Stack>
        <Typography variant="caption" color="primary" fontWeight={600}>
          Utility
        </Typography>
        <ButtonGroup>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.SELECT}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.SELECT}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <PanToolOutlined />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.CLEAR}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.CLEAR}
            setActiveUtilityButton={setActiveUtilityButton}
          >
            <Clear />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.IMPORT_IMAGE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.IMPORT_IMAGE}
            setActiveUtilityButton={setActiveUtilityButton}
            handleClick={onImportImageClick}
          >
            <FileUploadOutlined />
          </UtilitiesButton>
          <UtilitiesButton
            tooltipTitle={UTILITY_BUTTONS.EXPORT_FILE}
            isSelected={activeUtilityButton === UTILITY_BUTTONS.EXPORT_FILE}
            setActiveUtilityButton={setActiveUtilityButton}
            handleClick={onExportClick}
          >
            <FileDownloadOutlined />
          </UtilitiesButton>
        </ButtonGroup>
      </Stack>
    </Stack>
  );
}
