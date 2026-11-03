USE smartpark_db;

-- 1. Base Tables (No Foreign Keys)
INSERT INTO Users (first_name, last_name, email, password_hash, role) VALUES
('Admin', 'User', 'admin@smartpark.com', 'hash_admin_123', 'Admin'),
('Dave', 'Teves', 'dave.t@email.com', 'hash_dave_456', 'Customer'),
('Rudylin', 'Tero', 'rudylin.t@email.com', 'hash_rudy_789', 'Customer');

INSERT INTO Parking_Zones (zone_name, floor_level, capacity, zone_type) VALUES
('Level 1 North', 1, 50, 'Standard'),
('Level 1 South', 1, 20, 'EV'),
('Level 2 VIP', 2, 30, 'VIP');
