"use client"

import * as React from "react"
import { DirectionProvider as DirectionProviderPrimitive } from "@radix-ui/react-direction"

function DirectionProvider({
  dir,
  direction,
  children,
}: React.ComponentProps<typeof DirectionProviderPrimitive> & {
  direction?: React.ComponentProps<typeof DirectionProviderPrimitive>["dir"]
}) {
  return (
    <DirectionProviderPrimitive dir={dir || direction}>
      {children}
    </DirectionProviderPrimitive>
  )
}

import { useDirection as useDirectionPrimitive } from "@radix-ui/react-direction"
const useDirection = useDirectionPrimitive

export { DirectionProvider, useDirection }
