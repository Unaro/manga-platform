#!/bin/bash

# Test API endpoints for Users module

BASE_URL="http://localhost:3000"

echo "í·ª Testing Users API Endpoints"
echo "================================"

# Test registration
echo ""
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "displayName": "Test User"
  }')

echo "Response: ${REGISTER_RESPONSE}"
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)

# Test login
echo ""
echo "2. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: ${LOGIN_RESPONSE}"

# Test get user
echo ""
echo "3. Testing get user..."
if [ -n "$USER_ID" ]; then
  GET_USER_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/users/${USER_ID}")
  echo "Response: ${GET_USER_RESPONSE}"
else
  echo "Skipped - no user ID"
fi

# Test update profile
echo ""
echo "4. Testing update profile..."
if [ -n "$USER_ID" ]; then
  UPDATE_RESPONSE=$(curl -s -X PUT "${BASE_URL}/api/users/${USER_ID}" \
    -H "Content-Type: application/json" \
    -d '{
      "displayName": "Updated Name",
      "bio": "This is my bio"
    }')
  echo "Response: ${UPDATE_RESPONSE}"
else
  echo "Skipped - no user ID"
fi

echo ""
echo "================================"
echo "âœ… API tests completed!"
