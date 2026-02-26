-- Insert sample shops and products for testing
INSERT INTO public.shops (id, name, description, address, latitude, longitude, phone, email, category, owner_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Raj Medical & General Store', 'Complete medical and general items store', '123 Main Street, Delhi', 28.6139, 77.2090, '+91-9876543210', 'raj@medical.com', 'Medical', NULL),
('550e8400-e29b-41d4-a716-446655440002', 'Fresh Fruits Corner', 'Fresh fruits and vegetables daily', '456 Market Road, Mumbai', 19.0760, 72.8777, '+91-9876543211', 'fresh@fruits.com', 'Grocery', NULL),
('550e8400-e29b-41d4-a716-446655440003', 'Tech Electronics Hub', 'Latest electronics and gadgets', '789 Tech Street, Bangalore', 12.9716, 77.5946, '+91-9876543212', 'tech@electronics.com', 'Electronics', NULL);

-- Insert sample products
INSERT INTO public.products (shop_id, name, description, price, category, stock_quantity) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Paracetamol 500mg', 'Pain relief tablets', 25.00, 'Medicine', 100),
('550e8400-e29b-41d4-a716-446655440001', 'Hand Sanitizer', 'Alcohol-based sanitizer 500ml', 120.00, 'Healthcare', 50),
('550e8400-e29b-41d4-a716-446655440001', 'Digital Thermometer', 'Accurate digital thermometer', 350.00, 'Medical Device', 25),
('550e8400-e29b-41d4-a716-446655440002', 'Fresh Apples', 'Red delicious apples per kg', 180.00, 'Fruits', 200),
('550e8400-e29b-41d4-a716-446655440002', 'Bananas', 'Fresh bananas per dozen', 60.00, 'Fruits', 150),
('550e8400-e29b-41d4-a716-446655440002', 'Tomatoes', 'Fresh tomatoes per kg', 40.00, 'Vegetables', 100),
('550e8400-e29b-41d4-a716-446655440003', 'Smartphone', 'Latest Android smartphone', 15999.00, 'Mobile', 10),
('550e8400-e29b-41d4-a716-446655440003', 'Bluetooth Headphones', 'Wireless bluetooth headphones', 2499.00, 'Audio', 30),
('550e8400-e29b-41d4-a716-446655440003', 'Power Bank', '10000mAh portable charger', 1299.00, 'Accessories', 40);
