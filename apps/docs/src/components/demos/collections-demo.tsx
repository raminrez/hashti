import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  TableBatchActions,
  Pagination,
  ListBox,
  ListBoxItem,
  GridList,
  GridListItem,
  StructuredList,
  StructuredListRow,
} from "@hashti/react";

const ARCH_ITEMS = [
  {
    id: "1",
    element: "Darvazeh",
    role: "Portal Threshold",
    material: "Baked Brick & Stucco",
    status: "Active",
  },
  {
    id: "2",
    element: "Hashti",
    role: "Octagonal Vestibule",
    material: "Masonry & Zenithal Dome",
    status: "Active",
  },
  {
    id: "3",
    element: "Dalan",
    role: "Indirect Corridor",
    material: "Clay Plaster",
    status: "Active",
  },
  {
    id: "4",
    element: "Hayati",
    role: "Courtyard Garden",
    material: "Turquoise Basin",
    status: "Operational",
  },
];

export function TableLiveDemo() {
  return (
    <div className="w-full max-w-xl overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <Table aria-label="Architectural Components Table" selectionMode="multiple">
        <TableHeader>
          <Column isRowHeader>Element</Column>
          <Column>Role</Column>
          <Column>Material</Column>
          <Column>Status</Column>
        </TableHeader>
        <TableBody items={ARCH_ITEMS}>
          {(item) => (
            <Row key={item.id}>
              <Cell>{item.element}</Cell>
              <Cell>{item.role}</Cell>
              <Cell>{item.material}</Cell>
              <Cell>{item.status}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableBatchActionsLiveDemo() {
  const [selectedCount, setSelectedCount] = useState(2);
  return (
    <div className="w-full max-w-xl">
      <TableBatchActions
        selectedCount={selectedCount}
        onClearSelection={() => setSelectedCount(0)}
        actions={[
          { key: "export", label: "Export Telemetry", onAction: () => alert("Exported") },
          {
            key: "lock",
            label: "Lock Thresholds",
            onAction: () => alert("Locked"),
            tone: "danger",
          },
        ]}
      />
      <div className="p-4 text-xs text-neutral-500 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl mt-2">
        Batch actions toolbar active with {selectedCount} items selected
      </div>
    </div>
  );
}

export function PaginationLiveDemo() {
  const [page, setPage] = useState(2);
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
      <span className="text-xs text-neutral-500 font-mono">Viewing page {page} of 8</span>
    </div>
  );
}

export function ListBoxLiveDemo() {
  const [selected, setSelected] = useState<any>(new Set(["hashti"]));
  return (
    <div className="w-full max-w-xs p-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
      <ListBox
        aria-label="Architectural Stages ListBox"
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <ListBoxItem id="darvazeh">Darvazeh Portal</ListBoxItem>
        <ListBoxItem id="hashti">Hashti Vestibule</ListBoxItem>
        <ListBoxItem id="dalan">Dalan Corridor</ListBoxItem>
        <ListBoxItem id="hayati">Hayati Courtyard</ListBoxItem>
      </ListBox>
    </div>
  );
}

export function GridListLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <GridList aria-label="Architectural GridList" selectionMode="multiple">
        <GridListItem id="g1">01 Darvazeh Entrance Arch</GridListItem>
        <GridListItem id="g2">02 Hashti Octagonal Chamber</GridListItem>
        <GridListItem id="g3">03 Dalan Bent Corridor</GridListItem>
        <GridListItem id="g4">04 Hayati Sunken Courtyard</GridListItem>
      </GridList>
    </div>
  );
}

export function StructuredListLiveDemo() {
  return (
    <div className="w-full max-w-md">
      <StructuredList>
        <StructuredListRow isHeader>
          <span>Parameter</span>
          <span>Specification</span>
        </StructuredListRow>
        <StructuredListRow>
          <span className="font-medium text-neutral-900 dark:text-white">Arch Apex Pitch</span>
          <span className="font-mono text-xs text-neutral-500">32° Tangent</span>
        </StructuredListRow>
        <StructuredListRow>
          <span className="font-medium text-neutral-900 dark:text-white">Touch Ergonomics</span>
          <span className="font-mono text-xs text-neutral-500">44px Height</span>
        </StructuredListRow>
        <StructuredListRow>
          <span className="font-medium text-neutral-900 dark:text-white">Accent Glaze</span>
          <span className="font-mono text-xs text-[var(--hashti-focus)]">#365CCB (Focus blue)</span>
        </StructuredListRow>
      </StructuredList>
    </div>
  );
}
