import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowDownUp,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  House,
  LayoutGrid,
  LogOut,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { useCommunity } from "./hooks/useCommunity";
import { supabase } from "./lib/backend";
import {
  campuses,
  filterHomes,
  initialFilters,
  money,
  officialHousing,
  readLocal,
  storeLocal,
  type Filters,
  type Home,
  type Roommate,
} from "./lib/model";
import { Empty, External, HomeCard, Modal } from "./components/UI";
import {
  AuthModal,
  ConnectForm,
  ListingForm,
  RoommateForm,
} from "./components/Forms";
import { Inbox, Resources, Roommates } from "./components/CommunityPages";
import Planner from "./components/Planner";
import GuestLanding from "./components/GuestLanding";
const HomeMap = lazy(() => import("./components/HomeMap"));
type SearchPreset = { name: string; filters: Filters };
const navigation = [
  { path: "/", label: "Find a home", icon: House },
  { path: "/roommates", label: "Find your people", icon: Users },
  { path: "/saved", label: "Your shortlist", icon: Heart },
  { path: "/planner", label: "Housing planner", icon: CalendarDays },
  { path: "/inbox", label: "Connections", icon: MessageCircle },
];
function Workspace() {
  const c = useCommunity();
  const location = useLocation();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [auth, setAuth] = useState(false);
  const [create, setCreate] = useState(false);
  const [profile, setProfile] = useState(false);
  const [detail, setDetail] = useState<Home | null>(null);
  const [connect, setConnect] = useState<Home | Roommate | null>(null);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [advanced, setAdvanced] = useState(false);
  const [view, setView] = useState("grid");
  const [compare, setCompare] = useState<string[]>([]);
  const [comparison, setComparison] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<SearchPreset[]>(() =>
    readLocal("scarlet-searches", []),
  );
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const path = location.pathname;
  const isSaved = path === "/saved";
  const isHomes = path === "/" || isSaved || path === "/auth/callback";
  const title =
    navigation.find((x) => x.path === path)?.label ||
    (path === "/resources" ? "The housing guide" : "Find a home");
  const filtered = useMemo(
    () =>
      filterHomes(
        isSaved ? c.homes.filter((h) => c.saves.includes(h.id)) : c.homes,
        filters,
      ),
    [isSaved, c.homes, c.saves, filters],
  );
  const selected = c.homes.filter((h) => compare.includes(h.id));
  const openDetail = useCallback((h: Home) => {
    setDetail(h);
    setConfirmDelete(false);
  }, []);
  useEffect(() => {
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [path]);
  useEffect(() => {
    if (c.user) {
      setAuth(false);
      if (path === "/auth/callback") navigate("/", { replace: true });
    }
  }, [c.user, path, navigate]);
  const update = (patch: Partial<Filters>) =>
    setFilters((f) => ({ ...f, ...patch }));
  const requireMember = (action: () => void) => {
    if (!c.user) {
      setAuth(true);
      return;
    }
    action();
  };
  const onConnect = (target: Home | Roommate) => {
    if (c.demo) {
      toast.info(
        "Sample profiles and homes are fictional. Sign in to connect with real members.",
      );
      setAuth(true);
      return;
    }
    setConnect(target);
  };
  const toggleCompare = (id: string) => {
    if (compare.includes(id)) setCompare(compare.filter((x) => x !== id));
    else if (compare.length < 3) setCompare([...compare, id]);
    else toast.info("Compare up to three homes at a time.");
  };
  async function deleteHome() {
    if (!detail || !c.user) return;
    setDeleting(true);
    try {
      const { error } = await supabase!
        .from("pad_listings")
        .delete()
        .eq("id", detail.id)
        .eq("user_id", c.user.id);
      if (error) throw error;
      if (detail.photo_path) {
        const { error: photoError } = await supabase!.storage
          .from("pad-listing-photos")
          .remove([detail.photo_path]);
        if (photoError)
          toast.info("Listing removed. Its photo cleanup will need a retry.");
      }
      setDetail(null);
      await c.refresh();
      toast.success("Listing removed");
    } catch {
      toast.error("Could not remove this listing.");
    } finally {
      setDeleting(false);
    }
  }
  function saveSearch() {
    const name = presetName.trim();
    if (!name) return;
    const next = [
      ...presets.filter((p) => p.name !== name),
      { name, filters },
    ].slice(-6);
    if (!storeLocal("scarlet-searches", next)) {
      toast.error("Your browser could not save this search.");
      return;
    }
    setPresets(next);
    setPresetOpen(false);
    setPresetName("");
    toast.success("Search saved on this device");
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {menu && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setMenu(false)}
        />
      )}
      <aside id="primary-sidebar" className={`sidebar ${menu ? "open" : ""}`}>
        <Link className="brand" to="/" aria-label="Scarlet Pad home">
          <span className="brand-symbol">
            <House size={24} />
          </span>
          <span>
            scarlet<span className="brand-light">pad</span>
            <small>FIND YOUR PLACE.</small>
          </span>
        </Link>
        <span className="sidebar-eyebrow">YOUR NEXT CHAPTER</span>
        <nav aria-label="Main navigation">
          {navigation.map((n) => (
            <NavLink
              key={n.path}
              end={n.path === "/"}
              to={n.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <n.icon size={19} />
              {n.label}
              {n.path === "/saved" && c.saves.length > 0 && (
                <span className="nav-count">{c.saves.length}</span>
              )}
              {n.path === "/inbox" &&
                c.connections.some(
                  (r) => r.to_user === c.user?.id && r.status === "pending",
                ) && <span className="nav-dot" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <NavLink to="/resources" className="nav-item">
          <BookOpen size={18} />
          The housing guide
          <ArrowUpRight size={15} />
        </NavLink>
        <div className="sidebar-bottom">
          <div className="sidebar-card">
            <span className="little-spark">
              <Sparkles size={18} />
            </span>
            <h3>
              New place.
              <br />
              Same Scarlet spirit.
            </h3>
            <p>A little help finding where you belong.</p>
            <Link to="/planner">
              Let’s make a plan
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="community-mark">
            <span className="campus-emblem">R</span>
            <p>
              Made for the Banks.
              <small>Independent of Rutgers University.</small>
            </p>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-controls="primary-sidebar"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
            >
              <Menu size={22} />
            </button>
            <span>Rutgers–New Brunswick</span>
            <span className="crumb-slash">/</span>
            <strong>{title}</strong>
            <ChevronDown size={13} />
          </div>
          <div className="top-actions">
            <span className="member-tag">
              <ShieldCheck size={14} />
              Rutgers community
            </span>
            {c.user ? (
              <>
                <span className="account-name">
                  {c.user.email?.split("@")[0]}
                </span>
                <button
                  className="icon-button"
                  aria-label="Sign out"
                  onClick={async () => {
                    const { error } = await supabase!.auth.signOut();
                    if (error) toast.error("Could not sign out.");
                    else toast.success("Signed out");
                  }}
                >
                  <LogOut size={17} />
                </button>
              </>
            ) : (
              <button className="sign-in" onClick={() => setAuth(true)}>
                Sign in
                <ArrowUpRight size={15} />
              </button>
            )}
            <button
              className="button dark small-button"
              onClick={() => requireMember(() => setCreate(true))}
            >
              <Plus size={16} />
              <span>Post a home</span>
            </button>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {c.demo && (
            <div className="demo-banner">
              <span className="live-dot" />
              <strong>You’re exploring the sample board.</strong>
              <span>Fictional homes. Real possibilities.</span>
              <button onClick={() => setAuth(true)}>
                Join the community
                <ArrowRight size={14} />
              </button>
            </div>
          )}
          {path === "/auth/callback" && !c.user && !c.authLoading && (
            <div className="notice">
              <p>
                Your sign-in link could not be completed or has expired.{" "}
                <button className="text-button" onClick={() => setAuth(true)}>
                  Request a fresh link
                </button>
                .
              </p>
            </div>
          )}
          {c.authLoading || c.loading ? (
            <div className="loading-state" role="status">
              <span className="loading-spinner" />
              Getting your place ready…
            </div>
          ) : c.error ? (
            <Empty
              title="We couldn’t reach the community."
              action={
                <button
                  className="button primary"
                  onClick={() => void c.refresh()}
                >
                  Try again
                </button>
              }
            >
              {c.error}
            </Empty>
          ) : !c.user && !c.demo && path !== "/resources" ? (
            <GuestLanding onSignIn={() => setAuth(true)} />
          ) : isHomes ? (
            <>
              {!isSaved ? (
                <section className="hero">
                  <div className="hero-copy">
                    <span className="eyebrow">
                      <span className="scarlet-line" />
                      FOR THE NEXT CHAPTER
                    </span>
                    <h1>
                      Find your place.
                      <br />
                      <em>Find your people.</em>
                    </h1>
                    <p>
                      The right space. The right roommates.
                      <br />A little closer to feeling at home.
                    </p>
                    <div className="hero-bottom">
                      <span className="mini-avatars">
                        <i>M</i>
                        <i>J</i>
                        <i>A</i>
                      </span>
                      <span>
                        Built around your life at Rutgers.
                        <small>
                          From your first search to your next chapter.
                        </small>
                      </span>
                    </div>
                  </div>
                  <div className="hero-image">
                    <img
                      src="/images/living-room.jpg"
                      alt="A warm, sunlit living room with space to settle in"
                    />
                    <div className="hero-image-shade" />
                    <div className="image-caption">
                      <span>
                        <MapPin size={13} />
                        YOUR NEW BRUNSWICK CHAPTER
                      </span>
                      <strong>
                        More than an address.
                        <br />A place to belong.
                      </strong>
                    </div>
                    <span className="hero-image-label">
                      A LITTLE INSPIRATION
                    </span>
                  </div>
                  <div className="hero-sticker">
                    <House size={22} />
                    <span>
                      Home is
                      <br />
                      <strong>what’s next.</strong>
                    </span>
                  </div>
                </section>
              ) : (
                <div className="page-intro">
                  <span className="eyebrow">
                    THE PLACES YOU KEEP COMING BACK TO
                  </span>
                  <h1>
                    Your little
                    <br />
                    <em>list of possibilities.</em>
                  </h1>
                  <p>
                    Save the spaces you love. Compare the details. Find the one
                    that feels right.
                  </p>
                </div>
              )}
              <div className="explore-layout">
                <section className="explorer" aria-label="Housing explorer">
                  <div className="section-heading">
                    <h2>
                      {isSaved
                        ? "Your shortlist"
                        : "A place for every kind of you"}
                      <span>{filtered.length}</span>
                    </h2>
                    <span className="subtle-caption">
                      {c.demo ? "SAMPLE COLLECTION" : "COMMUNITY HOMES"}
                    </span>
                  </div>
                  <div className="search-bar">
                    <label className="search-input">
                      <Search size={18} />
                      <input
                        aria-label="Search homes"
                        placeholder="A neighborhood, a campus, a fresh start…"
                        value={filters.search}
                        onChange={(e) => update({ search: e.target.value })}
                      />
                      {filters.search && (
                        <button
                          className="icon-button"
                          aria-label="Clear search"
                          onClick={() => update({ search: "" })}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </label>
                    <button
                      className={`filter-button ${advanced ? "active" : ""}`}
                      onClick={() => setAdvanced(!advanced)}
                      aria-expanded={advanced}
                    >
                      <SlidersHorizontal size={17} />
                      Filters
                      {(filters.bedrooms !== "Any" ||
                        filters.features.length > 0 ||
                        filters.lease !== "Any" ||
                        filters.budget < 2500) && (
                        <span className="filter-dot" />
                      )}
                    </button>
                  </div>
                  <div className="campus-filters" aria-label="Filter by campus">
                    {["All campuses", ...campuses].map((x) => (
                      <button
                        key={x}
                        className={filters.campus === x ? "active" : ""}
                        onClick={() => update({ campus: x })}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                  {advanced && (
                    <div className="advanced-filters">
                      <label className="field">
                        Maximum rent: {money(filters.budget)}
                        <input
                          type="range"
                          min={500}
                          max={2500}
                          step={25}
                          value={filters.budget}
                          onChange={(e) =>
                            update({ budget: Number(e.target.value) })
                          }
                        />
                      </label>
                      <label className="field">
                        Bedrooms
                        <select
                          value={filters.bedrooms}
                          onChange={(e) => update({ bedrooms: e.target.value })}
                        >
                          {["Any", "1", "2", "3", "4+"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <label className="field">
                        Lease length
                        <select
                          value={filters.lease}
                          onChange={(e) => update({ lease: e.target.value })}
                        >
                          {[
                            "Any",
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
                      <fieldset>
                        <legend>Amenities</legend>
                        <div className="checks">
                          {[
                            "Furnished",
                            "Laundry",
                            "Parking",
                            "Near campus",
                          ].map((x) => (
                            <label key={x}>
                              <input
                                type="checkbox"
                                checked={filters.features.includes(x)}
                                onChange={(e) =>
                                  update({
                                    features: e.target.checked
                                      ? [...filters.features, x]
                                      : filters.features.filter((v) => v !== x),
                                  })
                                }
                              />
                              {x}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <button
                        className="text-button"
                        onClick={() => setFilters(initialFilters)}
                      >
                        Reset all filters
                      </button>
                    </div>
                  )}
                  <div className="results-toolbar">
                    <span>
                      {filtered.length}{" "}
                      {isSaved ? "saved homes" : "homes to explore"}
                      {filters.campus !== "All campuses" &&
                        ` near ${filters.campus}`}
                    </span>
                    <div>
                      <button
                        className="save-search"
                        onClick={() => setPresetOpen(true)}
                      >
                        <Bell size={13} />
                        Save search
                      </button>
                      <label className="sort-control">
                        <ArrowDownUp size={13} />
                        <select
                          aria-label="Sort homes"
                          value={filters.sort}
                          onChange={(e) => update({ sort: e.target.value })}
                        >
                          {[
                            "Recommended",
                            "Price: low to high",
                            "Price: high to low",
                          ].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <div className="view-toggle">
                        <button
                          aria-label="Grid view"
                          aria-pressed={view === "grid"}
                          className={view === "grid" ? "active" : ""}
                          onClick={() => setView("grid")}
                        >
                          <LayoutGrid size={15} />
                        </button>
                        <button
                          aria-label="Map view"
                          aria-pressed={view === "map"}
                          className={view === "map" ? "active" : ""}
                          onClick={() => setView("map")}
                        >
                          <Map size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {presets.length > 0 && (
                    <div className="saved-searches">
                      <span>Your searches</span>
                      {presets.map((p) => (
                        <span key={p.name}>
                          <button onClick={() => setFilters(p.filters)}>
                            {p.name}
                          </button>
                          <button
                            aria-label={`Delete saved search ${p.name}`}
                            onClick={() => {
                              const next = presets.filter(
                                (x) => x.name !== p.name,
                              );
                              setPresets(next);
                              storeLocal("scarlet-searches", next);
                            }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {view === "map" && (
                    <Suspense
                      fallback={
                        <div className="loading-state">Loading map…</div>
                      }
                    >
                      <HomeMap
                        homes={filtered}
                        onOpen={openDetail}
                        demo={c.demo}
                      />
                    </Suspense>
                  )}
                  {filtered.length > 0 ? (
                    <div
                      className={`homes-grid ${view === "map" ? "map-cards" : ""}`}
                    >
                      {filtered.map((h) => (
                        <HomeCard
                          key={h.id}
                          home={h}
                          demo={c.demo}
                          saved={c.saves.includes(h.id)}
                          comparing={compare.includes(h.id)}
                          onSave={() => void c.toggleSave(h.id)}
                          onCompare={() => toggleCompare(h.id)}
                          onOpen={() => openDetail(h)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Empty
                      title={
                        isSaved
                          ? "Make a little room for your favorites."
                          : "A fresh search might do the trick."
                      }
                      action={
                        <button
                          className="button secondary"
                          onClick={() => {
                            setFilters(initialFilters);
                            if (isSaved) navigate("/");
                          }}
                        >
                          {isSaved ? "Explore homes" : "Clear filters"}
                        </button>
                      }
                    >
                      {isSaved
                        ? "Tap the heart on a home to keep it here."
                        : c.demo
                          ? "Try another campus, a wider budget, or fewer filters."
                          : "No member homes match yet. Share a home or try another search."}
                    </Empty>
                  )}
                  <p className="inventory-note">
                    {c.demo
                      ? "Sample rent is per person, per month. Photos and locations are illustrative; these homes are not available to rent."
                      : "Rent is per person, per month as entered by posters. Listings are not reviewed or guaranteed by Scarlet Pad."}
                  </p>
                </section>
                <aside className="guide-rail">
                  <section className="guide-card">
                    <div className="guide-top">
                      <span className="icon-tile">
                        <Users size={20} />
                      </span>
                      <span className="tiny-label">BETTER TOGETHER</span>
                    </div>
                    <h3>
                      Great roommates.
                      <br />
                      <em>Even better stories.</em>
                    </h3>
                    <p>
                      Find people who share your pace, your plans, and your idea
                      of home.
                    </p>
                    <Link className="rail-link" to="/roommates">
                      Find your people
                      <ArrowRight size={16} />
                    </Link>
                    <div className="roommate-peek">
                      <span className="avatar avatar-0">M</span>
                      <span className="avatar avatar-1">J</span>
                      <span className="avatar avatar-2">A</span>
                      <span className="peek-plus">
                        <Plus size={17} />
                      </span>
                    </div>
                    <small>
                      {c.demo
                        ? "Meet the sample community"
                        : "Make a new connection"}
                    </small>
                  </section>
                  <section className="planner-card">
                    <CalendarDays size={22} />
                    <span className="tiny-label">THINKING ON-CAMPUS?</span>
                    <h3>
                      Less guesswork.
                      <br />
                      More game plan.
                    </h3>
                    <p>
                      Your group, your next steps, your housing plan. All in one
                      place.
                    </p>
                    <Link to="/planner">
                      Open the housing planner
                      <ArrowUpRight size={16} />
                    </Link>
                  </section>
                  <div className="rail-note">
                    <ShieldCheck size={18} />
                    <div>
                      <strong>A community with care.</strong>
                      <p>
                        Rutgers email sign-in. Private shortlists. Connections
                        on your terms.
                      </p>
                      <Link to="/resources">
                        How Scarlet Pad works
                        <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          ) : path === "/roommates" ? (
            <Roommates
              c={c}
              onEdit={() => requireMember(() => setProfile(true))}
              onConnect={onConnect}
            />
          ) : path === "/planner" ? (
            <Planner key={c.user?.id || "demo"} community={c} />
          ) : path === "/inbox" ? (
            <Inbox c={c} />
          ) : path === "/resources" ? (
            <Resources />
          ) : (
            <Empty
              title="This page hasn’t found its home."
              action={
                <Link className="button primary" to="/">
                  Back to homes
                </Link>
              }
            >
              Head back to the housing explorer.
            </Empty>
          )}
          <footer className="footer">
            <span>Made for the in-between, and what comes next.</span>
            <div>
              <span>© {new Date().getFullYear()} Scarlet Pad</span>
              <Link to="/resources">About & privacy</Link>
              <External href={officialHousing}>Rutgers Residence Life</External>
            </div>
          </footer>
        </main>
      </div>
      {compare.length > 0 && isHomes && (
        <div className="compare-tray">
          <span className="compare-tray-icon">
            <LayoutGrid size={18} />
          </span>
          <div>
            <strong>
              {selected.length} {selected.length === 1 ? "home" : "homes"} on
              your comparison
            </strong>
            <small>Good decisions start with the details.</small>
          </div>
          <button className="text-button" onClick={() => setCompare([])}>
            Clear
          </button>
          <button
            className="button primary"
            disabled={selected.length < 2}
            onClick={() => setComparison(true)}
          >
            Compare homes
            <ArrowRight size={15} />
          </button>
        </div>
      )}
      {auth && <AuthModal close={() => setAuth(false)} />}
      {create && c.user && <ListingForm c={c} close={() => setCreate(false)} />}
      {profile && c.user && (
        <RoommateForm c={c} close={() => setProfile(false)} />
      )}
      {connect && c.user && (
        <ConnectForm c={c} target={connect} close={() => setConnect(null)} />
      )}
      {presetOpen && (
        <Modal
          open
          onClose={() => setPresetOpen(false)}
          title="Keep this search close."
          description="Save these filters on this device so you can pick up where you left off."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveSearch();
            }}
          >
            <label className="field">
              Give your search a name
              <input
                required
                maxLength={40}
                placeholder="My College Ave shortlist"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
              />
            </label>
            <p className="fineprint">
              Saved searches remember filters. Email alerts are not enabled.
            </p>
            <button className="button primary full">
              Save search
              <Check size={16} />
            </button>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal
          open
          wide
          onClose={() => setDetail(null)}
          title={detail.title}
          description={`${detail.campus} · ${detail.location}`}
        >
          <div className="detail-image">
            {detail.photo_url ? (
              <img
                src={detail.photo_url}
                alt={
                  c.demo
                    ? "Illustrative apartment interior"
                    : `Photo provided for ${detail.title}`
                }
              />
            ) : (
              <House size={50} />
            )}
            <span>
              {c.demo
                ? "Illustrative photo · Sample home"
                : "Member listing · No property verification"}
            </span>
          </div>
          <div className="detail-body">
            <div>
              <div className="detail-price">
                {money(detail.price)}
                <span> / person / month</span>
              </div>
              <p>{detail.description}</p>
              <div className="detail-facts">
                <span>{detail.bedrooms} bedrooms</span>
                <span>{detail.bathrooms} bathrooms</span>
                <span>{detail.lease_term}</span>
              </div>
              <div className="tags">
                {detail.features.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
              <p className="fineprint">
                Available from{" "}
                {new Date(
                  `${detail.available_from}T12:00:00`,
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                .{" "}
                {c.demo
                  ? "Sample date only."
                  : "Confirm availability and terms with the poster."}
              </p>
            </div>
            <aside className="cost-card">
              <h3>Know your monthly total</h3>
              <p>
                <span>Rent per person</span>
                <strong>{money(detail.price)}</strong>
              </p>
              <p>
                <span>Estimated utilities</span>
                <strong>{money(detail.utilities)}</strong>
              </p>
              <p className="total">
                <span>Estimated total</span>
                <strong>{money(detail.price + detail.utilities)}</strong>
              </p>
              <small>
                Other fees or transport costs may apply.{" "}
                {c.demo
                  ? "All amounts are fictional."
                  : "Estimates provided by the poster."}
              </small>
            </aside>
          </div>
          <div className="detail-actions">
            <button
              className="button secondary"
              onClick={() => void c.toggleSave(detail.id)}
            >
              <Heart
                size={16}
                fill={c.saves.includes(detail.id) ? "currentColor" : "none"}
              />
              {c.saves.includes(detail.id)
                ? "Saved to shortlist"
                : "Save this home"}
            </button>
            {detail.user_id === c.user?.id ? (
              <button
                disabled={deleting}
                className="button primary"
                onClick={() =>
                  confirmDelete ? void deleteHome() : setConfirmDelete(true)
                }
              >
                {deleting
                  ? "Removing…"
                  : confirmDelete
                    ? "Confirm removal"
                    : "Remove my listing"}
              </button>
            ) : (
              <button
                className="button primary"
                onClick={() => {
                  setDetail(null);
                  onConnect(detail);
                }}
              >
                Connect with the poster
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </Modal>
      )}
      {comparison && (
        <Modal
          open
          wide
          onClose={() => setComparison(false)}
          title="A clearer picture of home."
          description="Compare the practical details, then go with what feels right."
        >
          <div className="comparison-scroll">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>THE DETAILS</th>
                  {selected.map((h) => (
                    <th key={h.id}>{h.title}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Campus", (h: Home) => h.campus],
                  ["Rent / person / month", (h: Home) => money(h.price)],
                  ["Estimated utilities", (h: Home) => money(h.utilities)],
                  [
                    "Estimated monthly total",
                    (h: Home) => money(h.price + h.utilities),
                  ],
                  ["Bedrooms", (h: Home) => h.bedrooms],
                  ["Bathrooms", (h: Home) => h.bathrooms],
                  ["Lease", (h: Home) => h.lease_term],
                  [
                    "Amenities",
                    (h: Home) => h.features.join(", ") || "Not provided",
                  ],
                ].map(([label, fn]) => (
                  <tr key={label as string}>
                    <th>{label as string}</th>
                    {selected.map((h) => (
                      <td key={h.id}>
                        {(fn as (h: Home) => string | number)(h)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="fineprint">
            {c.demo
              ? "All homes and amounts are fictional samples."
              : "Confirm all costs and terms before signing a lease."}
          </p>
        </Modal>
      )}
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Workspace />
      <Toaster position="bottom-right" richColors closeButton />
    </BrowserRouter>
  );
}
