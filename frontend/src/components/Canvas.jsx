export default function Canvas({
  templateName,
  setTemplateName,
  subject,
  setSubject,
  body,
  setBody,
  columns,
  preview,
  sampleRow,
}) {
  const insertVar = (col) => {
    setBody((b) => `${b}{{${col}}}`);
  };

  return (
    <>
      <div className="template-name-row">
        <div style={{ flex: 1 }}>
          <span className="field-label">Template name (for saving/reuse)</span>
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g. welcome-paid-2026"
          />
        </div>
      </div>

      <span className="field-label">Subject</span>
      <input
        className="subject-input"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Welcome to the club, {{first_name}}!"
      />

      <span className="field-label">Message</span>
      <div className="canvas-shell">
        <div className="var-bar">
          {columns.length === 0 && (
            <span style={{ color: "var(--muted)", fontSize: 12 }}>
              Load recipients first to see available variables
            </span>
          )}
          {columns.map((c) => (
            <button key={c} className="var-chip" onClick={() => insertVar(c)}>
              {`{{${c}}}`}
            </button>
          ))}
        </div>
        <textarea
          className="body-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Hi {{first_name}}, welcome to MMU Tech Community..."
        />
      </div>

      {preview && (
        <div className="preview-panel">
          <div className="field-label" style={{ marginBottom: 10 }}>
            Preview — as {sampleRow?.first_name || sampleRow?.email || "sample recipient"} will see it
          </div>
          <div className="preview-subject">{preview.subject}</div>
          <div className="preview-body">{preview.body}</div>
        </div>
      )}
    </>
  );
}
