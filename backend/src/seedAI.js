import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './utils/db.js';
import AIEngineConfig from './models/AIEngineConfig.js';
import { EMOTIONS_DATA, CRISIS_KEYWORDS, GLOBAL_TEMPLATES } from './ai-engine/engineData.js';

dotenv.config();

const seedAIConfig = async () => {
    try {
        await connectDB();

        console.log('Cleaning existing AI configuration...');
        await AIEngineConfig.deleteMany({});

        console.log('Seeding new AI engine configuration...');
        const config = new AIEngineConfig({
            emotions: EMOTIONS_DATA,
            crisisKeywords: CRISIS_KEYWORDS,
            globalTemplates: GLOBAL_TEMPLATES
        });

        await config.save();

        console.log('✓ AI Engine Configuration Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('✗ Error seeding AI configuration:', error);
        process.exit(1);
    }
};

seedAIConfig();
