export function WritingEmptyState() {
  return (
    <div className="writing-empty">
      <span className="printing-mark" aria-hidden="true">
        [ ]
      </span>
      <div>
        <h3>The next page is still unwritten.</h3>
        <p>
          Notes on software, security, and the things I can’t stop thinking about. Coming when
          there’s something worth saying.
        </p>
        <span className="eyebrow empty-status">Essays &amp; field notes · Coming soon</span>
      </div>
    </div>
  );
}
