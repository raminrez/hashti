import { useEffect, useRef } from "react";
import { registerSurface, type SurfaceInput } from "./registry";

export function useAgentSurface(input: SurfaceInput) {
  const initial = useRef(input);
  const handle = useRef<ReturnType<typeof registerSurface> | null>(null);

  useEffect(() => {
    handle.current = registerSurface(initial.current);
    return () => {
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    handle.current?.update(input);
  });
}