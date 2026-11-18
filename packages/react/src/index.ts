"use client";

// Component re-exports (HeroUI v3 modular architecture)
export * from "./components/autocomplete";
export * from "./components/avatar";
export * from "./components/badge";
export * from "./components/breadcrumbs";
export * from "./components/button";
export * from "./components/card";
export * from "./components/checkbox";
export * from "./components/code-snippet";
export * from "./components/color";
export * from "./components/combobox";
export * from "./components/command";
export * from "./components/date-picker";
export * from "./components/dialog";
export * from "./components/accordion";
export * from "./components/drawer";
export * from "./components/dropzone";
export * from "./components/empty-state";
export * from "./components/field";
export * from "./components/grid-list";
export * from "./components/input-otp";
export * from "./components/kbd";
export * from "./components/layout";
export * from "./components/link";
export * from "./components/listbox";
export * from "./components/meter";
export * from "./components/navigation-tree";
export * from "./components/number-field";
export * from "./components/pagination";
export * from "./components/popover";
export * from "./components/progress";
export * from "./components/radio";
export * from "./components/search-field";
export * from "./components/segmented-control";
export * from "./components/select";
export * from "./components/separator";
export * from "./components/slider";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/tag";
export * from "./components/text-field";
export * from "./components/theme";
export * from "./components/time-field";
export * from "./components/toast";
export * from "./components/toggle";
export * from "./components/token-input";
export * from "./components/toolbar";
export * from "./components/tooltip";
export * from "./components/tree";

// Foundational utilities
export { Theme, Layer, useTheme, useOverlayTheme } from "./theme";
export type { ThemeProps, LayerProps } from "./theme";
export { Icon } from "./icons";
export type { IconName, IconProps } from "./icons";
export { cx, classes } from "./utils";
export type { ControlSize } from "./utils";
export type { ThemeName, LayerLevel } from "@hashti/styles/tokens";

// Compositional RAC parts: their types, slots, refs and collection behavior
export {
  Form,
  Label,
  Text,
  FieldError,
  Group,
  Heading,
  Keyboard,
  DialogTrigger,
  MenuTrigger,
  SubmenuTrigger,
  Menu,
  MenuItem,
  MenuSection,
  Header as SectionHeader,

  TableHeader,
  TableBody,
  TableFooter,
  Row,
  Cell,
  ColumnResizer,
  ResizableTableContainer,
  TreeSection,
  CalendarGrid,
  CalendarCell,
  SliderTrack,
  SliderThumb,
  SliderFill,
  SliderOutput,
  Collection,
  VisuallyHidden,
  useListData,
  useAsyncList,
  useDragAndDrop,
  I18nProvider,
  RouterProvider,
} from "react-aria-components";
export type {
  Key,
  Selection,
  SortDescriptor,
  SortDirection,
  DateValue,
  TimeValue,
  DateRange,
  FormProps,
  MenuProps,
  MenuItemProps,
  TableHeaderProps,
  TableBodyProps,
  RowProps,
  CellProps,
  ValidationResult,
} from "react-aria-components";
