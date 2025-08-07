"use client";

import { useState, useRef } from "react";
import Konva from "konva";
import dynamic from "next/dynamic";
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import UtilitiesBar from "./UtilitiesBar";
import { UTILITY_BUTTONS } from "./constants";
import { UtilityButtonType } from "./type";

const KonvaCanvas = dynamic(() => import("./KonvaCanvas"), {
  ssr: false,
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
  },
});

export default function Page() {
  const [activeUtilityButton, setActiveUtilityButton] =
    useState<UtilityButtonType>(UTILITY_BUTTONS.DRAW);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  return (
    <ThemeProvider theme={theme}>
      <Box padding={1}>
        <UtilitiesBar
          activeUtilityButton={activeUtilityButton}
          setActiveUtilityButton={setActiveUtilityButton}
          fileRef={fileRef}
          stageRef={stageRef}
        />
        <KonvaCanvas
          activeUtilityButton={activeUtilityButton}
          setActiveUtilityButton={setActiveUtilityButton}
          fileRef={fileRef}
          stageRef={stageRef}
        />
      </Box>
    </ThemeProvider>
  );
}
