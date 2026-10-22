import {
  ArrowRight,
  CalendarDays,
  House,
  ShieldCheck,
  Users,
} from "lucide-react";
export default function GuestLanding({ onSignIn }: { onSignIn: () => void }) {
  return (
    <>
      <section className="hero guest-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="scarlet-line" />
            RUTGERS–NEW BRUNSWICK
          </span>
          <h1>
            Find your place.
            <br />
            <em>Find your people.</em>
          </h1>
          <p>
            Your next home starts with your community.
            <br />
            Housing, roommates, and a plan for what’s next.
          </p>
          <button className="button primary" onClick={onSignIn}>
            Join with your Rutgers email
            <ArrowRight size={16} />
          </button>
          <p className="guest-proof">
            <ShieldCheck size={14} />
            Member-only homes. Connections on your terms.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="/images/living-room.jpg"
            alt="An inviting living room, shown as inspiration"
          />
          <div className="hero-image-shade" />
          <div className="image-caption">
            <span>MADE FOR YOUR NEXT CHAPTER</span>
            <strong>
              A new place.
              <br />A little more possibility.
            </strong>
          </div>
          <span className="hero-image-label">HOME INSPIRATION</span>
        </div>
      </section>
      <div className="guest-features">
        {[
          {
            Icon: House,
            title: "A space that fits your life",
            text: "Explore member-posted homes, filter by campus and budget, and compare the complete monthly picture.",
          },
          {
            Icon: Users,
            title: "People on your wavelength",
            text: "Share your routine and find future roommates. Exchange contact details only when you both choose to connect.",
          },
          {
            Icon: CalendarDays,
            title: "Your next steps, together",
            text: "Keep your group, selection appointment, and housing checklist in one private place.",
          },
        ].map(({ Icon, title, text }) => (
          <section className="panel" key={title}>
            <span className="resource-icon">
              <Icon size={24} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </div>
      <div className="notice">
        <ShieldCheck size={21} />
        <div>
          <strong>Your Rutgers community, with care.</strong>
          <p>
            Use a confirmed @rutgers.edu or @scarletmail.rutgers.edu email to
            join. Scarlet Pad is an independent companion; official on-campus
            applications and assignments stay with Rutgers Residence Life.
          </p>
        </div>
      </div>
    </>
  );
}
