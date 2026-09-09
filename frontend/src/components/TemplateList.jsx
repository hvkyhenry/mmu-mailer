export default function TemplateList({ templates, onLoad, onDelete }) {
  if (!templates.length) {
    return (
      <div className="saved-templates">
        <div className="section-title" style={{ color: "var(--muted)" }}>
          Saved templates
        </div>
        <p style={{ color: "var(--muted)", fontSize: 13 }}>
          No templates saved yet. Save one above to reuse it for the next welcome
          batch, reminder, or event announcement.
        </p>
      </div>
    );
  }

  return (
    <div className="saved-templates">
      <div className="section-title" style={{ color: "var(--muted)" }}>
        Saved templates
      </div>
      {templates.map((t) => (
        <div className="saved-template-item" key={t.id}>
          <div>
            <div className="name">{t.name}</div>
            <div className="subject">{t.subject}</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="link-btn" onClick={() => onLoad(t)}>
              Load
            </button>
            <button className="link-btn danger" onClick={() => onDelete(t.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
