"use client"

import {
  Tree,
  TreeGroup,
  TreeItem,
  TreeItemIndicator,
  TreeItemLabel,
} from "@hashti/react"

export function TreeDemo() {
  return (
    <Tree
      aria-label="Project files"
      defaultExpanded={["src"]}
      defaultValue="src/index.ts"
      style={{ maxWidth: 280 }}
    >
      <TreeItem value="src">
        <TreeItemLabel>
          <TreeItemIndicator />
          src
        </TreeItemLabel>
        <TreeGroup>
          <TreeItem value="src/index.ts">
            <TreeItemLabel>index.ts</TreeItemLabel>
          </TreeItem>
          <TreeItem value="src/app.tsx">
            <TreeItemLabel>app.tsx</TreeItemLabel>
          </TreeItem>
        </TreeGroup>
      </TreeItem>
      <TreeItem value="package.json">
        <TreeItemLabel>package.json</TreeItemLabel>
      </TreeItem>
    </Tree>
  )
}
