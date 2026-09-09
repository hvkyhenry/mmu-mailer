import { useEffect, useState } from 'react';
import { api } from './api';
import SegmentPicker from './components/SegmentPicker';
import Canvas from './components/Canvas';
import TemplateList from './components/TemplateList';
import SendLogTable from './components/SendLogTable';

export default function App() {
  const [health, setHealth] = useState(null);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState([
    { column: 'status', op: 'equals', value: 'pending' },
  ]);
  const [matched, setMatched] = useState(null);
  const [loadingRecipients, setLoadingRecipients] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState(null);

  const [campaignName, setCampaignName] = useState('');
  const [templates, setTemplates] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [emailColumn, setEmailColumn] = useState('email');

  useEffect(() => {
    api
      .health()
      .then(setHealth)
      .catch(() => {});
    api
      .columns()
      .then(r => {
        setColumns(r.columns);
        const guess = r.columns.find(c => c.toLowerCase().includes('email'));
        if (guess) setEmailColumn(guess);
      })
      .catch(() => {});
    refreshTemplates();
    refreshLogs();
  }, []);

  const refreshTemplates = () =>
    api
      .listTemplates()
      .then(setTemplates)
      .catch(() => {});
  const refreshLogs = () =>
    api
      .logs()
      .then(setLogs)
      .catch(() => {});

  const loadRecipients = async () => {
    setLoadingRecipients(true);
    try {
      const result = await api.segment(filters);
      setMatched(result);
    } finally {
      setLoadingRecipients(false);
    }
  };

  const runPreview = async () => {
    const sample = matched?.rows?.[0] || {};
    const result = await api.preview(subject, body, sample);
    setPreview(result);
  };

  const saveTemplate = async () => {
    if (!templateName.trim()) return alert('Give the template a name first.');
    await api.saveTemplate({ name: templateName, subject, body });
    refreshTemplates();
  };

  const loadTemplate = t => {
    setTemplateName(t.name);
    setSubject(t.subject);
    setBody(t.body);
    setPreview(null);
  };

  const deleteTemplate = async id => {
    await api.deleteTemplate(id);
    refreshTemplates();
  };

  const send = async () => {
    if (!campaignName.trim())
      return alert(
        'Give this send a campaign name (used to avoid duplicate sends).',
      );
    if (!matched) return alert('Load matching recipients first.');
    setSending(true);
    setSendResult(null);
    try {
      const result = await api.send({
        campaign_name: campaignName,
        template_name: templateName || null,
        subject,
        body,
        filters,
        email_column: emailColumn,
      });
      setSendResult(result);
      refreshLogs();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="mark">MMU_TECH // MAILER</div>
          <h1>Community Mailer</h1>
        </div>

        <SegmentPicker
          columns={columns.length ? columns : ['status', 'year']}
          filters={filters}
          setFilters={setFilters}
          matched={matched}
          onLoadRecipients={loadRecipients}
          loading={loadingRecipients}
          emailColumn={emailColumn}
          setEmailColumn={setEmailColumn}
        />
      </aside>

      <main className="main">
        {health?.mock_mode && (
          <div className="status-banner mock">
            MOCK MODE — using sample member data, no real emails are sent. Flip
            MOCK_MODE=false in backend/.env once Google credentials are wired
            in.
          </div>
        )}

        <div className="tabs">
          <button className="tab active">Compose</button>
        </div>

        <Canvas
          templateName={templateName}
          setTemplateName={setTemplateName}
          subject={subject}
          setSubject={setSubject}
          body={body}
          setBody={setBody}
          columns={columns}
          preview={preview}
          sampleRow={matched?.rows?.[0]}
        />

        <div className="row-actions">
          <button
            className="btn btn-outline"
            onClick={runPreview}
            disabled={!subject && !body}
          >
            Preview
          </button>
          <button className="btn btn-outline" onClick={saveTemplate}>
            Save template
          </button>
        </div>

        <TemplateList
          templates={templates}
          onLoad={loadTemplate}
          onDelete={deleteTemplate}
        />

        <div
          style={{
            marginTop: 36,
            borderTop: '1px solid var(--line)',
            paddingTop: 24,
          }}
        >
          <span className="field-label">
            Campaign name (for this specific send, avoids duplicates on re-run)
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              style={{
                flex: 1,
                padding: '9px 10px',
                border: '1px solid var(--line)',
                borderRadius: 4,
              }}
              value={campaignName}
              onChange={e => setCampaignName(e.target.value)}
              placeholder="e.g. welcome-pending-sept-2026"
            />
            <button className="btn btn-amber" onClick={send} disabled={sending}>
              {sending
                ? 'Sending…'
                : `Send to ${matched?.count ?? '…'} recipients`}
            </button>
          </div>

          {sendResult && (
            <p style={{ fontSize: 13, marginTop: 12, color: 'var(--teal)' }}>
              Sent {sendResult.results.length} emails
              {sendResult.skipped_duplicates > 0 &&
                ` (skipped ${sendResult.skipped_duplicates} already sent for this campaign)`}
              .
            </p>
          )}
        </div>

        <SendLogTable logs={logs} />
      </main>
    </div>
  );
}
