export function ScientificFigure() {
  return (
    <figure className="scientific-figure">
      <svg viewBox="0 0 500 430" fill="none" aria-hidden="true">
        <defs>
          <pattern
            id="engraving"
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-35)"
          >
            <path d="M 0 0 V 5" stroke="currentColor" strokeWidth="0.65" opacity="0.3" />
          </pattern>
        </defs>
        <g stroke="currentColor" strokeWidth="0.8">
          <path d="M250 25V373M68 200H432" strokeDasharray="2 7" opacity="0.38" />
          <circle cx="250" cy="200" r="160" strokeDasharray="1 5" opacity="0.35" />
          {Array.from({ length: 60 }, (_, i) => (
            <path
              key={i}
              d={`M250 35V${i % 5 === 0 ? 44 : 39}`}
              transform={`rotate(${i * 6} 250 200)`}
              opacity="0.6"
            />
          ))}
          <g transform="rotate(-24 250 200)">
            <circle cx="250" cy="200" r="99" fill="url(#engraving)" />
            <ellipse cx="250" cy="200" rx="72" ry="99" />
            <ellipse cx="250" cy="200" rx="39" ry="99" />
            <path d="M250 101V299M151 200H349" />
            <ellipse cx="250" cy="200" rx="99" ry="32" />
            <path d="M164 150Q250 186 336 150M164 250Q250 214 336 250" />
            <ellipse cx="250" cy="200" rx="178" ry="59" strokeWidth="1.2" />
            <ellipse cx="250" cy="200" rx="184" ry="64" opacity="0.45" />
          </g>
          <ellipse
            cx="250"
            cy="200"
            rx="126"
            ry="170"
            transform="rotate(33 250 200)"
            strokeWidth="0.65"
            opacity="0.55"
          />
          <path d="M143 113L108 77H72M360 247H408L433 273M285 296L315 344H395" opacity="0.65" />
        </g>
        <g fill="var(--accent)">
          <circle cx="94" cy="261" r="7" />
          <circle cx="373" cy="93" r="3.5" />
          <circle cx="318" cy="318" r="4" />
          <path d="M390 152v16m-8-8h16" stroke="var(--accent)" />
        </g>
        <g fill="currentColor" className="figure-label">
          <text x="53" y="69">
            OBSERVE
          </text>
          <text x="408" y="292">
            QUESTION
          </text>
          <text x="320" y="361">
            UNDERSTAND
          </text>
          <text x="233" y="20">
            N
          </text>
          <text x="66" y="284">
            α
          </text>
        </g>
        <path d="M219 392H281" stroke="currentColor" strokeWidth="0.7" />
        <text x="250" y="416" textAnchor="middle" fill="currentColor" className="figure-caption">
          A STUDY IN CURIOSITY
        </text>
      </svg>
      <figcaption>
        <span>Fig. 01</span> There is always more to understand.
      </figcaption>
    </figure>
  );
}
