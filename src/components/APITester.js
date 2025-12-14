import React, { useState } from 'react';
import { authAPI, sweetsAPI, inventoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './APITester.css';

function APITester() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (endpoint, method, response, error = null) => {
    setResults(prev => [{
      id: Date.now(),
      endpoint,
      method,
      response: error ? null : response,
      error: error ? error.message : null,
      timestamp: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const testHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/health');
      const data = await response.json();
      addResult('/health', 'GET', data);
    } catch (error) {
      addResult('/health', 'GET', null, error);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const username = `testuser${Date.now()}`;
      const result = await authAPI.register(username, `${username}@test.com`, 'password123');
      addResult('/api/auth/register', 'POST', result);
    } catch (error) {
      addResult('/api/auth/register', 'POST', null, error);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const result = await authAPI.login('admin', 'admin123');
      addResult('/api/auth/login', 'POST', result);
    } catch (error) {
      addResult('/api/auth/login', 'POST', null, error);
    }
    setLoading(false);
  };

  const testGetSweets = async () => {
    setLoading(true);
    try {
      const result = await sweetsAPI.getAll();
      addResult('/api/sweets', 'GET', result);
    } catch (error) {
      addResult('/api/sweets', 'GET', null, error);
    }
    setLoading(false);
  };

  const testSearchSweets = async () => {
    setLoading(true);
    try {
      const result = await sweetsAPI.search({ name: 'Matcha' });
      addResult('/api/sweets/search?name=Matcha', 'GET', result);
    } catch (error) {
      addResult('/api/sweets/search', 'GET', null, error);
    }
    setLoading(false);
  };

  const testAddSweet = async () => {
    setLoading(true);
    try {
      const result = await sweetsAPI.add({
        name: 'Test Sweet',
        category: 'Test',
        price: 5.50,
        quantity: 10,
        image: '/images/test.jpg'
      });
      addResult('/api/sweets', 'POST', result);
    } catch (error) {
      addResult('/api/sweets', 'POST', null, error);
    }
    setLoading(false);
  };

  const testPurchase = async (sweetId) => {
    setLoading(true);
    try {
      const result = await inventoryAPI.purchase(sweetId, 1);
      addResult(`/api/sweets/${sweetId}/purchase`, 'POST', result);
    } catch (error) {
      addResult(`/api/sweets/${sweetId}/purchase`, 'POST', null, error);
    }
    setLoading(false);
  };

  const seedInitialSweets = async () => {
    setLoading(true);
    const initialSweets = [
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

    let successCount = 0;
    let errorCount = 0;

    for (const sweet of initialSweets) {
      try {
        const result = await sweetsAPI.add(sweet);
        addResult('/api/sweets (Seed)', 'POST', { sweet: result, message: `Added: ${sweet.name}` });
        successCount++;
      } catch (error) {
        addResult('/api/sweets (Seed)', 'POST', null, new Error(`${sweet.name}: ${error.message}`));
        errorCount++;
      }
    }

    addResult('Seed Complete', 'INFO', {
      message: `Seeding complete! Success: ${successCount}, Errors: ${errorCount}`,
      total: initialSweets.length
    });
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="api-tester">
      <div className="api-tester-header">
        <h2>API Tester / Debug Tool</h2>
        <p>Test all backend API endpoints directly from the frontend</p>
        <div className="auth-status">
          <span className={isAuthenticated ? 'status-authenticated' : 'status-not-authenticated'}>
            {isAuthenticated ? `✓ Authenticated as: ${user?.username} (${user?.role})` : '✗ Not Authenticated'}
          </span>
        </div>
      </div>

      <div className="api-tester-actions">
        <div className="action-group">
          <h3>Public Endpoints</h3>
          <button onClick={testHealthCheck} disabled={loading}>
            Test Health Check
          </button>
        </div>

        <div className="action-group">
          <h3>Authentication</h3>
          <button onClick={testRegister} disabled={loading}>
            Test Register
          </button>
          <button onClick={testLogin} disabled={loading}>
            Test Login (Admin)
          </button>
        </div>

        <div className="action-group">
          <h3>Sweets API</h3>
          <button onClick={testGetSweets} disabled={loading || !isAuthenticated}>
            Get All Sweets {!isAuthenticated && '(Login Required)'}
          </button>
          <button onClick={testSearchSweets} disabled={loading || !isAuthenticated}>
            Search Sweets {!isAuthenticated && '(Login Required)'}
          </button>
          {isAdmin() && (
            <>
              <button onClick={testAddSweet} disabled={loading}>
                Add Sweet (Admin)
              </button>
              <button 
                onClick={seedInitialSweets} 
                disabled={loading}
                style={{ backgroundColor: '#7b2cbf' }}
              >
                🌱 Seed Initial 5 Sweets
              </button>
            </>
          )}
        </div>

        {isAuthenticated && (
          <div className="action-group">
            <h3>Inventory API</h3>
            <button 
              onClick={() => testPurchase(1)} 
              disabled={loading}
              title="Purchase sweet with ID 1"
            >
              Test Purchase
            </button>
          </div>
        )}

        <div className="action-group">
          <button onClick={clearResults} className="clear-btn">
            Clear Results
          </button>
        </div>
      </div>

      <div className="api-tester-results">
        <h3>API Test Results ({results.length})</h3>
        {results.length === 0 ? (
          <p className="no-results">No tests run yet. Click buttons above to test endpoints.</p>
        ) : (
          <div className="results-list">
            {results.map(result => (
              <div key={result.id} className={`result-item ${result.error ? 'error' : 'success'}`}>
                <div className="result-header">
                  <span className="result-method">{result.method}</span>
                  <span className="result-endpoint">{result.endpoint}</span>
                  <span className="result-time">{result.timestamp}</span>
                </div>
                {result.error ? (
                  <div className="result-error">
                    <strong>Error:</strong> {result.error}
                  </div>
                ) : (
                  <div className="result-response">
                    <strong>Response:</strong>
                    <pre>{JSON.stringify(result.response, null, 2)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="api-tester-info">
        <h3>How to Use:</h3>
        <ol>
          <li>Click "Test Health Check" to verify backend is running</li>
          <li>Click "Test Login" to authenticate (or use Register)</li>
          <li>After login, test other endpoints</li>
          <li>View responses in the results section below</li>
          <li>Take screenshots of successful API calls</li>
        </ol>
        <p><strong>Note:</strong> All API calls are made to <code>http://localhost:3001</code></p>
      </div>
    </div>
  );
}

export default APITester;

