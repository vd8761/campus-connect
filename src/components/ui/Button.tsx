import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    
    let baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-purple disabled:pointer-events-none disabled:opacity-50"
    
    let variants = {
      default: "bg-brand-navy text-white hover:bg-brand-navy/90 shadow",
      outline: "border border-brand-border bg-white hover:bg-brand-light text-brand-navy",
      ghost: "hover:bg-brand-light hover:text-brand-navy text-brand-muted",
      link: "text-brand-purple underline-offset-4 hover:underline",
      gradient: "bg-[image:var(--primary-gradient)] text-white shadow hover:opacity-90"
    }

    let sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8",
      icon: "h-9 w-9",
    }

    const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
