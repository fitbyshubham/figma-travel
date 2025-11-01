# Google Maps Integration Setup

## Overview
The Narfe Explore page features an interactive Google Maps integration that displays all itineraries with clickable markers. When users hover over itinerary cards, the map zooms to that location.

## Features
- 🗺️ Interactive world map with dark theme styling
- 📍 Custom markers for each itinerary location
- 🎯 Click markers to view itinerary details
- 🔍 Auto-zoom when hovering over itinerary cards
- 💬 Info windows with itinerary previews

## Setup Instructions

### 1. Get a Google Maps API Key (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Maps JavaScript API**
4. Go to **Credentials** and create an API key
5. (Optional) Restrict your API key to your domain

### 2. Add the API Key to Your Project

Open `/index.html` and replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key:

```html
<script 
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places"
  async
  defer
></script>
```

### 3. That's It!

Refresh your app and navigate to the Explore page to see the interactive map in action!

## Without API Key

If you don't add an API key, the Explore page will show:
- A helpful setup instructions screen
- Links to get a free API key
- A list of all itinerary locations

## Map Features

### Current Locations
- Paris, France (48.8566, 2.3522)
- Kyoto, Japan (35.0116, 135.7681)
- Bali, Indonesia (-8.3405, 115.0920)
- Iceland (64.9631, -19.0208)
- Vietnam (21.0285, 105.8542)
- Dubai, UAE (25.2048, 55.2708)

### Customization

To add more locations, edit `/components/MapView.tsx`:

```typescript
const locationCoords: Record<string, { lat: number; lng: number }> = {
  'Your City, Country': { lat: 0.0000, lng: 0.0000 },
  // ... add more locations
};
```

## Troubleshooting

### Map not loading?
- Check if the Google Maps script is loaded in browser console
- Verify your API key is correct
- Make sure the Maps JavaScript API is enabled in Google Cloud Console

### Markers not appearing?
- Check if itinerary locations match the keys in `locationCoords`
- Open browser console for any errors

## Cost

Google Maps provides **$200 free credit per month**, which covers:
- Up to 28,000 map loads per month
- Plenty for development and small production apps

For production, consider:
- Setting up billing alerts
- Restricting API key to your domain
- Implementing usage monitoring

## Support

For Google Maps API questions, visit:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Information](https://mapsplatform.google.com/pricing/)
