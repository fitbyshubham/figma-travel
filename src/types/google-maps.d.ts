// Google Maps API TypeScript declarations
// This allows TypeScript to recognize the google.maps namespace

interface Window {
  google: typeof google;
  handleMarkerClick: (itineraryId: string) => void;
}

declare namespace google.maps {
  // Add any additional Google Maps types you need here
  // The main types are already provided by @types/google.maps if installed
}
