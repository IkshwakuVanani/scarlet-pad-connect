import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { money, type Home } from "../lib/model";
export default function HomeMap({
  homes,
  onOpen,
  demo,
}: {
  homes: Home[];
  onOpen: (h: Home) => void;
  demo: boolean;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, {
      scrollWheelZoom: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
    }).setView([40.51, -74.454], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    const bounds: L.LatLngTuple[] = [];
    homes.forEach((h) => {
      if (h.latitude === null || h.longitude === null) return;
      const point: L.LatLngTuple = [h.latitude, h.longitude];
      bounds.push(point);
      const button = document.createElement("button");
      button.textContent = money(h.price);
      button.className = "map-price";
      button.setAttribute(
        "aria-label",
        `View ${h.title}, ${money(h.price)} per month`,
      );
      button.addEventListener("click", () => onOpen(h));
      L.marker(point, {
        icon: L.divIcon({
          html: button,
          className: "price-marker",
          iconSize: [72, 32],
          iconAnchor: [36, 16],
        }),
      }).addTo(map);
    });
    if (bounds.length)
      map.fitBounds(L.latLngBounds(bounds).pad(0.3), {
        maxZoom: 14,
        animate: false,
      });
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      map.stop();
      map.remove();
    };
  }, [homes, onOpen]);
  return (
    <div className="map-wrap">
      <div
        ref={element}
        className="housing-map"
        aria-label="Map of housing locations"
      />
      <p>
        {demo
          ? "Sample markers show approximate neighborhoods, not available properties."
          : "Only homes with poster-provided coordinates appear. Confirm the exact address with the poster."}{" "}
        Basemap tiles require internet access.
      </p>
    </div>
  );
}
