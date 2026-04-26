export interface UiNode {
  id: string;
  name: string;
  type: "component" | "module" | "feature" | "task" | "decision";
  description: string;
  children?: UiNode[];
  metadata: Record<string, string | number | boolean>;
}

export interface UiProps {
  view: "tree" | "graph" | "matrix";
  root: UiNode;
  tree_id: string;
  locale: "en" | "fr";
}
