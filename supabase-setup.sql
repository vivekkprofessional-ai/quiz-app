-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Create the leaderboard table
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct_ids TEXT[] DEFAULT '{}',
  wrong_ids TEXT[] DEFAULT '{}',
  date TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create index for fast date lookups
CREATE INDEX idx_leaderboard_date ON leaderboard(date);

-- 3. Enable Row Level Security (required by Supabase)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 4. Allow public read/insert (anon key can read and insert)
CREATE POLICY "Allow public read" ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON leaderboard FOR INSERT WITH CHECK (true);

-- 5. Seed sample data
INSERT INTO leaderboard (name, school, level, score, date, timestamp) VALUES
  -- April 10
  ('Aarav Sharma', 'Delhi Public School', 'E', 9, '2026-04-10', '2026-04-10T09:15:00Z'),
  ('Priya Patel', 'Kendriya Vidyalaya', 'M', 8, '2026-04-10', '2026-04-10T09:30:00Z'),
  ('Rohan Gupta', 'St. Xavier''s College', 'VE', 10, '2026-04-10', '2026-04-10T10:00:00Z'),
  ('Sneha Reddy', 'Navodaya Vidyalaya', 'E', 7, '2026-04-10', '2026-04-10T10:15:00Z'),
  ('Vikram Singh', 'Army Public School', 'M', 8, '2026-04-10', '2026-04-10T10:45:00Z'),
  ('Ananya Iyer', 'DAV Public School', 'VE', 9, '2026-04-10', '2026-04-10T11:00:00Z'),
  ('Karan Mehta', 'Ryan International', 'E', 6, '2026-04-10', '2026-04-10T11:30:00Z'),
  ('Divya Nair', 'Amity International', 'M', 7, '2026-04-10', '2026-04-10T12:00:00Z'),
  ('Arjun Verma', 'Modern School', 'VE', 8, '2026-04-10', '2026-04-10T12:30:00Z'),
  ('Meera Joshi', 'Springdales School', 'E', 5, '2026-04-10', '2026-04-10T13:00:00Z'),
  ('Rahul Kumar', 'La Martiniere', 'M', 6, '2026-04-10', '2026-04-10T13:30:00Z'),
  ('Ishita Das', 'Bishop Cotton School', 'VE', 7, '2026-04-10', '2026-04-10T14:00:00Z'),
  -- April 11
  ('Siddharth Rao', 'IIT Kanpur', 'M', 10, '2026-04-11', '2026-04-11T08:00:00Z'),
  ('Kavya Menon', 'Christ University', 'E', 9, '2026-04-11', '2026-04-11T08:30:00Z'),
  ('Aditya Chopra', 'Hindu College', 'VE', 8, '2026-04-11', '2026-04-11T09:00:00Z'),
  ('Nisha Agarwal', 'Miranda House', 'M', 9, '2026-04-11', '2026-04-11T09:45:00Z'),
  ('Varun Tiwari', 'BHU', 'E', 7, '2026-04-11', '2026-04-11T10:15:00Z'),
  ('Riya Saxena', 'Fergusson College', 'VE', 10, '2026-04-11', '2026-04-11T10:45:00Z'),
  ('Manish Yadav', 'SRCC', 'M', 6, '2026-04-11', '2026-04-11T11:30:00Z'),
  ('Pooja Bhatt', 'Lady Shri Ram', 'E', 8, '2026-04-11', '2026-04-11T12:00:00Z'),
  ('Nikhil Sinha', 'St. Stephen''s', 'VE', 7, '2026-04-11', '2026-04-11T12:30:00Z'),
  ('Tanvi Mishra', 'Loyola College', 'M', 5, '2026-04-11', '2026-04-11T13:00:00Z'),
  ('Sameer Khan', 'Jamia Millia', 'E', 6, '2026-04-11', '2026-04-11T13:30:00Z'),
  ('Deepika Pillai', 'Stella Maris', 'VE', 9, '2026-04-11', '2026-04-11T14:00:00Z'),
  ('Harsh Pandey', 'Allahabad University', 'M', 8, '2026-04-11', '2026-04-11T14:30:00Z'),
  -- April 12
  ('Ayush Jain', 'IIM Ahmedabad', 'M', 10, '2026-04-12', '2026-04-12T07:30:00Z'),
  ('Shruti Deshmukh', 'Pune University', 'E', 9, '2026-04-12', '2026-04-12T08:00:00Z'),
  ('Raj Malhotra', 'Hansraj College', 'VE', 8, '2026-04-12', '2026-04-12T08:45:00Z'),
  ('Ankita Banerjee', 'Jadavpur University', 'M', 9, '2026-04-12', '2026-04-12T09:15:00Z'),
  ('Gaurav Dubey', 'Lucknow University', 'E', 7, '2026-04-12', '2026-04-12T10:00:00Z'),
  ('Pallavi Kaur', 'Guru Nanak Dev', 'VE', 10, '2026-04-12', '2026-04-12T10:30:00Z'),
  ('Vivek Rathore', 'MS University Baroda', 'M', 6, '2026-04-12', '2026-04-12T11:00:00Z'),
  ('Neha Kulkarni', 'Symbiosis', 'E', 8, '2026-04-12', '2026-04-12T11:45:00Z'),
  ('Amit Choudhary', 'NIT Trichy', 'VE', 7, '2026-04-12', '2026-04-12T12:15:00Z'),
  ('Ritika Srivastava', 'Banaras Hindu University', 'M', 5, '2026-04-12', '2026-04-12T12:45:00Z'),
  -- April 13
  ('Arnav Kapoor', 'Modern Academy', 'E', 9, '2026-04-13', '2026-04-13T07:00:00Z'),
  ('Simran Bhatia', 'Sacred Heart', 'M', 8, '2026-04-13', '2026-04-13T07:30:00Z'),
  ('Kunal Thakur', 'Mayo College', 'VE', 10, '2026-04-13', '2026-04-13T08:00:00Z');
