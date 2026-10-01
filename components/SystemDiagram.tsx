"use client";
import { useId, useState } from "react";
import type { SystemDefinition } from "@/lib/config/systems";

export function SystemDiagram({ system }: { system: SystemDefinition }) {
  const [selected, setSelected] = useState(1);
  const descriptionId = useId();
  const node = system.nodes[selected] ?? system.nodes[0];
  return (
    <div className="system-diagram">
      <div
        className="diagram-canvas"
        role="group"
        aria-label={`${system.shortName} system components`}
      >
        <span className="diagram-axis" aria-hidden="true">
          SYSTEM OVERVIEW
        </span>
        <svg
          className="diagram-connections"
          viewBox="0 0 600 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="diagram-guide" d="M40 150H560M300 20V280" />
          <path className="diagram-route" d="M156 66H396V150M396 150V234H156" />
          <path className="diagram-arrow" d="m392 112 4 6 4-6m-164 118-6 4 6 4" />
          <circle cx="396" cy="66" r="3" />
          <circle cx="396" cy="234" r="3" />
        </svg>
        {system.nodes.map((item, index) => (
          <button
            type="button"
            className={`diagram-node diagram-node-${index}`}
            key={item.id}
            aria-pressed={index === selected}
            aria-controls={descriptionId}
            onClick={() => setSelected(index)}
          >
            <span className="node-index" aria-hidden="true">
              0{index + 1}
            </span>
            <span>
              <strong>{item.label}</strong>
              <small>{item.caption}</small>
            </span>
            <span className="node-port" aria-hidden="true" />
          </button>
        ))}
        <span className="diagram-coordinate" aria-hidden="true">
          {system.annotation}
        </span>
      </div>
      <div className="system-inspector" id={descriptionId} aria-live="polite" aria-atomic="true">
        <span className="inspector-marker" aria-hidden="true">
          ↳
        </span>
        <div>
          <p className="inspector-label">{node.label}</p>
          <p>{node.detail}</p>
        </div>
      </div>
      <noscript>
        <style>{`.diagram-canvas, .system-inspector, .systems-controls { display: none !important; }`}</style>
        <dl className="system-fallback">
          {system.nodes.map((item) => (
            <div key={item.id}>
              <dt>{item.label}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
      </noscript>
    </div>
  );
}
