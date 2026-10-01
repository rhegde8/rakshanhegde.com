import { systems } from "@/lib/config/systems";
export function ProjectFigure({ kind }: { kind: string }) {
  const system = systems[kind];
  if (!system) return null;
  return (
    <div className={`project-figure project-figure-${kind}`} aria-hidden="true">
      <span className="figure-caption">{system.annotation}</span>
      <div className="mini-system">
        {system.nodes.map((node, index) => (
          <div className="mini-node" key={node.id}>
            <span className="mini-node-number">0{index + 1}</span>
            <span>{node.label}</span>
          </div>
        ))}
      </div>
      <span className="figure-cross figure-cross-start">+</span>
      <span className="figure-cross figure-cross-end">+</span>
    </div>
  );
}
