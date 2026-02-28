import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapPlaceholder({ name, coordinates }) {
  const mapContainer = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [coordinates.lng, coordinates.lat],
      zoom: 13,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    // Custom marker
    const markerEl = document.createElement('div')
    markerEl.style.cssText = 'width:16px;height:16px;border-radius:50%;background:#6366F1;box-shadow:0 0 12px rgba(99,102,241,0.5);border:2px solid rgba(255,255,255,0.3);'

    new mapboxgl.Marker({ element: markerEl })
      .setLngLat([coordinates.lng, coordinates.lat])
      .setPopup(new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
        `<div style="font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#F4F4F5;padding:2px 4px;">${name}</div>`
      ))
      .addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [coordinates.lat, coordinates.lng, name])

  return (
    <div className="relative w-full h-full rounded-[10px] overflow-hidden border border-[#2A2A2E] min-h-[300px]">
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      <div className="absolute bottom-3 left-3 px-2 py-1 bg-[#161618]/80 backdrop-blur-sm rounded-[6px]">
        <span className="text-[11px] text-[#A1A1AA] font-medium">{name}</span>
        <span className="text-[10px] text-[#71717A] ml-2">
          {coordinates.lat.toFixed(2)}°N, {Math.abs(coordinates.lng).toFixed(2)}°W
        </span>
      </div>
    </div>
  )
}
