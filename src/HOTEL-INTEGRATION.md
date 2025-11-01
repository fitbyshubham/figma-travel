# 🏨 Booking.com Hotel Integration Guide

## Overview

Narfe now includes Booking.com hotel integration that allows creators to add hotel recommendations to their itineraries with real-time availability and pricing information.

---

## Features

### For Creators

When creating an itinerary, creators can:

1. **Search Hotels** - Search Booking.com directly from the itinerary creation flow
2. **View Availability** - See real-time availability for their travel dates
3. **Add Price Details** - Include accommodation costs in the total trip breakdown
4. **Share Booking Links** - Provide direct links for users to book the same hotel

### For Users

When viewing itineraries, users can:

1. **See Hotel Recommendations** - View where the creator stayed
2. **Check Availability** - See if the hotel is available for their dates
3. **Compare Prices** - View nightly rates and ratings
4. **Book Directly** - Click through to Booking.com to make reservations

---

## Setup Instructions

### Step 1: Get RapidAPI Key

1. Go to https://rapidapi.com/DataCrawler/api/booking-com15/pricing
2. Sign up for a free account
3. Subscribe to the Booking.com API (free tier available with 100 requests/month)
4. Copy your RapidAPI key

### Step 2: Configure Environment Variable

Add your API key to Supabase secrets:

```bash
supabase secrets set BOOKING_COM_API_KEY=<your-rapidapi-key>
```

Or in the Figma Make environment:
- The system will prompt you to add the API key when hotel search is first used
- Click on the prompt to securely upload your key

### Step 3: Test the Integration

1. Navigate to Creator Dashboard
2. Start creating a new itinerary
3. Add a stop and expand the "Hotel / Accommodation" section
4. Search for a hotel (e.g., "Eiffel Tower Paris")
5. Select from the search results

---

## How It Works

### Technical Flow

```
1. Creator enters hotel search query
   ↓
2. Frontend sends request to /make-server-183d2340/hotels/search
   ↓
3. Backend calls Booking.com API via RapidAPI
   ↓
4. Results returned with:
   - Hotel names and addresses
   - Ratings and reviews
   - Pricing per night
   - Availability status
   - Direct booking links
   ↓
5. Creator selects hotel and it's attached to the stop
   ↓
6. Users see hotel info when viewing the itinerary
```

### Data Stored

For each hotel, the following information is saved:

```typescript
{
  name: string;              // Hotel name
  checkIn: string;           // ISO date string
  checkOut: string;          // ISO date string
  bookingComUrl: string;     // Direct booking link
  bookingComId: string;      // Booking.com hotel ID
  pricePerNight: number;     // Price in EUR
  rating: number;            // Review score (0-10)
  address: string;           // Full address
  available: boolean;        // Availability status
  imageUrl: string;          // Hotel thumbnail
}
```

---

## API Endpoints

### Search Hotels

**POST** `/make-server-183d2340/hotels/search`

Request body:
```json
{
  "query": "Eiffel Tower Paris",
  "checkIn": "2025-06-15",
  "checkOut": "2025-06-16",
  "latitude": 48.8584,    // Optional
  "longitude": 2.2945     // Optional
}
```

Response:
```json
{
  "hotels": [
    {
      "id": "123456",
      "name": "Hotel Eiffel Turenne",
      "bookingComUrl": "https://www.booking.com/hotel/...",
      "pricePerNight": 185,
      "rating": 8.2,
      "address": "20 Avenue de Tourville, Paris",
      "imageUrl": "https://...",
      "available": true,
      "checkIn": "2025-06-15",
      "checkOut": "2025-06-16"
    }
  ]
}
```

### Get Hotel Details

**GET** `/make-server-183d2340/hotels/:hotelId?checkIn=2025-06-15&checkOut=2025-06-16`

Returns detailed information for a specific hotel.

---

## Additional Features Added

### 1. Price Breakdown

Creators can now add itemized costs for each stop:

- Entrance fees
- Activity costs
- Meal expenses
- Transportation costs
- Any other expenses

The system automatically calculates and displays the total cost.

### 2. Transport Details

For each stop, creators can specify:

- **Mode of Transport**: Flight, Train, Bus, Car/Taxi, or Walk
- **Cost**: Transportation expense
- **How to Get There**: Detailed instructions
- **Booking Info**: Links or tips for booking transport

### 3. Hotel Information

Integrated Booking.com search with:

- Real-time availability
- Pricing information
- Hotel ratings
- Direct booking links

---

## Cost Considerations

### RapidAPI Pricing (Booking.com API)

- **Free Tier**: 100 requests/month
- **Basic Plan**: $9.99/month for 1,000 requests
- **Pro Plan**: $49.99/month for 10,000 requests
- **Ultra Plan**: $299.99/month for 100,000 requests

**Recommendation**: Start with the free tier for testing. Upgrade to Basic when you have regular creator activity.

### Typical Usage

- **Per itinerary creation**: 3-10 API calls (if hotels are searched)
- **Per itinerary view**: 0 API calls (data is cached)
- **Monthly estimate**: 50-500 calls for 10-50 itineraries with hotels

---

## Error Handling

The system gracefully handles:

1. **Missing API Key**: Shows user-friendly error message
2. **API Rate Limits**: Displays notification to try again later
3. **No Results**: Suggests trying different search terms
4. **Network Errors**: Retries automatically and shows error toast

---

## User Experience

### Creator Flow

1. Click "Add" button in Hotel section
2. Type hotel name in search box
3. Press Enter or click Search button
4. View results with photos, ratings, and prices
5. Click on a hotel to select it
6. Hotel information is saved with the stop
7. Can remove hotel by clicking the X button

### User Flow

1. View itinerary
2. See hotel recommendations for each stop
3. View pricing, ratings, and availability
4. Click "Book Now" to visit Booking.com
5. Make reservation directly on Booking.com

---

## Future Enhancements

Potential improvements for the hotel integration:

1. **Date Range Flexibility**: Allow users to check different date ranges
2. **Price Alerts**: Notify users when prices drop
3. **Alternative Hotels**: Suggest similar hotels in the area
4. **Affiliate Revenue**: Earn commissions through Booking.com affiliate program
5. **Multi-Language**: Support hotel searches in different languages
6. **Currency Conversion**: Display prices in user's preferred currency

---

## Troubleshooting

### "API key not configured" Error

**Solution**: Add your RapidAPI key to environment variables:
```bash
supabase secrets set BOOKING_COM_API_KEY=<your-key>
```

### No Hotels Found

**Possible causes**:
1. Search query too specific - try broader terms
2. No availability for those dates - try different dates
3. Location not recognized - include city name

**Solutions**:
- Use simpler search terms (e.g., "Paris hotels" instead of "luxury boutique Paris 7th arrondissement")
- Try searching without dates
- Include landmark or neighborhood names

### Rate Limit Reached

**Solution**: 
- Upgrade your RapidAPI plan
- Implement client-side caching
- Batch hotel searches

---

## Best Practices

### For Creators

1. **Search Early**: Add hotels right after defining your stops
2. **Be Specific**: Include neighborhood or landmark names
3. **Check Dates**: Ensure check-in/out dates match your itinerary
4. **Add Context**: Mention why you recommend this specific hotel
5. **Verify Links**: Test booking links before publishing

### For Platform Operators

1. **Monitor Usage**: Track API call volume
2. **Cache Results**: Store hotel data to reduce API calls
3. **Rate Limiting**: Implement client-side rate limiting
4. **Error Logging**: Monitor failed searches to improve UX
5. **Affiliate Setup**: Consider Booking.com affiliate program for revenue

---

## Database Schema

The hotel information is stored within the `stops` table as a JSONB field:

```sql
-- stops table includes:
hotel_info JSONB,  -- Contains all hotel data
```

Example hotel_info structure:
```json
{
  "name": "Hotel Eiffel Turenne",
  "checkIn": "2025-06-15",
  "checkOut": "2025-06-16",
  "bookingComUrl": "https://www.booking.com/hotel/...",
  "bookingComId": "123456",
  "pricePerNight": 185,
  "rating": 8.2,
  "address": "20 Avenue de Tourville, Paris",
  "available": true,
  "imageUrl": "https://..."
}
```

---

## Support

For issues or questions:

1. Check the [API documentation](https://rapidapi.com/DataCrawler/api/booking-com15)
2. Review error logs in Supabase Dashboard
3. Contact RapidAPI support for API-specific issues
4. Review `/docs/api-endpoints.md` for backend details

---

**Happy Hotel Hunting! 🏨**
