-- Script SQL pour créer les tables nécessaires au système de périodes
-- À exécuter dans votre base de données MySQL (taskflow)

-- Table periods
CREATE TABLE IF NOT EXISTS periods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Modifier la table tasks pour ajouter period_id
-- Si la colonne n'existe pas déjà
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS period_id INT,
ADD FOREIGN KEY (period_id) REFERENCES periods(id) ON DELETE RESTRICT,
ADD INDEX idx_period_id (period_id);

-- Note: Si vous avez déjà des données dans tasks, vous devrez :
-- 1. Créer des périodes pour vos utilisateurs
-- 2. Mettre à jour les tâches existantes avec un period_id valide
-- 3. Ensuite rendre period_id NOT NULL si nécessaire
