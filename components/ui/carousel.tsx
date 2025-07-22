"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselT = UseEmblaCarouselType[0]
type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>[0]
type CarouselOptions = UseCarouselParameters["options"]
type CarouselPlugin = UseCarouselParameters["plugins"]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
} & React.ComponentPropsWithoutRef<"div">

const CarouselContext = React.createContext<
  { emblaApi: CarouselApi } & {
    canScrollPrev: boolean
    canScrollNext: boolean
    scrollPrev: () => void
    scrollNext: () => void
    selectedSnap: number
    snapCount: number
  }
>(null!)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, plugins, orientation = "horizontal", setApi, className, children, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins,
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedSnap, setSelectedSnap] = React.useState(0)
    const [snapCount, setSnapCount] = React.useState(0)

    const scrollPrev = React.useCallback(() => {
      emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = React.useCallback(() => {
      emblaApi?.scrollNext()
    }, [emblaApi])

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
      setSelectedSnap(emblaApi.selectedScrollSnap())
    }, [])

    const onInit = React.useCallback((emblaApi: CarouselApi) => {
      setSnapCount(emblaApi.scrollSnapList().length)
    }, [])

    React.useEffect(() => {
      if (!emblaApi) {
        return
      }

      setApi?.(emblaApi)
      onInit(emblaApi)
      onSelect(emblaApi)
      emblaApi.on("reInit", onInit)
      emblaApi.on("reInit", onSelect)
      emblaApi.on("select", onSelect)
    }, [emblaApi, onInit, onSelect, setApi])

    return (
      <CarouselContext.Provider
        value={{
          emblaApi,
          canScrollPrev,
          canScrollNext,
          scrollPrev,
          scrollNext,
          selectedSnap,
          snapCount,
        }}
      >
        <div ref={ref} className={cn("relative", className)} role="region" aria-roledescription="carousel" {...props}>
          <div ref={emblaRef} className="overflow-hidden">
            <div className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col")}>{children}</div>
          </div>
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
      {...props}
    />
  ),
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { canScrollPrev, scrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("absolute h-8 w-8 rounded-full", "left-0 top-1/2 -translate-y-1/2", className)}
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        {...props}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    )
  },
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof Button>>(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { canScrollNext, scrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("absolute h-8 w-8 rounded-full", "right-0 top-1/2 -translate-y-1/2", className)}
        onClick={scrollNext}
        disabled={!canScrollNext}
        {...props}
      >
        <ArrowRightIcon className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    )
  },
)
CarouselNext.displayName = "CarouselNext"

const CarouselPagination = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { snapCount, selectedSnap, scrollNext, emblaApi } = useCarousel()

    const handleDotClick = React.useCallback(
      (index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
      },
      [emblaApi],
    )

    return (
      <div ref={ref} className={cn("flex justify-center gap-2", className)} {...props}>
        {Array.from({ length: snapCount }).map((_, index) => (
          <Button
            key={index}
            className={cn("h-2 w-2 rounded-full p-0", index === selectedSnap ? "bg-primary" : "bg-muted")}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  },
)
CarouselPagination.displayName = "CarouselPagination"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselPagination }
