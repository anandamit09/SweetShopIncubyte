const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../sweetshop.db');

const sweets = [
  {
    name: 'Matcha Mochi',
    category: 'Mochi',
    price: 3.50,
    quantity: 10,
    image: '/images/MatchaMochi.jpg'
  },
  {
    name: 'Sakura Dango',
    category: 'Dango',
    price: 4.00,
    quantity: 8,
    image: '/images/SakuraDango.jpg'
  },
  {
    name: 'Yuzu Cheesecake',
    category: 'Cheesecake',
    price: 5.50,
    quantity: 6,
    image: '/images/YUzuCheeseCake.jpg'
  },
  {
    name: 'Anmitsu Bowl',
    category: 'Dessert Bowl',
    price: 6.00,
    quantity: 5,
    image: '/images/AnmitsuBowl.jpg'
  },
  {
    name: 'Red Bean Taiyaki',
    category: 'Taiyaki',
    price: 3.00,
    quantity: 12,
    image: '/images/taiyakifish.jpg'
  }
];

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to database');
    seedSweets();
  }
});

function seedSweets() {
  // Check if sweets already exist
  db.get('SELECT COUNT(*) as count FROM sweets', [], (err, row) => {
    if (err) {
      console.error('Error checking sweets:', err.message);
      db.close();
      process.exit(1);
    }

    if (row.count > 0) {
      console.log(`Database already has ${row.count} sweets.`);
      console.log('To re-seed, delete existing sweets first or use API to add more.');
      db.close();
      return;
    }

    console.log('Adding initial sweets to database...\n');
    
    let completed = 0;
    const total = sweets.length;
    
    sweets.forEach((sweet) => {
      db.run(
        'INSERT INTO sweets (name, category, price, quantity, image) VALUES (?, ?, ?, ?, ?)',
        [sweet.name, sweet.category, sweet.price, sweet.quantity, sweet.image],
        function(err) {
          completed++;
          if (err) {
            console.error(`✗ Error adding ${sweet.name}:`, err.message);
          } else {
            console.log(`✓ Added: ${sweet.name} - $${sweet.price} (ID: ${this.lastID})`);
          }
          
          // Close after all sweets are processed
          if (completed === total) {
            console.log(`\n✅ Successfully seeded ${completed} sweets!`);
            db.close();
          }
        }
      );
    });
  });
}

