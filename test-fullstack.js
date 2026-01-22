#!/usr/bin/env node

import axios from 'axios';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, 'backend/.env') });

const API_BASE = 'http://localhost:4000/api';
const FRONTEND_URL = 'http://localhost:5173';

class FullStackTester {
  constructor() {
    this.results = {
      database: { status: 'pending', details: [] },
      backend: { status: 'pending', details: [] },
      frontend: { status: 'pending', details: [] },
      integration: { status: 'pending', details: [] }
    };
  }

  log(section, message, status = 'info') {
    const timestamp = new Date().toISOString();
    const statusIcon = status === 'success' ? '✅' : status === 'error' ? '❌' : 'ℹ️';
    console.log(`${statusIcon} [${section.toUpperCase()}] ${message}`);
    this.results[section].details.push({ message, status, timestamp });
  }

  async testDatabase() {
    this.log('database', 'Testing database connection...');
    
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      });

      this.log('database', 'Database connection successful', 'success');

      // Test basic queries
      const [tables] = await connection.execute('SHOW TABLES');
      this.log('database', `Found ${tables.length} tables`, 'success');

      // Test users table
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      this.log('database', `Users table has ${users[0].count} records`, 'success');

      await connection.end();
      this.results.database.status = 'success';
      
    } catch (error) {
      this.log('database', `Database error: ${error.message}`, 'error');
      this.results.database.status = 'error';
    }
  }

  async testBackend() {
    this.log('backend', 'Testing backend API...');
    
    try {
      // Test server health
      const healthResponse = await axios.get('http://localhost:4000/');
      this.log('backend', 'Server health check passed', 'success');

      // Test auth endpoints
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123',
        first_name: 'Test',
        last_name: 'User'
      };

      // Test registration
      try {
        const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
        this.log('backend', 'User registration successful', 'success');
        
        // Test login
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        
        if (loginResponse.data.token) {
          this.log('backend', 'User login successful', 'success');
          
          // Test protected route
          const meResponse = await axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${loginResponse.data.token}` }
          });
          this.log('backend', 'Protected route access successful', 'success');
        }
        
      } catch (authError) {
        if (authError.response?.status === 409) {
          this.log('backend', 'User already exists, testing login only', 'info');
          
          const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
            email: testUser.email,
            password: testUser.password
          });
          this.log('backend', 'Existing user login successful', 'success');
        } else {
          throw authError;
        }
      }

      // Test other endpoints
      const endpoints = [
        '/students',
        '/teachers', 
        '/courses',
        '/departments'
      ];

      for (const endpoint of endpoints) {
        try {
          await axios.get(`${API_BASE}${endpoint}`);
          this.log('backend', `${endpoint} endpoint accessible`, 'success');
        } catch (error) {
          this.log('backend', `${endpoint} endpoint error: ${error.response?.status || error.message}`, 'error');
        }
      }

      this.results.backend.status = 'success';
      
    } catch (error) {
      this.log('backend', `Backend error: ${error.message}`, 'error');
      this.results.backend.status = 'error';
    }
  }

  async testFrontend() {
    this.log('frontend', 'Testing frontend availability...');
    
    try {
      const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
      this.log('frontend', 'Frontend server is running', 'success');
      this.results.frontend.status = 'success';
      
    } catch (error) {
      this.log('frontend', `Frontend not accessible: ${error.message}`, 'error');
      this.log('frontend', 'Make sure to run: cd frontend && npm run dev', 'info');
      this.results.frontend.status = 'error';
    }
  }

  async testIntegration() {
    this.log('integration', 'Testing full-stack integration...');
    
    if (this.results.database.status === 'success' && 
        this.results.backend.status === 'success') {
      this.log('integration', 'Database ↔ Backend integration working', 'success');
      
      if (this.results.frontend.status === 'success') {
        this.log('integration', 'Full-stack integration ready', 'success');
        this.results.integration.status = 'success';
      } else {
        this.log('integration', 'Backend ready, frontend needs to be started', 'info');
        this.results.integration.status = 'partial';
      }
    } else {
      this.log('integration', 'Integration issues detected', 'error');
      this.results.integration.status = 'error';
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('FULL-STACK TEST SUMMARY');
    console.log('='.repeat(50));
    
    Object.entries(this.results).forEach(([section, result]) => {
      const statusIcon = result.status === 'success' ? '✅' : 
                        result.status === 'partial' ? '⚠️' : '❌';
      console.log(`${statusIcon} ${section.toUpperCase()}: ${result.status}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log('QUICK START COMMANDS:');
    console.log('='.repeat(50));
    console.log('Backend: cd backend && npm run dev');
    console.log('Frontend: cd frontend && npm run dev');
    console.log('Database: Make sure MySQL is running');
    console.log('='.repeat(50));
  }

  async runAllTests() {
    console.log('🚀 Starting Full-Stack Test Suite...\n');
    
    await this.testDatabase();
    await this.testBackend();
    await this.testFrontend();
    await this.testIntegration();
    
    this.printSummary();
  }
}

// Run the tests
const tester = new FullStackTester();
tester.runAllTests().catch(console.error);