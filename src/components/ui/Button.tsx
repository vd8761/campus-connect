import * as React from "react"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 active:scale-[0.98] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-purple disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-brand-navy text-white hover:bg-brand-navy/90 shadow",
      outline: "border border-brand-border bg-white hover:bg-brand-light text-brand-navy",
      ghost: "hover:bg-brand-light hover:text-brand-navy text-brand-muted",
      link: "text-brand-purple underline-offset-4 hover:underline",
      gradient: "bg-[image:var(--primary-gradient)] text-white shadow hover:opacity-90"
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8",
      icon: "h-9 w-9",
    }

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${isLoading ? 'cursor-not-allowed opacity-80' : ''} ${className}`

    return (
      <button
        className={combinedClassName}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin shrink-0" />
            <span>{loadingText || children}</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
