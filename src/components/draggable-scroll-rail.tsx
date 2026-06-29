"use client";

import { type PointerEvent, type ReactNode, useRef, useState } from "react";

type DraggableScrollRailProps = {
  "aria-label"?: string;
  children: ReactNode;
  className: string;
};

export function DraggableScrollRail({ "aria-label": ariaLabel, children, className }: DraggableScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ pointerId: -1, startX: 0, scrollLeft: 0 });
  const suppressClickRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail || event.button !== 0) {
      return;
    }

    const target = event.target;
    if (target instanceof Element && target.closest("a, button, input, select, textarea, summary")) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: rail.scrollLeft
    };
    suppressClickRef.current = false;
    setIsDragging(true);
    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    const drag = dragStateRef.current;
    if (!rail || !isDragging || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) > 5) {
      suppressClickRef.current = true;
    }
    rail.scrollLeft = drag.scrollLeft - deltaX;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current.pointerId = -1;
    setIsDragging(false);
  }

  return (
    <div
      aria-label={ariaLabel}
      className={`${className}${isDragging ? " is-dragging" : ""}`}
      onClickCapture={(event) => {
        if (suppressClickRef.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClickRef.current = false;
        }
      }}
      onPointerCancel={endDrag}
      onPointerDown={handlePointerDown}
      onPointerLeave={endDrag}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      ref={railRef}
    >
      {children}
    </div>
  );
}
