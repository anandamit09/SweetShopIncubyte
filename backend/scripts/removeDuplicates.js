const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../sweetshop.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to database');
    removeDuplicates();
  }
});

function removeDuplicates() {
  // Get all sweets
  db.all('SELECT * FROM sweets ORDER BY id', [], (err, rows) => {
    if (err) {
      console.error('Error fetching sweets:', err.message);
      db.close();
      process.exit(1);
    }

    // Group by name to find duplicates
    const nameMap = {};
    const toDelete = [];

    rows.forEach((row) => {
      if (!nameMap[row.name]) {
        nameMap[row.name] = [row];
      } else {
        nameMap[row.name].push(row);
      }
    });

    // For each duplicate, keep the first one (lowest ID), mark others for deletion
    Object.keys(nameMap).forEach((name) => {
      const sweets = nameMap[name];
      if (sweets.length > 1) {
        // Sort by ID, keep the first one
        sweets.sort((a, b) => a.id - b.id);
        // Mark all except the first for deletion
        for (let i = 1; i < sweets.length; i++) {
          toDelete.push(sweets[i].id);
        }
      }
    });

    if (toDelete.length === 0) {
      console.log('No duplicates found!');
      db.close();
      return;
    }

    console.log(`Found ${toDelete.length} duplicate(s) to remove...`);

    // Delete duplicates
    let deleted = 0;
    toDelete.forEach((id) => {
      db.run('DELETE FROM sweets WHERE id = ?', [id], function(err) {
        if (err) {
          console.error(`Error deleting sweet ID ${id}:`, err.message);
        } else {
          deleted++;
          console.log(`✓ Deleted duplicate ID: ${id}`);
        }

        if (deleted === toDelete.length) {
          console.log(`\n✅ Successfully removed ${deleted} duplicate(s)!`);
          db.close();
        }
      });
    });
  });
}

