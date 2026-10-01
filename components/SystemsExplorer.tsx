"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { SystemDiagram } from "@/components/SystemDiagram";
import { systems } from "@/lib/config/systems";

export type ExplorerProject = { slug: string; title: string; status: "in-use" | "ongoing" };
export function SystemsExplorer({ projects }: { projects: ExplorerProject[] }) {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const available = projects.flatMap((project) => {
    const system = systems[project.slug];
    return system ? [{ ...project, system }] : [];
  });
  const project = available[selected] ?? available[0];
  if (!project) return null;
  const system = project.system;
  return (
    <section className="systems-explorer" aria-label="Explore my systems">
      <div className="explorer-topline">
        <span>
          <span className="status-dot" /> On the workbench
        </span>
        <span>INSPECT / 0{available.length}</span>
      </div>
      <div className="systems-controls" role="group" aria-label="Choose a project">
        {available.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={index === selected}
            aria-controls={panelId}
            onClick={() => setSelected(index)}
          >
            {item.system.shortName}
          </button>
        ))}
      </div>
      <div id={panelId}>
        <div className="explorer-heading">
          <div>
            <p className="eyebrow">
              {project.status === "ongoing" ? "In development" : "In production"}
            </p>
            <h2>{project.title}</h2>
          </div>
          <span className="explorer-symbol" aria-hidden="true">
            [↗]
          </span>
        </div>
        <p className="explorer-question">{system.question}</p>
        <SystemDiagram key={project.slug} system={system} />
        <div className="explorer-bottom">
          <span>Select a component to look inside</span>
          <Link href={`/projects/${project.slug}`}>
            Explore project <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
