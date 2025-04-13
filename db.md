CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255),
  role VARCHAR(50)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issue_id INT,
  user_id INT,
  content TEXT,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
