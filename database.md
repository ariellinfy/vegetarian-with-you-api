CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_feedbacks (
feedback_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
user_id uuid NOT NULL,
review_id uuid NOT NULL,
restaurant_id uuid NOT NULL,
user_helpful BOOLEAN NOT NULL DEFAULT false,
user_report INT NOT NULL DEFAULT 0,
CONSTRAINT fk_restaurant
FOREIGN KEY(restaurant_id)
REFERENCES restaurants (restaurant_id)
ON DELETE CASCADE,
CONSTRAINT fk_review
FOREIGN KEY(review_id)
REFERENCES reviews (review_id)
ON DELETE CASCADE,
CONSTRAINT fk_user
FOREIGN KEY(user_id)
REFERENCES users (user_id)
ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
review_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
restaurant_id uuid NOT NULL,
review_title VARCHAR(100) NOT NULL,
review_body text NOT NULL,
food_rate float(2) NOT NULL,
service_rate float(2) NOT NULL,
value_rate float(2) NOT NULL,
atmosphere_rate float(2) NOT NULL,
overall_rate float(2) NOT NULL,
visit_period VARCHAR(20) NOT NULL,
type_of_visit VARCHAR(10) NOT NULL,
price_range float(1) NOT NULL,
photos text,
recommended_dishes text,
helpful_count INT NOT NULL DEFAULT 0,
report_count INT NOT NULL DEFAULT 0,
report_text text,
disclosure BOOLEAN NOT NULL,
create_at TIMESTAMP NOT NULL,
review_owner uuid NOT NULL,
last_modified TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_restaurant
FOREIGN KEY(restaurant_id)
REFERENCES restaurants (restaurant_id)
ON DELETE CASCADE,
CONSTRAINT fk_user
FOREIGN KEY(review_owner)
REFERENCES users (user_id)
ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restaurants (
restaurant_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
restaurant_name VARCHAR(100) UNIQUE NOT NULL,
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
takeout VARCHAR(10) NOT NULL,
delivery VARCHAR(10) NOT NULL,
exclude_pungent VARCHAR(10) NOT NULL,
overall_rate float(2) NOT NULL,
food_rate float(2) NOT NULL,
service_rate float(2) NOT NULL,
value_rate float(2) NOT NULL,
atmosphere_rate float(2) NOT NULL,
price_range float(1) NOT NULL,
review_count BIGINT NOT NULL,
create_at TIMESTAMP NOT NULL,
create_by uuid,
last_modified TIMESTAMP NOT NULL DEFAULT NOW(),
last_modified_by uuid,
CONSTRAINT fk_user_create
FOREIGN KEY(create_by)
REFERENCES users (user_id)
ON DELETE SET NULL,
CONSTRAINT fk_user_modify
FOREIGN KEY(last_modified_by)
REFERENCES users (user_id)
ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS login (
login_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
hash VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL,
last_modified TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
user_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
public_name VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL,
location VARCHAR(50),
contributions INT NOT NULL DEFAULT 0,
avatar text,
joined TIMESTAMP NOT NULL,
last_login TIMESTAMP NOT NULL DEFAULT NOW(),
last_modified TIMESTAMP NOT NULL DEFAULT NOW(),
CONSTRAINT fk_login
FOREIGN KEY(email)
REFERENCES login (email)
ON DELETE CASCADE
);
