import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  Coffee,
  ExternalLink,
  Mail,
  Moon,
  ShieldCheck,
  Users,
  Wallet,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import type { Community } from "../hooks/useCommunity";
import { requireBackend } from "../lib/backend";
import {
  campuses,
  money,
  officialHousing,
  type Connection,
  type Roommate,
} from "../lib/model";
import { Empty, External } from "./UI";
export function Roommates({
  c,
  onEdit,
  onConnect,
}: {
  c: Community;
  onEdit: () => void;
  onConnect: (r: Roommate) => void;
}) {
  const [campus, setCampus] = useState("All campuses");
  const [sleep, setSleep] = useState("Any schedule");
  const people = c.roommates.filter(
    (r) =>
      (campus === "All campuses" || r.campus === campus) &&
      (sleep === "Any schedule" || r.sleep === sleep),
  );
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">GOOD HOMES START WITH GOOD PEOPLE</span>
        <h1>
          Your people.
          <br />
          <em>Your place.</em>
        </h1>
        <p>
          Find someone whose everyday feels a little like yours. Start with a
          conversation, then figure out the rest together.
        </p>
        <button className="button primary" onClick={onEdit}>
          Create or edit my profile
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="section-heading">
        <h2>
          Meet your future roommates<span>{people.length}</span>
        </h2>
        <div className="inline-filters">
          <select
            aria-label="Roommate campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          >
            {["All campuses", ...campuses].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select
            aria-label="Roommate schedule"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
          >
            {["Any schedule", "Early bird", "Night owl", "Flexible"].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
        </div>
      </div>
      {c.demo && (
        <p className="sample-note">
          These are fictional profiles for exploring the experience. No real
          students are shown.
        </p>
      )}
      <div className="people-grid">
        {people.map((r, i) => (
          <article className="person-card" key={r.user_id}>
            <div className={`avatar avatar-${i % 4}`}>
              {r.display_name.slice(0, 1)}
            </div>
            <span className="person-kicker">
              {c.demo ? "SAMPLE PROFILE" : "RUTGERS EMAIL CONFIRMED"}
            </span>
            <h3>{r.display_name}</h3>
            <p className="major">{r.major}</p>
            <p className="person-location">
              <MapPin size={14} />
              {r.campus}
              <span>·</span>Up to {money(r.budget)}/mo
            </p>
            <div className="lifestyle">
              <span>
                <Moon size={13} />
                {r.sleep}
              </span>
              <span>
                <ShieldCheck size={13} />
                {r.tidy}
              </span>
              <span>
                <Coffee size={13} />
                {r.social}
              </span>
            </div>
            <p className="bio">{r.bio}</p>
            <button
              className="button secondary full"
              onClick={() =>
                r.user_id === c.user?.id ? onEdit() : onConnect(r)
              }
            >
              {r.user_id === c.user?.id ? "Edit my profile" : "Say hello"}
              <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
      {!people.length && (
        <Empty title="Your people are still finding their way here.">
          Try another filter, or create your own roommate profile.
        </Empty>
      )}
      <aside className="notice">
        <Users size={21} />
        <div>
          <strong>A match is a starting point.</strong>
          <p>
            Talk through schedules, guests, chores, budget and lease
            expectations before deciding to live together. Always meet somewhere
            public first.
          </p>
        </div>
      </aside>
    </>
  );
}
export function Inbox({ c }: { c: Community }) {
  const [busy, setBusy] = useState("");
  const [emails, setEmails] = useState<Record<string, string>>({});
  async function respond(r: Connection, status: "accepted" | "declined") {
    setBusy(r.id);
    try {
      const { error } = await requireBackend()
        .from("pad_connections")
        .update({ status })
        .eq("id", r.id);
      if (error) throw error;
      await c.refresh();
      toast.success(
        status === "accepted" ? "Connection accepted" : "Request declined",
      );
    } catch {
      toast.error("Could not update this request.");
    } finally {
      setBusy("");
    }
  }
  async function reveal(r: Connection) {
    setBusy(r.id);
    try {
      const { data, error } = await requireBackend().rpc(
        "pad_connection_email",
        { connection_id: r.id },
      );
      if (error) throw error;
      if (!data) throw Error();
      setEmails({ ...emails, [r.id]: data });
    } catch {
      toast.error("Contact is unavailable. The connection must be accepted.");
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">A CONVERSATION CAN CHANGE EVERYTHING</span>
        <h1>
          A little hello.
          <br />
          <em>A new beginning.</em>
        </h1>
        <p>
          Manage your housing and roommate introductions. Contact information is
          shared only after a request is accepted.
        </p>
      </div>
      {!c.connections.length ? (
        <Empty
          title={
            c.demo ? "Your connections start here." : "No introductions yet."
          }
        >
          {c.demo
            ? "Sign in to send and receive real connection requests."
            : "Find a home or roommate and send a thoughtful hello."}
        </Empty>
      ) : (
        <div className="stack">
          {c.connections.map((r) => (
            <article className="panel request" key={r.id}>
              <div>
                <span className="eyebrow">
                  {r.from_user === c.user?.id
                    ? "SENT REQUEST"
                    : "RECEIVED REQUEST"}{" "}
                  · {r.status.toUpperCase()}
                </span>
                <h3>{r.target_label}</h3>
                <p className="request-note">{r.note}</p>
                <span className="fineprint">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="request-actions">
                {r.status === "pending" && r.to_user === c.user?.id && (
                  <>
                    <button
                      disabled={busy === r.id}
                      className="button primary"
                      onClick={() => respond(r, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      disabled={busy === r.id}
                      className="button secondary"
                      onClick={() => respond(r, "declined")}
                    >
                      Decline
                    </button>
                  </>
                )}
                {r.status === "accepted" &&
                  (emails[r.id] ? (
                    <a
                      className="button secondary"
                      href={`mailto:${emails[r.id]}`}
                    >
                      <Mail size={16} />
                      {emails[r.id]}
                    </a>
                  ) : (
                    <button
                      className="button secondary"
                      disabled={busy === r.id}
                      onClick={() => reveal(r)}
                    >
                      Show Rutgers email
                    </button>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
const resources = [
  {
    icon: BookOpen,
    tag: "ON-CAMPUS",
    title: "Understand housing selection",
    text: "Eligibility, group size, seniority points, application steps and the official calendar.",
    link: officialHousing,
  },
  {
    icon: Wallet,
    tag: "OFF-CAMPUS",
    title: "Know the full monthly picture",
    text: "Compare rent, utilities, transportation and lease length. Ask for all fees in writing before signing.",
    link: "https://ruoffcampus.rutgers.edu/",
  },
  {
    icon: CircleHelp,
    tag: "ACCESS & SUPPORT",
    title: "Find your housing support",
    text: "Reach Residence Life for official housing questions, resources and accommodations.",
    link: "https://ruoncampus.rutgers.edu/",
  },
  {
    icon: ShieldCheck,
    tag: "YOUR ACCOUNT",
    title: "Keep your NetID yours",
    text: "Use official Rutgers sign-in pages. Scarlet Pad never asks for your NetID password.",
    link: "https://it.rutgers.edu/identity-and-access-management/",
  },
];
export function Resources() {
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">A FEW THINGS WORTH KNOWING</span>
        <h1>
          A little clarity.
          <br />
          <em>A lot more confidence.</em>
        </h1>
        <p>
          Useful starting points for finding a home around the Banks. Go
          straight to Rutgers for official requirements and deadlines.
        </p>
      </div>
      <div className="resource-grid">
        {resources.map((r) => (
          <article className="panel resource" key={r.title}>
            <div className="resource-icon">
              <r.icon size={24} />
            </div>
            <span className="eyebrow">{r.tag}</span>
            <h2>{r.title}</h2>
            <p>{r.text}</p>
            <External href={r.link}>
              Visit Rutgers
              <ExternalLink size={14} />
            </External>
          </article>
        ))}
      </div>
      <section className="panel faq">
        <h2>Good questions. Clear answers.</h2>
        {[
          [
            "Is Scarlet Pad part of Rutgers?",
            "No. Scarlet Pad is an independent housing companion. Rutgers Residence Life manages official on-campus applications and assignments.",
          ],
          [
            "What does Rutgers email confirmed mean?",
            "It means a member has confirmed access to an allowed Rutgers email address. It does not verify current enrollment, a landlord, a property, or the accuracy of a listing.",
          ],
          [
            "Can I book a home or pay rent here?",
            "No. You can discover homes, compare costs and request connections. Discuss availability and lease terms directly with the poster. Never send a payment just to secure a viewing.",
          ],
          [
            "Are sample homes actually available?",
            "No. Sample homes and roommate profiles are fictional, and the photos are illustrative. They let you try the tools without exposing anyone’s personal information.",
          ],
          [
            "How is my information shared?",
            "Community data is restricted to confirmed Rutgers email accounts. Your roommate profile is opt-in; your plan and shortlist are private. Your Rutgers email is shared with another member only after you accept a connection. Sample saves and plans stay in your browser.",
          ],
          [
            "How do I remove my information?",
            "Pause your roommate profile using its visibility checkbox, remove your saved homes, or delete listings you posted from their detail view. To delete an account and all associated records, use the project operator’s Supabase account deletion process; self-service deletion is a future feature.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
