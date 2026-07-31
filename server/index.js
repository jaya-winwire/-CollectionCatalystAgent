import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, "..", "dist");

const PORT = process.env.PORT || 8787;
const GENERATE_EMAIL_DRAFT_FLOW_URL = process.env.POWER_AUTOMATE_EMAIL_DRAFT_URL;
const APPROVE_SEND_EMAIL_FLOW_URL = process.env.POWER_AUTOMATE_APPROVE_SEND_URL;

const app = express();
app.use(express.json());

app.post("/api/generate-email-draft", async (req, res) => {
  const { accountId } = req.body ?? {};

  if (!accountId) {
    return res.status(400).json({ error: "accountId is required" });
  }

  if (!GENERATE_EMAIL_DRAFT_FLOW_URL) {
    return res.status(500).json({ error: "POWER_AUTOMATE_EMAIL_DRAFT_URL is not configured" });
  }

  try {
    const flowResponse = await fetch(GENERATE_EMAIL_DRAFT_FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The flow's request schema uses "acountId" (its actual field name, typo included).
      body: JSON.stringify({ acountId: accountId }),
    });

    if (!flowResponse.ok) {
      const text = await flowResponse.text();
      return res.status(flowResponse.status).json({ error: `Email draft flow failed: ${text}` });
    }

    const data = await flowResponse.json();
    res.json(data);
  } catch (err) {
    console.error("[server] Failed to call email draft flow:", err);
    res.status(502).json({ error: "Failed to reach email draft flow" });
  }
});

app.post("/api/approve-send-email", async (req, res) => {
  const { RId, accessToken, sendTo } = req.body ?? {};

  if (!RId || !accessToken || !sendTo) {
    return res.status(400).json({ error: "RId, accessToken, and sendTo are required" });
  }

  if (!APPROVE_SEND_EMAIL_FLOW_URL) {
    return res.status(500).json({ error: "POWER_AUTOMATE_APPROVE_SEND_URL is not configured" });
  }

  try {
    const flowResponse = await fetch(APPROVE_SEND_EMAIL_FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ RId, accessToken, sendTo }),
    });

    if (!flowResponse.ok) {
      const text = await flowResponse.text();
      return res.status(flowResponse.status).json({ error: `Approve & send flow failed: ${text}` });
    }

    const data = await flowResponse.json().catch(() => ({}));
    res.json(data);
  } catch (err) {
    console.error("[server] Failed to call approve & send flow:", err);
    res.status(502).json({ error: "Failed to reach approve & send flow" });
  }
});

// Serve the built React app (npm run build -> dist/) and fall back to
// index.html for client-side routes, for any request that isn't /api/*.
app.use(express.static(DIST_DIR));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
});
