import { DependencyList, useLayoutEffect } from "react";
import { MotionValue, useMotionValue } from "framer-motion";

/**
 * Creates a `MotionValue` that recomputes if one of the `deps` changed.
 * It is comparable to `useMemo`.
 *
 * @param factory Function that returns a new value.
 * @param deps List of dependencies the hook should listen to.
 */
export default function useMotionValueFactory<T>(
  factory: () => T,
  deps: DependencyList
): MotionValue<T> {
  const value = useMotionValue<T>(null);

  useLayoutEffect(() => {
    const listener = () => value.set(factory());
    const motionValues: (() => void)[] = [];
    listener();

    deps.forEach(
      dep => dep instanceof MotionValue && motionValues.push(dep.onChange(listener))
    );
    return () => motionValues.forEach(mv => mv());
  }, [value, factory, deps]);

  return value;
}
