-- Seed Data for AI-Powered Travel Recommendation Platform

-- 1. Sample User
INSERT INTO users (id, email, password_hash, full_name, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'demo@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6Lruj3vjPGga31lW', 'Demo Traveler', 'TOURIST')
ON CONFLICT (email) DO NOTHING;

-- 2. User Preferences
INSERT INTO user_preferences (user_id, preferred_categories, budget_range, travel_style, dietary_restrictions)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '["nature", "mountain", "food", "photography"]'::jsonb, 'medium', 'balanced', '["vegetarian"]')
ON CONFLICT DO NOTHING;

-- 3. Destinations
INSERT INTO destinations (id, name, location, description, category, rating, image_url, coordinates, best_time_to_visit, average_daily_cost)
VALUES 
  ('22222222-2222-2222-2222-222222222221', 'Ooty', 'Tamil Nadu, India', 'Queen of Hill Stations set in the Nilgiri Hills featuring tea gardens, mist, and scenic botanical views.', 'Nature', 4.80, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4102, "lng": 76.6950}'::jsonb, 'October to June', 3500.00),
  ('22222222-2222-2222-2222-222222222222', 'Munnar', 'Kerala, India', 'Breathtaking hill station covered with rolling green tea plantations and cool mountain air.', 'Nature', 4.90, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', '{"lat": 10.0889, "lng": 77.0595}'::jsonb, 'September to March', 4000.00),
  ('22222222-2222-2222-2222-222222222223', 'Goa', 'Goa, India', 'Tropical paradise known for golden beaches, nightlife, heritage churches, and seafood.', 'Beach', 4.70, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', '{"lat": 15.2993, "lng": 74.1240}'::jsonb, 'November to February', 5000.00),
  ('22222222-2222-2222-2222-222222222224', 'Paris', 'France', 'The City of Light famed for the Eiffel Tower, art museums, world-class gastronomy, and romance.', 'Cultural', 4.90, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', '{"lat": 48.8566, "lng": 2.3522}'::jsonb, 'June to August', 18000.00),
  ('22222222-2222-2222-2222-222222222225', 'Tokyo', 'Japan', 'Ultra-modern metropolis blending neon skyscrapers, historical temples, and unrivaled food culture.', 'Urban', 4.95, 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80', '{"lat": 35.6762, "lng": 139.6503}'::jsonb, 'March to May', 16000.00)
ON CONFLICT (id) DO NOTHING;

-- 4. Places for Ooty
INSERT INTO places (id, destination_id, name, category, description, opening_hours, ticket_price, rating, image_url, coordinates, recommended_duration_hours)
VALUES 
  ('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Botanical Gardens', 'Sightseeing', 'Lush 55-acre garden featuring rare trees, fossil trees, and exotic flower shows.', '{"open": "07:00", "close": "18:30"}'::jsonb, 50.00, 4.70, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4140, "lng": 76.7118}'::jsonb, 2.5),
  ('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', 'Ooty Lake & Boathouse', 'Boating', 'Picturesque artificial lake offering pedal boats, rowboats, and scenic surrounding pine trees.', '{"open": "09:00", "close": "18:00"}'::jsonb, 30.00, 4.50, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4060, "lng": 76.6890}'::jsonb, 2.0),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 'Doddabetta Peak', 'Viewpoint', 'Highest peak in the Nilgiri Hills with a telescope house offering panoramic valley views.', '{"open": "09:00", "close": "17:30"}'::jsonb, 20.00, 4.80, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4010, "lng": 76.7360}'::jsonb, 3.0)
ON CONFLICT (id) DO NOTHING;

-- 5. Hotels for Ooty
INSERT INTO hotels (id, destination_id, name, price_per_night, rating, amenities, address, image_url, coordinates, contact_phone)
VALUES 
  ('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221', 'Savoy IHCL SeleQtions', 12500.00, 4.80, '["Free WiFi", "Breakfast Included", "Heritage Garden", "Spa", "Fireplace"]'::jsonb, '77 Sylks Road, Ooty', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4090, "lng": 76.6970}'::jsonb, '+91 423 2225500'),
  ('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222221', 'Sterling Ooty Fern Hill', 5800.00, 4.60, '["Free WiFi", "Valley View", "Restaurant", "Game Room"]'::jsonb, 'Fern Hill, Ooty', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', '{"lat": 11.3990, "lng": 76.6900}'::jsonb, '+91 423 2444444')
ON CONFLICT (id) DO NOTHING;

-- 6. Restaurants for Ooty
INSERT INTO restaurants (id, destination_id, name, cuisine, price_range, average_cost_per_person, rating, address, image_url, coordinates)
VALUES 
  ('55555555-5555-5555-5555-555555555551', '22222222-2222-2222-2222-222222222221', 'Nahar South Indian Restaurant', 'South Indian Vegetarian', '$', 250.00, 4.70, 'Charing Cross, Commercial Road, Ooty', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4120, "lng": 76.7030}'::jsonb),
  ('55555555-5555-5555-5555-555555555552', '22222222-2222-2222-2222-222222222221', 'Earls Secret', 'Continental & Indian', '$$$', 800.00, 4.80, 'King’s Cliff, Havelock Road, Ooty', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', '{"lat": 11.4170, "lng": 76.7010}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 7. Activities for Ooty
INSERT INTO activities (id, destination_id, name, duration, price, category, rating, image_url)
VALUES 
  ('66666666-6666-6666-6666-666666666661', '22222222-2222-2222-2222-222222222221', 'Nilgiri Mountain Railway Toy Train Ride', '3 Hours', 300.00, 'Heritage Ride', 4.90, 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'),
  ('66666666-6666-6666-6666-666666666662', '22222222-2222-2222-2222-222222222221', 'Tea Factory & Chocolate Tasting Tour', '2 Hours', 150.00, 'Cultural Tour', 4.60, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- 8. Sample Trip for Demo User
INSERT INTO trips (id, user_id, title, destination_name, start_date, end_date, total_budget, estimated_cost, status)
VALUES 
  ('77777777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111', 'Scenic 3-Day Ooty Getaway', 'Ooty', '2026-09-10', '2026-09-12', 20000.00, 14200.00, 'planned')
ON CONFLICT (id) DO NOTHING;
