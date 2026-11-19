import { definePrimitive } from "@ui-sdk/core"

type SwitchOptions = {
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const hashtiSwitch = definePrimitive({
  name: "switch",
  options: { defaultChecked: "boolean", onCheckedChange: "callback" },
  state: (options: SwitchOptions) => ({
    checked: options.defaultChecked ?? false,
  }),
  api: (context) => ({
    toggle: () => {
      const checked = !context.store.get().checked
      context.store.set({ checked })
      context.options().onCheckedChange?.(checked)
    },
  }),
  slots: (slot) => ({
    root: slot({
      role: "switch",
      focus: "native",
      press: ({ api }) => api.toggle(),
      attrs: (state) => ({
        type: "button",
        "aria-checked": String(state.checked),
        "data-checked": state.checked ? "" : undefined,
      }),
    }),
  }),
})

export { hashtiSwitch, type SwitchOptions }
