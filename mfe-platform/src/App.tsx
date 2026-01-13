// src/App.tsx
import { useState } from "react";

export type AuthContext = {
  userId: string;
  roles: string[];
};

type ActivityItem = {
  id: string;
  type: string;
  message: string;
};

export default function App({
  tenantId,
  authContext,
  bffBaseUrl,
  emitAction,
}: {
  tenantId: string;
  authContext: AuthContext | null;
  bffBaseUrl: string;
  emitAction: (type: string, payload?: Record<string, unknown>) => void;
}) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadActivity(attempt = 1) {
    if (!authContext?.userId) {
      setError("User not authenticated");
      emitAction("apiError", {
        source: "auth",
        message: "Missing authContext",
      });
      return;
    }

    if (!bffBaseUrl) {
      setError("BFF base URL not configured");
      emitAction("apiError", {
        source: "config",
        message: "Missing bffBaseUrl",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${bffBaseUrl}/mfe/activity`, {
        headers: {
          "x-user-id": authContext.userId,
          "x-roles": authContext.roles.join(","),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items ?? []);

      emitAction("activityLoaded", {
        count: data.items?.length ?? 0,
      });
    } catch {
      if (attempt < 3) {
        emitAction("apiRetry", { attempt });
        return loadActivity(attempt + 1);
      }

      setError("Failed to load activity");

      emitAction("apiError", {
        source: "bff",
        message: "Activity API failed after retries",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mfe-card">
      <div className="mfe-header">
        <div className="mfe-title">User Activity</div>
        <div className="mfe-meta">{tenantId || "no-tenant"}</div>
      </div>

      <div className="mfe-section">
        <div className="mfe-row">
          <b>User:</b> {authContext?.userId ?? "not authenticated"}
        </div>
        <div className="mfe-row">
          <b>Roles:</b>{" "}
          {authContext?.roles?.length ? authContext.roles.join(", ") : "none"}
        </div>
        <div className="mfe-row">
          <b>BFF:</b> {bffBaseUrl || "not configured"}
        </div>
      </div>

      <div className="mfe-actions">
        <button
          className="mfe-btn"
          onClick={() => loadActivity()}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh Activity"}
        </button>
      </div>

      {error && <div className="mfe-error">{error}</div>}

      {!error && items.length === 0 && (
        <div className="mfe-empty">No activity to show</div>
      )}

      {items.length > 0 && (
        <ul className="mfe-list">
          {items.map((item) => (
            <li key={item.id}>{item.message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
