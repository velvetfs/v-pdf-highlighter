import React, { useEffect, useRef } from "react";

type MouseMonitorProps = {
  onMoveAway: () => void;
  paddingX: number;
  paddingY: number;
  children: JSX.Element;
};

export const MouseMonitor = (props: MouseMonitorProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { onMoveAway, paddingX, paddingY, children, ...restProps } = props;

  const onMouseMove = (event: MouseEvent) => {
    if (!container) return;

    let current = container.current;

    if (!current) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = current.getBoundingClientRect();
    const inBoundsX =
      clientX > left - paddingX && clientX < left + width + paddingX;
    const inBoundsY =
      clientY > top - paddingY && clientY < top + height + paddingY;
    const isNear = inBoundsX && inBoundsY;

    if (!isNear) {
      onMoveAway();
    }
  };

  useEffect(() => {
    if (!container.current) return;
    let current = container.current;
    const { ownerDocument: doc } = current;
    doc.addEventListener("mousemove", onMouseMove);
    return () => {
      doc.removeEventListener("mousemove", onMouseMove);
    };
  }, [container]);

  return <div ref={container}>{React.cloneElement(children, restProps)}</div>;
};
