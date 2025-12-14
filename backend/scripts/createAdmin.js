const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../sweetshop.db');

async function createAdmin() {
  const db = new sqlite3.Database(DB_PATH);
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.get('SELECT * FROM users WHERE role = ?', ['admin'], async (err, row) => {
    if (row) {
      console.log('Admin user already exists');
      db.close();
      return;
    }

    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      ['admin', 'admin@sweetshop.com', hashedPassword, 'admin'],
      function(err) {
        if (err) {
          console.error('Error creating admin user:', err);
        } else {
          console.log('Admin user created successfully!');
          console.log('Username: admin');
          console.log('Password: admin123');
        }
        db.close();
      }
    );
  });
}

createAdmin();

