USE vaccine_registration;

-- USER TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    role ENUM('User', 'Admin', 'Staff') DEFAULT 'User',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VACCINE TABLE
CREATE TABLE IF NOT EXISTS vaccines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    description TEXT,
    dosage VARCHAR(255),
    age_group VARCHAR(100),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VACCINE CENTER TABLE
CREATE TABLE IF NOT EXISTS vaccine_centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VACCINE INVENTORY TABLE

CREATE TABLE IF NOT EXISTS vaccine_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vaccine_id INT NOT NULL,
    center_id INT NOT NULL,
    batch_number VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES vaccine_centers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vaccine_batch (vaccine_id, batch_number) -- Composite unique constraint
);


-- APPOINTMENT TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    center_id INT NOT NULL,
    dosage_number INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('scheduled', 'completed', 'rejected', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES vaccine_centers(id) ON DELETE CASCADE
);