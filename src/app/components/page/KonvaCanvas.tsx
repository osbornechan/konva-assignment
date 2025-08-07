import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";
import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Rect as KonvaRect,
  Image as KonvaImage,
  Circle as KonvaCircle,
  Line as KonvaLine,
  Arrow as KonvaArrow,
  Shape as KonvaShape,
  Transformer,
} from "react-konva";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowType,
  CircleType,
  RectangleType,
  LineType,
  TriangleType,
} from "./type";
import { UTILITY_BUTTONS, SIZE } from "./constants";
import { UtilityButtonProps } from "./type";

import { HexColorPicker } from "react-colorful";
import { Box } from "@mui/material";

function ColorPicker({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  return (
    <HexColorPicker
      color={color}
      onChange={onChange}
      style={{
        position: "absolute",
        top: 80, // change as needed
        right: 20,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 10,
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        width: "200px",
      }}
    />
  );
}

export default function KonvaCanvas({
  activeUtilityButton,
  setActiveUtilityButton,
  fileRef,
  stageRef,
}: UtilityButtonProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [color, setColor] = useState("#000000");
  const [lines, setLines] = useState<LineType[]>([]);
  const [rectangles, setRectangles] = useState<RectangleType[]>([]);
  const [triangles, setTriangles] = useState<TriangleType[]>([]);
  const [circles, setCircles] = useState<CircleType[]>([]);
  const [arrows, setArrows] = useState<ArrowType[]>([]);
  const [image, setImage] = useState<HTMLImageElement>();

  const canvasRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const { offsetWidth, offsetHeight } = canvasRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onClear = useCallback(() => {
    setLines([]);
    setRectangles([]);
    setTriangles([]);
    setCircles([]);
    setArrows([]);
    setImage(undefined);
  }, []);

  const onImportImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        const imageUrl = URL.createObjectURL(e.target.files?.[0]);
        const image = new Image(SIZE / 2, SIZE / 2);
        image.src = imageUrl;
        setImage(image);
      }
      e.target.files = null;
      setActiveUtilityButton(UTILITY_BUTTONS.DRAW);
    },
    [setActiveUtilityButton]
  );

  useEffect(() => {
    switch (activeUtilityButton) {
      case UTILITY_BUTTONS.CLEAR: {
        onClear();
        setActiveUtilityButton(UTILITY_BUTTONS.DRAW);
        break;
      }
    }
  }, [onClear, activeUtilityButton, setActiveUtilityButton]);

  const isPaintRef = useRef(false);

  const onStageMouseUp = useCallback(() => {
    isPaintRef.current = false;
  }, []);

  const currentShapeRef = useRef<string>("");

  const onStageMouseDown = useCallback(() => {
    if (activeUtilityButton === UTILITY_BUTTONS.SELECT) return;
    isPaintRef.current = true;
    const stage = stageRef?.current;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;
    const id = uuidv4();
    currentShapeRef.current = id;

    switch (activeUtilityButton) {
      case UTILITY_BUTTONS.DRAW:
      case UTILITY_BUTTONS.ERASE: {
        setLines((prevLines) => [
          ...prevLines,
          {
            id,
            points: [x, y],
            color:
              activeUtilityButton === UTILITY_BUTTONS.ERASE ? "#FFFFF" : color,
            tool: activeUtilityButton,
          },
        ]);
        break;
      }
      case UTILITY_BUTTONS.CIRCLE: {
        setCircles((prevCircles) => [
          ...prevCircles,
          {
            id,
            radius: 1,
            x,
            y,
            color,
          },
        ]);
        break;
      }
      case UTILITY_BUTTONS.RECTANGLE: {
        setRectangles((prevRectangles) => [
          ...prevRectangles,
          {
            id,
            height: 1,
            width: 1,
            x,
            y,
            color,
          },
        ]);
        break;
      }
      case UTILITY_BUTTONS.TRIANGLE: {
        setTriangles((prevTriangles) => [
          ...prevTriangles,
          {
            id,
            height: 1,
            width: 1,
            x,
            y,
            color,
          },
        ]);
        break;
      }
      case UTILITY_BUTTONS.ARROW: {
        setArrows((prevArrows) => [
          ...prevArrows,
          {
            id,
            points: [x, y, x, y],
            color,
          },
        ]);
        break;
      }
    }
  }, [activeUtilityButton, color, stageRef]);

  const onStageMouseMove = useCallback(() => {
    if (activeUtilityButton === UTILITY_BUTTONS.SELECT || !isPaintRef.current)
      return;

    const stage = stageRef?.current;
    const id = currentShapeRef.current;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;

    switch (activeUtilityButton) {
      case UTILITY_BUTTONS.DRAW:
      case UTILITY_BUTTONS.ERASE: {
        setLines((prevLines) =>
          prevLines?.map((prevLine) =>
            prevLine.id === id
              ? {
                  ...prevLine,
                  points: [...prevLine.points, x, y],
                }
              : prevLine
          )
        );
        break;
      }
      case UTILITY_BUTTONS.CIRCLE: {
        setCircles((prevCircles) =>
          prevCircles?.map((prevCircle) =>
            prevCircle.id === id
              ? {
                  ...prevCircle,
                  radius:
                    ((x - prevCircle.x) ** 2 + (y - prevCircle.y) ** 2) ** 0.5,
                }
              : prevCircle
          )
        );
        break;
      }
      case UTILITY_BUTTONS.RECTANGLE: {
        setRectangles((prevRectangles) =>
          prevRectangles?.map((prevRectangle) =>
            prevRectangle.id === id
              ? {
                  ...prevRectangle,
                  height: y - prevRectangle.y,
                  width: x - prevRectangle.x,
                }
              : prevRectangle
          )
        );
        break;
      }
      case UTILITY_BUTTONS.TRIANGLE: {
        setTriangles((prevTriangles) =>
          prevTriangles?.map((prevTriangle) =>
            prevTriangle.id === id
              ? {
                  ...prevTriangle,
                  height: y - prevTriangle.y,
                  width: x - prevTriangle.x,
                }
              : prevTriangle
          )
        );
        break;
      }
      case UTILITY_BUTTONS.ARROW: {
        setArrows((prevArrows) =>
          prevArrows.map((prevArrow) =>
            prevArrow.id === id
              ? {
                  ...prevArrow,
                  points: [prevArrow.points[0], prevArrow.points[1], x, y],
                }
              : prevArrow
          )
        );
        break;
      }
    }
  }, [activeUtilityButton, stageRef]);

  const transformerRef = useRef<Konva.Transformer>(null);

  const onShapeClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (activeUtilityButton !== UTILITY_BUTTONS.SELECT) return;
      const currentTarget = e.currentTarget;
      transformerRef?.current?.nodes([currentTarget]);
    },
    [activeUtilityButton]
  );

  const isDraggable = activeUtilityButton === UTILITY_BUTTONS.SELECT;

  const onBgClick = useCallback(() => {
    transformerRef?.current?.nodes([]);
  }, []);

  return (
    <Box
      ref={canvasRef}
      border="1px solid #4f46e5"
      width="100%"
      height="100vh"
      marginBlock={1}
      overflow="hidden"
    >
      <input
        type="file"
        ref={fileRef}
        onChange={onImportImageSelect}
        style={{ display: "none" }}
        accept="image/*"
      />

      {activeUtilityButton === UTILITY_BUTTONS.COLOR_PICKER && (
        <ColorPicker color={color} onChange={setColor} />
      )}

      <Stage
        height={dimensions.height}
        width={dimensions.width}
        ref={stageRef}
        onMouseUp={onStageMouseUp}
        onMouseDown={onStageMouseDown}
        onMouseMove={onStageMouseMove}
      >
        <Layer>
          <KonvaRect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="white"
            listening={false}
          />
          <KonvaRect
            x={0}
            y={0}
            height={SIZE}
            width={SIZE}
            fill="white"
            id="bg"
            onClick={onBgClick}
          />
          {arrows.map((arrow) => (
            <KonvaArrow
              key={arrow.id}
              id={arrow.id}
              points={arrow.points}
              fill={arrow.color}
              stroke={arrow.color}
              strokeWidth={4}
              onClick={onShapeClick}
            />
          ))}
          {rectangles.map((rectangle) => (
            <KonvaRect
              key={rectangle.id}
              x={rectangle?.x}
              y={rectangle?.y}
              height={rectangle?.height}
              width={rectangle?.width}
              stroke={rectangle?.color}
              id={rectangle?.id}
              strokeWidth={4}
              onClick={onShapeClick}
            />
          ))}
          {triangles.map(({ id, x, y, width, height, color }) => (
            <KonvaShape
              key={id}
              sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - width / 2, y + height);
                ctx.lineTo(x + width / 2, y + height);
                ctx.closePath();
                ctx.fillStrokeShape(shape);
              }}
              stroke={color}
              strokeWidth={4}
            />
          ))}
          {circles.map(({ id, x, y, radius, color }) => (
            <KonvaCircle
              key={id}
              id={id}
              x={x}
              y={y}
              radius={radius}
              stroke={color}
              strokeWidth={4}
              onClick={onShapeClick}
            />
          ))}
          {lines.map(({ id, color, points, tool }) => (
            <KonvaLine
              key={id}
              id={id}
              lineCap="round"
              lineJoin="round"
              stroke={color}
              strokeWidth={tool === UTILITY_BUTTONS.ERASE ? 30 : 4}
              points={points}
              onClick={onShapeClick}
              globalCompositeOperation={
                tool === UTILITY_BUTTONS.ERASE
                  ? "destination-out"
                  : "source-over"
              }
            />
          ))}
          <Transformer ref={transformerRef} />
        </Layer>
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              x={0}
              y={0}
              height={SIZE / 2}
              width={SIZE / 2}
              draggable={isDraggable}
            />
          )}
        </Layer>
      </Stage>
    </Box>
  );
}
