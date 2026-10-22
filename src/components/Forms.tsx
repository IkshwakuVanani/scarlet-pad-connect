import { lazy, Suspense, useState, type FormEvent } from "react";
import { ArrowRight, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  requireBackend,
  sendMagicLink,
  ssoProvider,
  startSSO,
  supabase,
} from "../lib/backend";
import {
  blankRoommate,
  campuses,
  type Home,
  type Roommate,
} from "../lib/model";
import type { Community } from "../hooks/useCommunity";
import { Modal } from "./UI";
const LocationPicker = lazy(() => import("./LocationPicker"));
export function AuthModal({ close }: { close: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sendMagicLink(email);
      setSent(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not send a sign-in link.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open
      onClose={close}
      title={
        sent
          ? "Your next step is in your inbox."
          : "A place for the Rutgers community."
      }
      description="Sign in with a verified Rutgers email to view member homes and make connections."
    >
      <div className="auth-icon">
        {sent ? <CheckCircle2 /> : <ShieldCheck />}
      </div>
      {sent ? (
        <>
          <p>
            We sent a sign-in link to <strong>{email}</strong>. Open it in this
            browser to finish signing in. Check spam if it doesn’t arrive.
          </p>
          <button
            className="button secondary full"
            onClick={() => setSent(false)}
          >
            Use another email
          </button>
        </>
      ) : (
        <>
          <form onSubmit={submit}>
            <label className="field">
              Rutgers email
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="you@scarletmail.rutgers.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <p className="fineprint">
              @rutgers.edu or @scarletmail.rutgers.edu. We’ll email you a link.
              No password to remember.
            </p>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary full" disabled={busy}>
              {busy ? "Sending…" : "Email me a sign-in link"}
              <Mail size={17} />
            </button>
          </form>
          {ssoProvider && (
            <button
              className="button secondary full"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await startSSO();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "SSO unavailable");
                  setBusy(false);
                }
              }}
            >
              Continue with Rutgers NetID
              <ArrowRight size={16} />
            </button>
          )}
          {!supabase && (
            <div className="notice small">
              <p>
                Community sign-in is awaiting setup. The sample board is
                available now, with fictional homes and profiles.
              </p>
            </div>
          )}
          <p className="fineprint auth-foot">
            Email verification confirms control of a Rutgers address. It does
            not verify enrollment. Scarlet Pad is independent of Rutgers
            University.
          </p>
        </>
      )}
    </Modal>
  );
}
export function ListingForm({ c, close }: { c: Community; close: () => void }) {
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!c.user) return;
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const features = data.getAll("features").map(String);
    try {
      const { error } = await requireBackend()
        .from("pad_listings")
        .insert({
          user_id: c.user.id,
          title: data.get("title"),
          campus: data.get("campus"),
          location: data.get("location"),
          price: Number(data.get("price")),
          utilities: Number(data.get("utilities")),
          bedrooms: Number(data.get("bedrooms")),
          bathrooms: Number(data.get("bathrooms")),
          lease_term: data.get("lease_term"),
          available_from: data.get("available_from"),
          description: data.get("description"),
          features,
          latitude: pin?.[0] ?? null,
          longitude: pin?.[1] ?? null,
        });
      if (error) throw error;
      await c.refresh();
      toast.success("Your home is on the board");
      close();
    } catch {
      setError(
        "Could not publish this home. Check your details and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open
      wide
      onClose={close}
      title="Make room for someone new."
      description="Share a rental, spare room or sublet with the Rutgers community."
    >
      <form onSubmit={submit}>
        <label className="field">
          Listing title
          <input
            name="title"
            required
            minLength={5}
            maxLength={100}
            placeholder="A sunny room near College Avenue"
          />
        </label>
        <div className="form-grid">
          <label className="field">
            Closest campus
            <select name="campus">
              {campuses.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Neighborhood or location
            <input
              name="location"
              required
              maxLength={150}
              placeholder="e.g. Easton Avenue neighborhood"
            />
          </label>
          <label className="field">
            Rent per person / month ($)
            <input
              type="number"
              name="price"
              required
              min={1}
              max={20000}
              step={1}
            />
          </label>
          <label className="field">
            Estimated utilities / month ($)
            <input
              type="number"
              name="utilities"
              required
              min={0}
              max={5000}
              defaultValue={0}
            />
          </label>
          <label className="field">
            Total bedrooms
            <input
              type="number"
              name="bedrooms"
              required
              min={1}
              max={20}
              defaultValue={2}
            />
          </label>
          <label className="field">
            Total bathrooms
            <input
              type="number"
              name="bathrooms"
              required
              min={0.5}
              max={20}
              step={0.5}
              defaultValue={1}
            />
          </label>
          <label className="field">
            Available from
            <input type="date" name="available_from" required />
          </label>
          <label className="field">
            Lease length
            <select name="lease_term">
              {[
                "Academic year",
                "12 months",
                "Semester",
                "Summer sublet",
                "Flexible",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          Tell us about the space
          <textarea
            name="description"
            required
            minLength={30}
            maxLength={3000}
            rows={4}
            placeholder="Share room details, rent terms, accessibility, transit and anything a future roommate should know. Avoid personal contact details."
          />
        </label>
        <fieldset>
          <legend>Amenities</legend>
          <div className="checks">
            {["Furnished", "Laundry", "Parking", "Near campus"].map((x) => (
              <label key={x}>
                <input type="checkbox" name="features" value={x} />
                {x}
              </label>
            ))}
          </div>
        </fieldset>
        <details className="location-picker">
          <summary>Add a neighborhood pin (optional)</summary>
          <p className="fineprint">
            Choose an approximate location so members can explore the
            neighborhood. Avoid revealing an occupied room or precise private
            address.
          </p>
          <Suspense fallback={<p className="fineprint">Loading map…</p>}>
            <LocationPicker onChange={setPin} />
          </Suspense>
          <p className="fineprint">
            {pin
              ? "Neighborhood pin selected. This location will appear on the community map."
              : "No pin selected. Your listing will still appear in search."}
          </p>
        </details>
        <label className="consent">
          <input type="checkbox" required />
          I’m authorized to share this home, and these details accurately
          describe it. I’ll confirm lease terms and availability directly with
          interested members.
        </label>
        <p className="fineprint">
          Your email and precise address are not published. Members can send
          connection requests. Photo uploads and listing review are planned; new
          homes display a neutral placeholder.
        </p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={close}>
            Cancel
          </button>
          <button className="button primary" disabled={busy}>
            {busy ? "Publishing…" : "Publish home"}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function RoommateForm({
  c,
  close,
}: {
  c: Community;
  close: () => void;
}) {
  const [draft, setDraft] = useState<Roommate>(
    c.roommates.find((x) => x.user_id === c.user?.id) ||
      blankRoommate(c.user!.id),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { error } = await requireBackend()
        .from("pad_roommates")
        .upsert(draft);
      if (error) throw error;
      await c.refresh();
      toast.success("Roommate profile saved");
      close();
    } catch {
      setError("Could not save your profile. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open
      onClose={close}
      title="Let’s find your kind of people."
      description="Share only what you’re comfortable sharing. Your email stays private until you accept a connection."
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <label className="field">
            Display name
            <input
              required
              maxLength={60}
              value={draft.display_name}
              onChange={(e) =>
                setDraft({ ...draft, display_name: e.target.value })
              }
            />
          </label>
          <label className="field">
            Major / area of study
            <input
              required
              maxLength={80}
              value={draft.major}
              onChange={(e) => setDraft({ ...draft, major: e.target.value })}
            />
          </label>
          <label className="field">
            Preferred campus
            <select
              value={draft.campus}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  campus: e.target.value as Roommate["campus"],
                })
              }
            >
              {campuses.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Monthly budget ($)
            <input
              type="number"
              required
              min={1}
              max={20000}
              value={draft.budget}
              onChange={(e) =>
                setDraft({ ...draft, budget: Number(e.target.value) })
              }
            />
          </label>
        </div>
        {(
          [
            ["sleep", "Your schedule", ["Early bird", "Night owl", "Flexible"]],
            ["tidy", "Shared spaces", ["Very tidy", "Relaxed"]],
            [
              "social",
              "Your home vibe",
              ["Quiet home", "Social home", "A balance"],
            ],
          ] as const
        ).map(([key, label, values]) => (
          <label className="field" key={key}>
            {label}
            <select
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            >
              {values.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        ))}
        <label className="field">
          A little about you
          <textarea
            required
            minLength={20}
            maxLength={600}
            rows={4}
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
          />
        </label>
        <label className="consent">
          <input
            type="checkbox"
            checked={draft.is_visible}
            onChange={(e) =>
              setDraft({ ...draft, is_visible: e.target.checked })
            }
          />
          Show my profile to signed-in Rutgers members. Turn this off to pause
          discovery.
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full" disabled={busy}>
          {busy ? "Saving…" : "Save my profile"}
          <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}
export function ConnectForm({
  c,
  target,
  close,
}: {
  c: Community;
  target: Home | Roommate;
  close: () => void;
}) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const listing = "title" in target;
  const label = listing ? target.title : target.display_name;
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { error } = await requireBackend()
        .from("pad_connections")
        .insert({
          from_user: c.user!.id,
          to_user: target.user_id,
          target_listing: listing ? target.id : null,
          target_label: label,
          note,
        });
      if (error) throw error;
      await c.refresh();
      toast.success(
        "Connection request sent. Check your inbox for a response.",
      );
      close();
    } catch {
      setError(
        "Could not send this request. You may already have a request with this member.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      open
      onClose={close}
      title="Start with a hello."
      description={`Send a connection request about ${label}.`}
    >
      <form onSubmit={submit}>
        <label className="field">
          Your introduction
          <textarea
            required
            minLength={10}
            maxLength={800}
            rows={5}
            placeholder="Introduce yourself, share what you’re looking for, and ask a question about the home or their housing plans."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <p className="fineprint">
          If they accept, you’ll both be able to see each other’s Rutgers email
          to continue the conversation. No payment or booking happens here.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button className="button primary full" disabled={busy}>
          {busy ? "Sending…" : "Send request"}
          <ArrowRight size={16} />
        </button>
      </form>
    </Modal>
  );
}
