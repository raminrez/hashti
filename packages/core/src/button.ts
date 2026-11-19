import { definePrimitive } from "@ui-sdk/core"

type ButtonOptions = {
  variant?: "solid" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const button = definePrimitive({
  name: "button",
  options: { variant: "string", size: "string" },
  state: (options: ButtonOptions) => ({
    variant: options.variant ?? "solid",
    size: options.size ?? "md",
  }),
  sync: (options: ButtonOptions) => ({
    variant: options.variant ?? "solid",
    size: options.size ?? "md",
  }),
  slots: (slot) => ({
    root: slot({
      attrs: (state) => ({
        type: "button",
        "data-variant": state.variant,
        "data-size": state.size,
      }),
    }),
  }),
})

export { button, type ButtonOptions }
