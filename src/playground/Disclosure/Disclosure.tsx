import { useId, useState } from "react";
import type { ReactNode } from "react";
import "./Disclosure.scss";

export interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export function Disclosure({
  summary,
  children,
  defaultExpanded = false,
}: DisclosureProps) {
  const panelId = useId();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // A native <button> already provides Enter and Space activation.
  return (
    <div className="disclosure">
      <button
        type="button"
        className="disclosure-button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span className="disclosure-icon" aria-hidden="true">
          ▸
        </span>
        {summary}
      </button>
      <div id={panelId} className="disclosure-panel" hidden={!isExpanded}>
        {children}
      </div>
    </div>
  );
}
