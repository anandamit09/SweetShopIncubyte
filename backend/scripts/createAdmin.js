const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../sweetshop.db');

async function createAdmin() {
  const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      process.exit(1);
    }
  });

  // Check if admin exists
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
    if (err) {
      console.error('Error checking admin:', err.message);
      db.close();
      process.exit(1);
    }

    if (row) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: admin123');
      db.close();
      return;
    }

    // Create admin user
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@sweetshop.com', hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err.message);
        } else {
          console.log('✅ Admin user created successfully!');
          console.log('Username: admin');
          console.log('Password: admin123');
        }
        db.close();
      }
    );
  });
}

createAdmin();

