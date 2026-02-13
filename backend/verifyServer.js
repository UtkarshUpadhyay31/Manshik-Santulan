
// Native fetch in Node 18+
async function checkServer() {
    try {
        console.log('Checking backend status...');
        const response = await fetch('http://localhost:5000/');
        if (response.ok) {
            console.log('✓ Backend is UP and responding.');
            const data = await response.json();
            console.log('Response:', data);
        } else {
            console.log('✗ Backend is responding with error:', response.status);
        }
    } catch (error) {
        console.log('✗ Backend is DOWN or unreachable.');
        console.log('Error:', error.message);
    }
}

checkServer();
