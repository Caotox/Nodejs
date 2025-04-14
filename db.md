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

ALTER TABLE comments
ADD CONSTRAINT fk_comments_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;



-- Requêtes à ajouter à db.md Titouan
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  issue_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (issue_id) REFERENCES issues(id),
  UNIQUE KEY unique_vote (user_id, issue_id)
);

ALTER TABLE issues
ADD COLUMN status ENUM('open', 'resolved') DEFAULT 'open',
ADD COLUMN votes_count INT DEFAULT 0;