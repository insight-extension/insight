// import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

const TextBlock = ({ className, children, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect for automatic scrolling down
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [children]); // Triggered when the content of children changes

  const baseClasses =
    "p-3 rounded-lg overflow-y-auto max-h-44 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300";

  return (
    <div ref={containerRef} className={cn(baseClasses, className)} {...props}>
      {children}
    </div>
  );
};

TextBlock.displayName = "TextBlock";

export { TextBlock };
