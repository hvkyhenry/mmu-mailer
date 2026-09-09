const OPS = [
  { value: 'equals', label: 'is' },
  { value: 'not_equals', label: 'is not' },
  { value: 'contains', label: 'contains' },
  { value: 'not_empty', label: 'is not empty' },
  { value: 'empty', label: 'is empty' },
];

export default function SegmentPicker({
  columns,
  filters,
  setFilters,
  matched,
  onLoadRecipients,
  loading,
  emailColumn,
  setEmailColumn,
}) {
  const addFilter = () =>
    setFilters([
      ...filters,
      { column: columns[0] || '', op: 'equals', value: '' },
    ]);

  const updateFilter = (i, patch) =>
    setFilters(filters.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));

  const removeFilter = i => setFilters(filters.filter((_, idx) => idx !== i));

  return (
    <>
      <div>
        <div className="section-title">Email column</div>
        <select
          value={emailColumn}
          onChange={e => setEmailColumn(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--ink-soft)',
            border: '1px solid var(--line-dark)',
            color: 'var(--text-on-ink)',
            borderRadius: 4,
            padding: '7px 8px',
            marginBottom: 4,
          }}
        >
          {columns.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <p
          style={{
            fontSize: 11,
            color: 'var(--muted-on-ink)',
            margin: '4px 0 0',
          }}
        >
          Which sheet column holds the address to send to.
        </p>
      </div>

      <div>
        <div className="section-title">Segment</div>
        {filters.map((f, i) => (
          <div key={i} className="filter-row">
            <select
              value={f.column}
              onChange={e => updateFilter(i, { column: e.target.value })}
            >
              {columns.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={f.op}
              onChange={e => updateFilter(i, { op: e.target.value })}
            >
              {OPS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {!['not_empty', 'empty'].includes(f.op) && (
              <input
                className="value"
                placeholder="value"
                value={f.value}
                onChange={e => updateFilter(i, { value: e.target.value })}
              />
            )}
            <button className="filter-remove" onClick={() => removeFilter(i)}>
              remove filter
            </button>
          </div>
        ))}
        <button
          className="btn btn-ghost"
          onClick={addFilter}
          style={{ marginTop: 4 }}
        >
          + Add filter
        </button>
      </div>

      <button
        className="btn btn-amber"
        onClick={onLoadRecipients}
        disabled={loading}
      >
        {loading ? 'Loading…' : 'Load matching recipients'}
      </button>

      {matched && (
        <div>
          <div className="recipient-count">
            {matched.count}
            <small>
              {matched.count === 1 ? 'recipient matched' : 'recipients matched'}
            </small>
          </div>
          <div className="recipient-chip-list">
            {matched.rows.slice(0, 40).map((r, i) => (
              <span className="chip" key={i}>
                {r[emailColumn] || '(no email)'}
              </span>
            ))}
            {matched.rows.length > 40 && (
              <span className="chip">+{matched.rows.length - 40} more</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
