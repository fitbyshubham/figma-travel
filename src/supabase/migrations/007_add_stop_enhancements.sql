-- =============================================
-- Migration: Add Enhanced Stop Features
-- Adds price breakdown, transport details, and hotel info to stops
-- =============================================

-- Add new JSONB columns to itinerary_stops table
ALTER TABLE itinerary_stops 
  ADD COLUMN IF NOT EXISTS price_breakdown JSONB,
  ADD COLUMN IF NOT EXISTS transport_details JSONB,
  ADD COLUMN IF NOT EXISTS hotel_info JSONB;

-- Add comments for documentation
COMMENT ON COLUMN itinerary_stops.price_breakdown IS 'Array of price items: [{id, description, cost}]';
COMMENT ON COLUMN itinerary_stops.transport_details IS 'Transport information: {mode, cost, howToGetThere, bookingInfo}';
COMMENT ON COLUMN itinerary_stops.hotel_info IS 'Hotel details from Booking.com: {name, checkIn, checkOut, bookingComUrl, bookingComId, pricePerNight, rating, address, available, imageUrl}';

-- Create indexes for JSONB fields (for faster queries)
CREATE INDEX IF NOT EXISTS itinerary_stops_price_breakdown_idx ON itinerary_stops USING GIN(price_breakdown);
CREATE INDEX IF NOT EXISTS itinerary_stops_transport_details_idx ON itinerary_stops USING GIN(transport_details);
CREATE INDEX IF NOT EXISTS itinerary_stops_hotel_info_idx ON itinerary_stops USING GIN(hotel_info);

-- Function to calculate total cost for a stop (including all price breakdown items)
CREATE OR REPLACE FUNCTION calculate_stop_total_cost(stop_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  total_cost DECIMAL(10, 2) := 0;
  item JSONB;
BEGIN
  -- Sum up price breakdown items
  FOR item IN 
    SELECT jsonb_array_elements(price_breakdown) 
    FROM itinerary_stops 
    WHERE id = stop_id
  LOOP
    total_cost := total_cost + COALESCE((item->>'cost')::DECIMAL(10, 2), 0);
  END LOOP;
  
  -- Add transport cost if exists
  SELECT total_cost + COALESCE((transport_details->>'cost')::DECIMAL(10, 2), 0)
  INTO total_cost
  FROM itinerary_stops
  WHERE id = stop_id;
  
  -- Add hotel cost if exists (pricePerNight * number of nights)
  SELECT total_cost + COALESCE((hotel_info->>'pricePerNight')::DECIMAL(10, 2), 0)
  INTO total_cost
  FROM itinerary_stops
  WHERE id = stop_id;
  
  RETURN COALESCE(total_cost, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate total itinerary cost (sum of all stops)
CREATE OR REPLACE FUNCTION calculate_itinerary_total_cost(itin_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  total DECIMAL(10, 2) := 0;
BEGIN
  SELECT SUM(calculate_stop_total_cost(id))
  INTO total
  FROM itinerary_stops
  WHERE itinerary_id = itin_id;
  
  RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Sample data structure examples (as comments for reference)
/*

Example price_breakdown:
[
  {
    "id": "pb1",
    "description": "Entrance ticket",
    "cost": 25.50
  },
  {
    "id": "pb2",
    "description": "Lunch",
    "cost": 35.00
  }
]

Example transport_details:
{
  "mode": "Train",
  "cost": 45.00,
  "howToGetThere": "Take the RER B from CDG Airport to Chatelet-Les Halles, then transfer to Metro Line 1",
  "bookingInfo": "Book tickets via SNCF website or buy at station"
}

Example hotel_info:
{
  "id": "123456",
  "name": "Hotel Eiffel Turenne",
  "checkIn": "2025-06-15",
  "checkOut": "2025-06-16",
  "bookingComUrl": "https://www.booking.com/hotel/fr/eiffel-turenne.html",
  "bookingComId": "123456",
  "pricePerNight": 185.00,
  "rating": 8.2,
  "address": "20 Avenue de Tourville, 7th arr., 75007 Paris, France",
  "available": true,
  "imageUrl": "https://..."
}

*/
