// Native fetch is available in Node 18+

async function testLogin() {
    try {
        console.log('Attempting login...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@manshik.com',
                password: 'Admin@12345'
            })
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

        if (response.ok && data.success) {
            console.log('✓ Login endpoint is working correctly.');
        } else {
            console.log('✗ Login endpoint failed.');
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

testLogin();
