export default function SendLogTable({ logs }) {
  if (!logs.length) return null;
  return (
    <div style={{ marginTop: 36 }}>
      <div className="section-title" style={{ color: "var(--muted)" }}>
        Recent sends
      </div>
      <table className="log-table">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Campaign</th>
            <th>Status</th>
            <th>Sent</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.recipient_email}</td>
              <td>{l.campaign_name}</td>
              <td className={l.status === "sent" ? "status-sent" : "status-failed"}>
                {l.status}
              </td>
              <td>{l.sent_at ? new Date(l.sent_at).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
