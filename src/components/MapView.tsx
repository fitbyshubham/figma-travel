import { useEffect, useRef, useState } from 'react';
import { Itinerary } from '../types';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  itineraries: Itinerary[];
  onMarkerClick: (itinerary: Itinerary) => void;
  selectedItinerary?: Itinerary | null;
}

// Default center (world view)
const DEFAULT_CENTER = { lat: 20, lng: 0 };
const DEFAULT_ZOOM = 2;

export function MapView({ itineraries, onMarkerClick, selectedItinerary }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [mapError, setMapError] = useState(false);

  // Location coordinates for each itinerary (approximate)
  const locationCoords: Record<string, { lat: number; lng: number }> = {
    'Paris, France': { lat: 48.8566, lng: 2.3522 },
    'Kyoto, Japan': { lat: 35.0116, lng: 135.7681 },
    'Bali, Indonesia': { lat: -8.3405, lng: 115.0920 },
    'Iceland': { lat: 64.9631, lng: -19.0208 },
    'Vietnam': { lat: 21.0285, lng: 105.8542 },
    'Dubai, UAE': { lat: 25.2048, lng: 55.2708 }
  };

  useEffect(() => {
    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      setMapError(true);
      return;
    }

    if (!mapRef.current || googleMapRef.current) return;

    // Initialize map
    try {
      const map = new google.maps.Map(mapRef.current, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#1a1a2e' }]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#1a1a2e' }]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8b92ab' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0f1419' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#4e4e6e' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#2a2a3e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }]
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#4e4e6e' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      });

      googleMapRef.current = map;

      // Add markers for each itinerary
      itineraries.forEach((itinerary) => {
        const coords = locationCoords[itinerary.location];
        if (coords) {
          const marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: itinerary.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#a855f7',
              fillOpacity: 0.9,
              strokeColor: '#ffffff',
              strokeWeight: 2
            },
            animation: google.maps.Animation.DROP
          });

          // Create info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1a1a2e;">
                  ${itinerary.title}
                </h3>
                <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">
                  ${itinerary.location}
                </p>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
                  ${itinerary.duration} • €${itinerary.price}
                </p>
                <button 
                  onclick="window.handleMarkerClick('${itinerary.id}')"
                  style="
                    background: linear-gradient(to right, #06b6d4, #a855f7);
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    cursor: pointer;
                    width: 100%;
                  "
                >
                  View Itinerary
                </button>
              </div>
            `
          });

          marker.addListener('click', () => {
            // Close all other info windows
            markersRef.current.forEach(m => {
              if (m !== marker && (m as any).infoWindow) {
                (m as any).infoWindow.close();
              }
            });
            
            infoWindow.open(map, marker);
            onMarkerClick(itinerary);
          });

          // Store info window reference
          (marker as any).infoWindow = infoWindow;
          markersRef.current.push(marker);
        }
      });

      // Set up global click handler for info window buttons
      (window as any).handleMarkerClick = (itineraryId: string) => {
        const itinerary = itineraries.find(i => i.id === itineraryId);
        if (itinerary) {
          onMarkerClick(itinerary);
        }
      };

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [itineraries, onMarkerClick]);

  // Handle selected itinerary change
  useEffect(() => {
    if (!googleMapRef.current || !selectedItinerary) return;

    const coords = locationCoords[selectedItinerary.location];
    if (coords) {
      googleMapRef.current.panTo(coords);
      googleMapRef.current.setZoom(10);
    }
  }, [selectedItinerary]);

  if (mapError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center p-8 max-w-lg">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-violet-400" />
            </div>
            <h3 className="text-2xl mb-3 text-white">Interactive Map Available</h3>
            <p className="text-gray-400 mb-2">
              Connect Google Maps API to view itinerary locations on an interactive map
            </p>
          </div>
          
          <div className="text-left bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-violet-500/20 mb-4">
            <h4 className="text-sm mb-3 text-white">Setup Instructions:</h4>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Get a free API key from Google Cloud Console</li>
              <li>Open <code className="text-cyan-400 bg-gray-800 px-2 py-1 rounded">index.html</code></li>
              <li>Replace <code className="text-cyan-400 bg-gray-800 px-2 py-1 rounded">YOUR_GOOGLE_MAPS_API_KEY</code> with your key</li>
            </ol>
          </div>

          <a 
            href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
          >
            Get Free API Key →
          </a>

          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-xs text-gray-500 mb-2">
              💡 Showing {itineraries.length} itineraries across the world
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {itineraries.slice(0, 4).map(it => (
                <span key={it.id} className="text-xs px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  {it.location}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="absolute inset-0" />;
}
