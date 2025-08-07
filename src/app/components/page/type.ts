import Konva from "konva";
import { Dispatch, SetStateAction, RefObject } from "react";
import { UTILITY_BUTTONS } from "./constants";

type UtilityButtonType = (typeof UTILITY_BUTTONS)[keyof typeof UTILITY_BUTTONS];

type UtilityButtonProps = {
  activeUtilityButton: UtilityButtonType,
  setActiveUtilityButton: Dispatch<
    SetStateAction<UtilityButtonType>
  >;
  fileRef: RefObject<HTMLInputElement | null>;
  stageRef: RefObject<Konva.Stage | null>;
};

type ShapeType = {
  id: string;
  color: string;
  x?: number;
  y?: number;
};

type LineType = ShapeType & {
  points: number[];
  tool: typeof UTILITY_BUTTONS.DRAW | typeof UTILITY_BUTTONS.ERASE;
};

type RectangleType = ShapeType & {
  width: number;
  height: number;
  x: number;
  y: number;
};

type TriangleType = ShapeType & {
  width: number;
  height: number;
  x: number;
  y: number;
}

type CircleType = ShapeType & {
  radius: number;
  x: number;
  y: number;
};

type ArrowType = ShapeType & {
  points: [number, number, number, number];
};

export type {
  UtilityButtonType,
  UtilityButtonProps,
  LineType,
  ShapeType,
  RectangleType,
  TriangleType,
  CircleType,
  ArrowType,
};