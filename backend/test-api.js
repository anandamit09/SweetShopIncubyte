/**
 * Simple API Test Script
 * Run this to test if your backend is working
 * Usage: node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Testing Sweet Shop Backend API...\n');

  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check...');
  try {
    const health = await makeRequest('GET', '/health');
    if (health.status === 200) {
      console.log('✅ Server is running!');
      console.log('   Response:', health.data);
    } else {
      console.log('❌ Health check failed:', health.status);
    }
  } catch (error) {
    console.log('❌ Server is NOT running!');
    console.log('   Error:', error.message);
    console.log('\n💡 Start the server with: cd backend && npm run dev');
    return;
  }

  console.log('\n2️⃣ Testing User Registration...');
  try {
    const register = await makeRequest('POST', '/api/auth/register', {
      username: 'testuser' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    if (register.status === 201) {
      console.log('✅ Registration successful!');
      console.log('   User:', register.data.user.username);
      console.log('   Token received:', register.data.token ? 'Yes' : 'No');
      return register.data.token;
    } else {
      console.log('❌ Registration failed:', register.data);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  console.log('\n3️⃣ Testing Login...');
  try {
    const login = await makeRequest('POST', '/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    if (login.status === 200) {
      console.log('✅ Login successful!');
      console.log('   User:', login.data.user.username);
      console.log('   Role:', login.data.user.role);
      const token = login.data.token;
      
      console.log('\n4️⃣ Testing Get All Sweets (Protected)...');
      const sweets = await makeRequest('GET', '/api/sweets', null, token);
      if (sweets.status === 200) {
        console.log('✅ Get sweets successful!');
        console.log('   Number of sweets:', Array.isArray(sweets.data) ? sweets.data.length : 0);
      } else {
        console.log('❌ Get sweets failed:', sweets.data);
      }

      console.log('\n5️⃣ Testing Add Sweet...');
      const newSweet = await makeRequest('POST', '/api/sweets', {
        name: 'Test Sweet',
        category: 'Test',
        price: 5.50,
        quantity: 10,
        image: '/images/test.jpg'
      }, token);
      if (newSweet.status === 201) {
        console.log('✅ Add sweet successful!');
        console.log('   Sweet ID:', newSweet.data.id);
        console.log('   Sweet Name:', newSweet.data.name);
      } else {
        console.log('❌ Add sweet failed:', newSweet.data);
      }

      return token;
    } else {
      console.log('❌ Login failed:', login.data);
      console.log('   Make sure admin user exists: npm run create-admin');
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  return null;
}

// Run tests
testAPI().then(() => {
  console.log('\n✨ API Testing Complete!');
  console.log('\n📝 Next Steps:');
  console.log('   - Check backend logs for detailed information');
  console.log('   - Use Postman or curl to test more endpoints');
  console.log('   - See SETUP.md for more examples');
}).catch(error => {
  console.error('Test failed:', error);
});

