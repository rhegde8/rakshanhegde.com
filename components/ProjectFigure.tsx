type ProjectFigureProps = { kind: string };
export function ProjectFigure({ kind }: ProjectFigureProps) {
  return (
    <svg className="project-figure" viewBox="0 0 360 180" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.9">
        {kind === "vultrack" ? (
          <>
            {[25, 43, 61, 79].map((r) => (
              <circle key={r} cx="180" cy="90" r={r} opacity={r === 79 ? 0.25 : 0.6} />
            ))}
            <path
              d="M87 90H273M180 5V175M124 34L236 146M124 146L236 34"
              strokeDasharray="2 5"
              opacity="0.4"
            />
            <path
              d="M180 90L235 35A78 78 0 0 1 257 103Z"
              fill="currentColor"
              opacity="0.09"
              stroke="none"
            />
            <circle cx="214" cy="59" r="4" fill="var(--accent)" stroke="none" />
            <circle cx="160" cy="104" r="3" fill="currentColor" />
            <circle cx="230" cy="126" r="3" fill="currentColor" />
            <path d="M70 140H119M241 42H297" />
            <text x="47" y="156">
              DETECT
            </text>
            <text x="260" y="33">
              PRIORITIZE
            </text>
          </>
        ) : kind === "threatnet" ? (
          <>
            {Array.from({ length: 8 }, (_, i) => {
              const y = 22 + i * 19;
              return (
                <g key={i}>
                  <circle cx="61" cy={y} r="3" />
                  <path d={`M64 ${y}C125 ${y} 111 90 176 90`} opacity="0.6" />
                </g>
              );
            })}
            <circle cx="185" cy="90" r="9" fill="var(--paper)" />
            <circle cx="185" cy="90" r="27" strokeDasharray="2 4" opacity="0.5" />
            <path d="M194 90H267M259 86L267 90L259 94" />
            <circle cx="280" cy="90" r="10" fill="var(--accent)" stroke="none" />
            <text x="40" y="178">
              SIGNALS
            </text>
            <text x="251" y="122">
              INTELLIGENCE
            </text>
          </>
        ) : (
          <>
            <rect x="112" y="49" width="137" height="104" strokeDasharray="3 4" opacity="0.5" />
            <path d="M180 31V58M147 98H213M180 115V136" />
            <path d="M180 60L135 83M180 60L225 83M135 112L180 135L225 112" />
            <circle cx="180" cy="23" r="9" fill="var(--accent)" stroke="none" />
            <circle cx="135" cy="98" r="14" fill="var(--paper)" />
            <circle cx="225" cy="98" r="14" fill="var(--paper)" />
            <text x="112" y="178">
              ISOLATE · BUILD · REVIEW
            </text>
            <text x="200" y="26">
              HUMAN APPROVAL
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
