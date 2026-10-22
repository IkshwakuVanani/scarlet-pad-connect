import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
export default function LocationPicker({
  onChange,
}: {
  onChange: (point: [number, number] | null) => void;
}) {
  const element = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const marker = useRef<L.CircleMarker | null>(null);
  function choose(point: L.LatLng) {
    if (!mapRef.current) return;
    marker.current?.remove();
    marker.current = L.circleMarker(point, {
      radius: 10,
      color: "#ad283b",
      fillColor: "#ad283b",
      fillOpacity: 0.5,
    }).addTo(mapRef.current);
    onChange([Number(point.lat.toFixed(6)), Number(point.lng.toFixed(6))]);
  }
  useEffect(() => {
    if (!element.current) return;
    const map = L.map(element.current, {
      scrollWheelZoom: false,
      zoomAnimation: false,
      fadeAnimation: false,
      markerZoomAnimation: false,
    }).setView([40.51, -74.454], 13);
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);
    map.on("click", (e) => choose(e.latlng));
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      map.stop();
      map.remove();
      mapRef.current = null;
    };
    // onChange is the stable React state setter passed by ListingForm.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange]);
  return (
    <div>
      <div
        ref={element}
        style={{ height: 220, borderRadius: 8, zIndex: 1 }}
        aria-label="Choose an approximate neighborhood pin"
      />
      <div className="picker-actions">
        <button
          type="button"
          className="text-button"
          onClick={() => {
            if (mapRef.current) choose(mapRef.current.getCenter());
          }}
        >
          Use the map center
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            marker.current?.remove();
            onChange(null);
          }}
        >
          Remove pin
        </button>
      </div>
    </div>
  );
}
