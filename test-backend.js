// Simple test script to verify backend endpoints
const BASE_URL = 'http://localhost:8080';

async function testBackend() {
    console.log('Testing backend endpoints...\n');
    
    // Test 1: Hello endpoint
    try {
        console.log('1. Testing /games/hello endpoint...');
        const helloResponse = await fetch(`${BASE_URL}/games/hello`);
        console.log('   Status:', helloResponse.status);
        if (helloResponse.ok) {
            const helloText = await helloResponse.text();
            console.log('   Response:', helloText);
        }
    } catch (error) {
        console.error('   Error:', error.message);
    }
    
    // Test 2: Start game endpoint
    try {
        console.log('\n2. Testing /games/start endpoint...');
        const startResponse = await fetch(`${BASE_URL}/games/start`);
        console.log('   Status:', startResponse.status);
        if (startResponse.ok) {
            const startData = await startResponse.json();
            console.log('   Number of cards:', startData.length);
            if (startData.length > 0) {
                console.log('   First card structure:');
                console.log('     cardCode:', startData[0].cardCode, '(', typeof startData[0].cardCode, ')');
                console.log('     cardNumbers:', startData[0].cardNumbers);
                console.log('     cardNumbers type:', typeof startData[0].cardNumbers);
                console.log('     cardNumbers length:', startData[0].cardNumbers.length);
                if (startData[0].cardNumbers.length > 0) {
                    console.log('     First row type:', typeof startData[0].cardNumbers[0]);
                    console.log('     First row length:', startData[0].cardNumbers[0].length);
                }
            }
        }
    } catch (error) {
        console.error('   Error:', error.message);
    }
    
    // Test 3: User registration
    try {
        console.log('\n3. Testing /users/register endpoint...');
        const userData = {
            telegramId: 123456789,
            phoneNumber: '+1234567890',
            userName: 'testuser',
            firstName: 'Test',
            lastName: 'User'
        };
        
        const registerResponse = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        console.log('   Status:', registerResponse.status);
        if (registerResponse.ok) {
            const registerText = await registerResponse.text();
            console.log('   Response:', registerText);
        } else {
            const errorText = await registerResponse.text();
            console.log('   Error Response:', errorText);
        }
    } catch (error) {
        console.error('   Error:', error.message);
    }
    
    // Test 4: Get user by telegram ID
    try {
        console.log('\n4. Testing /users/123456789 endpoint...');
        const userResponse = await fetch(`${BASE_URL}/users/123456789`);
        console.log('   Status:', userResponse.status);
        if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('   Response:', userData);
        } else {
            const errorText = await userResponse.text();
            console.log('   Error Response:', errorText);
        }
    } catch (error) {
        console.error('   Error:', error.message);
    }
    
    // Test 5: Join game endpoint
    try {
        console.log('\n5. Testing /games/join endpoint...');
        
        // First get the actual card data from the backend
        const cardResponse = await fetch(`${BASE_URL}/games/start`);
        const cards = await cardResponse.json();
        const firstCard = cards[0];
        
        console.log('   Using card data from backend:');
        console.log('     cardCode:', firstCard.cardCode);
        console.log('     cardNumbers:', firstCard.cardNumbers);
        
        const joinData = {
            telegramId: 123456789,
            selectedCardCode: firstCard.cardCode,  // Use the actual cardCode from backend
            cardNumbers: firstCard.cardNumbers    // Use the actual cardNumbers from backend
        };
        
        const joinResponse = await fetch(`${BASE_URL}/games/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(joinData)
        });
        
        console.log('   Status:', joinResponse.status);
        if (joinResponse.ok) {
            const joinResult = await joinResponse.json();
            console.log('   Response:', joinResult);
        } else {
            const errorText = await joinResponse.text();
            console.log('   Error Response:', errorText);
        }
    } catch (error) {
        console.error('   Error:', error.message);
    }
    
    console.log('\nBackend testing completed!');
}

// Run the test
testBackend().catch(console.error);
