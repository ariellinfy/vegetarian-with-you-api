CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS reviews (
review_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
restaurant_id uuid NOT NULL,
review_title VARCHAR(100) NOT NULL,
review_body text NOT NULL,
food_rate float(2) NOT NULL,
service_rate float(2) NOT NULL,
value_rate float(2) NOT NULL,
ambiance_rate float(2) NOT NULL,
overall_rate float(2) NOT NULL,
visit_period VARCHAR(20) NOT NULL,
type_of_visit VARCHAR(10) NOT NULL,
price_range VARCHAR(20) NOT NULL,
recommended_dishes text,
disclosure BOOLEAN NOT NULL,
create_at TIMESTAMP NOT NULL,
last_modified TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_restaurant
FOREIGN KEY(restaurant_id)
REFERENCES restaurants (restaurant_id)
ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
restaurant_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
restaurant_name VARCHAR(100) UNIQUE,
address text NOT NULL,
city VARCHAR(100) NOT NULL,
region VARCHAR(100) NOT NULL,
country VARCHAR(100) NOT NULL,
postal_code VARCHAR(100) NOT NULL,
phone text,
website text,
type VARCHAR(10) NOT NULL,
cuisine VARCHAR(20) NOT NULL,
breakfast VARCHAR(10) NOT NULL,
brunch VARCHAR(10) NOT NULL,
lunch VARCHAR(10) NOT NULL,
dinner VARCHAR(10) NOT NULL,
free_wifi VARCHAR(10) NOT NULL,
delivery VARCHAR(10) NOT NULL,
exclude_pungent VARCHAR(10) NOT NULL,
create_at TIMESTAMP NOT NULL,
last_modified TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS login (
login_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
hash VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
public_name VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL,
location VARCHAR(50),
contributions INT NOT NULL DEFAULT 0,
joined TIMESTAMP NOT NULL,
last_login TIMESTAMP NOT NULL DEFAULT NOW(),
last_modified TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_user
FOREIGN KEY(email)
REFERENCES users (email)
ON DELETE CASCADE
);
