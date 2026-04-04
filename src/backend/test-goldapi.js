// Test script based on user's snippet
// Using native fetch (Node 18+)
// But let's try to use the user's exact logic structure.

async function testGoldApi() {
    console.log("Testing GoldAPI with user's snippet...");

    var myHeaders = {
        "x-access-token": "goldapi-3gssmipo4jj7-io",
        "Content-Type": "application/json"
    };

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://www.goldapi.io/api/XAU/INR", requestOptions);
        const result = await response.text();
        console.log("Response:", result);
    } catch (error) {
        console.log('error', error);
    }
}

testGoldApi();
