import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    indicatorStyle?: React.CSSProperties;
    vertical?: boolean;
  }
>(({ className, value, indicatorClassName, indicatorStyle, vertical = false, ...props }, ref) => {
  const percent = Math.max(0, Math.min(100, value || 0));
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        vertical
          ? "relative w-2 h-full overflow-hidden rounded-full bg-secondary"
          : "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          vertical
            ? "absolute left-0 bottom-0 w-full transition-all"
            : "h-full w-full flex-1 transition-all",
          "bg-primary",
          indicatorClassName
        )}
        style={
          vertical
            ? {
                height: `${percent}%`,
                ...indicatorStyle,
              }
            :
              indicatorStyle ?? { transform: `translateX(-${100 - percent}%)` }
        }
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }