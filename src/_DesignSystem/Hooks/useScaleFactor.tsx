import { useMemo } from "react";

/**
 * Determines whether an element fits inside of specific constraints and returns a factor
 * that can be used to scale down the element in question if needed.
 *
 * @param width Original width of the element in question
 * @param height Original height of the element in question
 * @param constraintsX Width of the boundary the element in question should align to
 * @param constraintsY Height of the boundary the element in question should align to
 * @returns A factor that tells by how much the element in question needs to scale-down.
 */
export const getScaleFactorByConstraints = (
  width: number,
  height: number,
  constraintsX: number,
  constraintsY: number
) => {
  let newScaleFactor = 1;
  const aspectRatio = width / height;
  const adjustedConstraintsX = constraintsX;

  if (width - adjustedConstraintsX > 0 || height - constraintsY > 0) {
    if (constraintsY * aspectRatio <= adjustedConstraintsX) {
      const adaptedWidth = width * (constraintsY / height);
      newScaleFactor = adaptedWidth / width;
    } else {
      const adaptedHeight = height * (adjustedConstraintsX / width);
      newScaleFactor = adaptedHeight / height;
    }
  }

  return newScaleFactor;
};

/**
 * Hookified version of getScaleFactorByConstraints.
 *
 * Determines whether an element fits inside of specific constraints and returns a factor
 * that can be used to scale down the element in question if needed.
 *
 * @param width Original width of the element in question
 * @param height Original height of the element in question
 * @param constraintsX Width of the boundary the element in question should align to
 * @param constraintsY Height of the boundary the element in question should align to
 * @returns A factor that tells by how much the element in question needs to scale-down.
 */
export const useScaleFactor = (
  width: number,
  height: number,
  constraintsX: number,
  constraintsY: number
): number => {
  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof constraintsX !== "number" ||
    typeof constraintsY !== "number"
  ) {
    throw new Error(
      'Hook "useScaleFactor" requires four arguments: width, height, constraintsX, constraintsY'
    );
  }

  return useMemo(
    () => getScaleFactorByConstraints(width, height, constraintsX, constraintsY),
    [width, height, constraintsX, constraintsY]
  );
};
