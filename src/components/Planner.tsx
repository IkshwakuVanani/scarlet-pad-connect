import { useState } from "react";
import { CalendarDays, Check, Download, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import type { Community } from "../hooks/useCommunity";
import { officialHousing, tasks, type Planner as Plan } from "../lib/model";
import { External } from "./UI";
export default function Planner({ community: c }: { community: Community }) {
  const [draft, setDraft] = useState<Plan>(c.plan);
  const [saving, setSaving] = useState(false);
  const progress = tasks.filter(([id]) => draft.tasks[id]).length;
  async function save() {
    setSaving(true);
    try {
      await c.savePlan(draft);
      toast.success(
        c.demo ? "Plan saved on this device" : "Housing plan saved",
      );
    } catch {
      toast.error("Could not save your plan. Please try again.");
    } finally {
      setSaving(false);
    }
  }
  function download() {
    const text = [
      "Scarlet Pad — my housing plan",
      "",
      "Group:",
      ...draft.names
        .map((n, i) =>
          n ? `${n}: ${draft.points[i]} self-entered points` : "",
        )
        .filter(Boolean),
      "",
      `Selection appointment: ${draft.selection || "Not set"}`,
      "",
      ...tasks.map(([id, t]) => `${draft.tasks[id] ? "[x]" : "[ ]"} ${t}`),
      "",
      "Confirm all deadlines and eligibility with Rutgers Residence Life.",
      officialHousing,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "scarlet-pad-housing-plan.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">
          A LITTLE PREPARATION. A LOT LESS STRESS.
        </span>
        <h1>
          Make a plan.
          <br />
          <em>Make yourself at home.</em>
        </h1>
        <p>
          Keep your group and next steps in one place. Your official selection
          still happens through Rutgers.
        </p>
      </div>
      <div className="planner-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">YOUR NEXT STEPS</span>
              <h2>One step closer</h2>
            </div>
            <span className="count-badge">
              {progress} / {tasks.length}
            </span>
          </div>
          <div className="progress-track">
            <span style={{ width: `${(progress / tasks.length) * 100}%` }} />
          </div>
          <div className="task-list">
            {tasks.map(([id, t, d]) => (
              <label
                className={`task ${draft.tasks[id] ? "done" : ""}`}
                key={id}
              >
                <input
                  type="checkbox"
                  checked={!!draft.tasks[id]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      tasks: { ...draft.tasks, [id]: e.target.checked },
                    })
                  }
                />
                <span className="task-check">
                  {draft.tasks[id] && <Check size={15} />}
                </span>
                <span>
                  <strong>{t}</strong>
                  <small>{d}</small>
                </span>
              </label>
            ))}
          </div>
          <label className="field">
            Your selection appointment
            <input
              type="datetime-local"
              value={draft.selection}
              onChange={(e) =>
                setDraft({ ...draft, selection: e.target.value })
              }
            />
          </label>
          <p className="fineprint">
            Use your own appointment email. No 2027 dates are assumed here.
          </p>
        </section>
        <div className="stack">
          <section className="panel">
            <span className="eyebrow">YOUR GROUP, AT A GLANCE</span>
            <h2>Better together</h2>
            <p className="muted">
              Enter points from your current Rutgers housing information. This
              is a planning worksheet, not an eligibility calculation.
            </p>
            <div className="group-label">
              <span>Group member</span>
              <span>Points</span>
            </div>
            {draft.names.map((n, i) => (
              <div className="group-input" key={i}>
                <input
                  aria-label={`Group member ${i + 1}`}
                  placeholder={
                    i === 0 ? "Your name" : `Roommate ${i + 1} (optional)`
                  }
                  value={n}
                  maxLength={60}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      names: draft.names.map((x, j) =>
                        i === j ? e.target.value : x,
                      ),
                    })
                  }
                />
                <select
                  aria-label={`Points for group member ${i + 1}`}
                  value={draft.points[i]}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      points: draft.points.map((x, j) =>
                        i === j ? Number(e.target.value) : x,
                      ),
                    })
                  }
                >
                  {[0, 1, 2, 3, 4].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="points-total">
              <span>Self-entered group total</span>
              <strong>
                {draft.points.reduce(
                  (a, b, i) => a + (draft.names[i].trim() ? b : 0),
                  0,
                )}
                <small> points</small>
              </strong>
            </div>
          </section>
          <aside className="notice">
            <Info size={20} />
            <div>
              <strong>A number isn’t the whole story.</strong>
              <p>
                The published 2026–27 process considers group size, seniority
                points, then the lowest selection number. Singles use earned
                credits. Future rules may change.
              </p>
              <External href={officialHousing}>
                Read the official process
              </External>
            </div>
          </aside>
        </div>
      </div>
      <div className="form-actions">
        <span className="fineprint">
          {c.demo
            ? "Your sample plan stays in this browser."
            : "Your plan is private to your account."}
        </span>
        <button className="button secondary" onClick={download}>
          <Download size={16} />
          Export plan
        </button>
        <button className="button primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save my plan"}
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="mini-banner">
        <CalendarDays size={23} />
        <div>
          <strong>Keep the official portal close.</strong>
          <p>
            Check Rutgers for current dates, applications, eligibility and
            accommodations.
          </p>
        </div>
        <External
          href="https://oncampus.rutgers.edu/"
          className="button secondary"
        >
          Open housing portal
        </External>
      </div>
    </>
  );
}
