// Test script to verify API connection
const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function testAPIConnection() {
    console.log('Testing API connection...');
    
    try {
        // Test root endpoint
        console.log('1. Testing root endpoint...');
        const rootResponse = await fetch('http://127.0.0.1:8000/');
        const rootData = await rootResponse.json();
        console.log('✅ Root endpoint working:', rootData);
        
        // Test categories endpoint
        console.log('2. Testing categories endpoint...');
        const categoriesResponse = await fetch(`${API_BASE_URL}/categories/`);
        if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json();
            console.log('✅ Categories endpoint working:', categoriesData);
        } else {
            console.log('❌ Categories endpoint failed:', categoriesResponse.status);
        }
        
        // Test discussions endpoint
        console.log('3. Testing discussions endpoint...');
        const discussionsResponse = await fetch(`${API_BASE_URL}/discussions/`);
        if (discussionsResponse.ok) {
            const discussionsData = await discussionsResponse.json();
            console.log('✅ Discussions endpoint working:', discussionsData);
        } else {
            console.log('❌ Discussions endpoint failed:', discussionsResponse.status);
        }
        
    } catch (error) {
        console.error('❌ API connection failed:', error);
        console.log('Make sure Django server is running on http://127.0.0.1:8000/');
    }
}

// Run the test
testAPIConnection();
