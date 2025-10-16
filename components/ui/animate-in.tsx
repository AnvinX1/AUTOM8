"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type AnimateInProps = {
  children: React.ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  delayMs?: number
  direction?: "up" | "down" | "left" | "right" | "none"
  durationMs?: number
  threshold?: number
}

export function AnimateIn({
  children,
  className,
  as = "div",
  delayMs = 0,
  direction = "up",
  durationMs = 400,
  threshold = 0.15,
}: AnimateInProps) {
  const Container = as as any
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const timeout = setTimeout(() => setVisible(true), delayMs)
            return () => clearTimeout(timeout)
          }
        }
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delayMs, threshold])

  const initialTransform =
    direction === "up"
      ? "translateY(12px)"
      : direction === "down"
        ? "translateY(-12px)"
        : direction === "left"
          ? "translateX(12px)"
          : direction === "right"
            ? "translateX(-12px)"
            : "none"

  return (
    <Container
      ref={ref as any}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initialTransform,
        transitionProperty: "opacity, transform",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Container>
  )
}


