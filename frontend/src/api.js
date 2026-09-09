const BASE = "http://localhost:8000";

async function j(res) {
  if (!res.ok) throw new Error((await res.text()) || res.statusText);
  return res.json();
}

export const api = {
  health: () => fetch(`${BASE}/api/health`).then(j),
  columns: () => fetch(`${BASE}/api/sheet/columns`).then(j),
  segment: (filters) =>
    fetch(`${BASE}/api/sheet/segment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters }),
    }).then(j),
  listTemplates: () => fetch(`${BASE}/api/templates`).then(j),
  saveTemplate: (t) =>
    fetch(`${BASE}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t),
    }).then(j),
  deleteTemplate: (id) =>
    fetch(`${BASE}/api/templates/${id}`, { method: "DELETE" }).then(j),
  preview: (subject, body, sample_row) =>
    fetch(`${BASE}/api/campaigns/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, sample_row }),
    }).then(j),
  send: (payload) =>
    fetch(`${BASE}/api/campaigns/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(j),
  logs: (campaign_name) =>
    fetch(
      `${BASE}/api/campaigns/logs${campaign_name ? `?campaign_name=${encodeURIComponent(campaign_name)}` : ""}`
    ).then(j),
};
