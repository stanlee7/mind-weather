import fs from 'fs';
import path from 'path';

// Manual env parsing
const envPath = path.join(process.cwd(), '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error('Error reading .env.local:', e.message);
}

if (!apiKey) {
    console.error('API Key not found in .env.local. Please check your .env.local file.');
    process.exit(1);
}

console.log('Using API Key:', apiKey.substring(0, 5) + '...');
console.log('Fetching available models via REST API...');

async function fetchModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error('REST API Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response Body:', text);
            return;
        }

        const data = await response.json();
        console.log('\n--- Available Models ---');
        if (data.models) {
            data.models.forEach(m => {
                // Filter for models that support content generation
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`Name: ${m.name}`);
                    console.log(`Display: ${m.displayName}`);
                    console.log('---');
                }
            });
        } else {
            console.log('No models found in response:', data);
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

fetchModels();
