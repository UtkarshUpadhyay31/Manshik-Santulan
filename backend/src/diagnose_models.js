import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Modify path to point to the .env in the backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function listModelsRaw() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking API Key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + "...)" : "Missing");

    if (!apiKey) {
        console.error("Error: GEMINI_API_KEY is missing in .env");
        process.exit(1);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log(`Fetching models from: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error("Error fetching models:", data);
            return;
        }

        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(model => {
                console.log(`- ${model.name} (${model.displayName})`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log("No models returned. Data:", data);
        }

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModelsRaw();
