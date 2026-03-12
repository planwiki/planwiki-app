import { type ComponentPropsWithoutRef } from "react"

import Image from "next/image"

import { cn } from "@/lib/utils"

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean
  /**
   * Number of times to repeat the content
   * @default 4
   */
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around gap-(--gap)", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

const modelLogos = [
  { name: "ChatGPT", domain: "openai.com" },
  { name: "Claude", domain: "claude.ai" },
  { name: "Gemini", domain: "google.com" },
  { name: "DeepSeek", domain: "deepseek.com" },
  { name: "Mistral", domain: "mistral.ai" },
  { name: "Grok", domain: "grok.com" },
  { name: "Perplexity", domain: "perplexity.ai" },
  { name: "Meta AI", domain: "meta.ai" },
]

export function ModelMarquee() {
  return (
    <div className="relative overflow-hidden border border-zinc-950/10 bg-[#f6f1e8] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f6f1e8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f6f1e8] to-transparent" />
      <Marquee pauseOnHover className="[--duration:28s] [--gap:1.5rem] py-1">
        {modelLogos.map((model) => (
          <div
            key={model.name}
            className="flex min-w-[170px] items-center gap-4 border border-zinc-950/10 bg-white/90 px-4 py-3"
          >
            <Image
              src={`https://img.logo.dev/${model.domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_KEY}`}
              alt={model.name}
              width={112}
              height={28}
              className="h-7 w-auto object-contain"
            />
            <span className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-700">
              {model.name}
            </span>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
