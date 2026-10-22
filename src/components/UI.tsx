import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  ArrowUpRight,
  House,
  MapPin,
  BedDouble,
  Bath,
  Heart,
  Check,
  Plus,
} from "lucide-react";
import type { ReactNode } from "react";
import { money, type Home } from "../lib/model";
export function Modal({
  title,
  description,
  children,
  open,
  onClose,
  wide = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className={`modal ${wide ? "wide" : ""}`}>
          <div className="modal-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description className={description ? "" : "sr-only"}>
                {description || title}
              </Dialog.Description>
            </div>
            <Dialog.Close className="icon-button" aria-label="Close dialog">
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function External({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}
export function Empty({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <House size={30} />
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function HomeCard({
  home: h,
  saved,
  comparing,
  onSave,
  onCompare,
  onOpen,
  demo,
}: {
  home: Home;
  saved: boolean;
  comparing: boolean;
  onSave: () => void;
  onCompare: () => void;
  onOpen: () => void;
  demo: boolean;
}) {
  return (
    <article className="home-card">
      <div className="home-photo">
        <button
          className="photo-link"
          onClick={onOpen}
          aria-label={`View ${h.title}`}
        >
          {h.photo_url ? (
            <img
              src={h.photo_url}
              alt={
                demo
                  ? "Illustrative apartment interior"
                  : `Photo provided for ${h.title}`
              }
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="no-photo">
              <House size={40} />
              <span>Photo not provided</span>
            </div>
          )}
        </button>
        <span className="photo-label">
          {demo ? "Sample home" : "Member listing"}
        </span>
        <button
          className={`save-button ${saved ? "active" : ""}`}
          aria-label={`${saved ? "Unsave" : "Save"} ${h.title}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="home-content">
        <div className="home-price">
          {money(h.price)}
          <span>/ person / month</span>
        </div>
        <button className="home-title" onClick={onOpen}>
          {h.title}
        </button>
        <p className="home-location">
          <MapPin size={13} />
          {h.location}
        </p>
        <div className="home-facts">
          <span>
            <BedDouble size={15} />
            {h.bedrooms} beds
          </span>
          <span>
            <Bath size={15} />
            {h.bathrooms} baths
          </span>
          <span>{h.lease_term}</span>
        </div>
        <div className="home-footer">
          <span className="campus-label">
            <span
              className={`campus-dot ${h.campus.split(" ")[0].toLowerCase()}`}
            />
            {h.campus}
          </span>
          <button
            className={`compare-link ${comparing ? "selected" : ""}`}
            onClick={onCompare}
            aria-pressed={comparing}
            aria-label={`${comparing ? "Remove" : "Compare"} ${h.title}`}
          >
            {comparing ? <Check size={14} /> : <Plus size={14} />}Compare
          </button>
        </div>
      </div>
    </article>
  );
}
