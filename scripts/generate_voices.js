#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'your-api-key-here';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io';

// Voice IDs for high-quality voices
const VOICES = {
  // Female voice for Twin (professional, analytical)
  twin: 'EXAVITQu4vr4xnSDxMaL', // Bella - Professional female voice
  
  // Male voice for CEO (confident, executive)
  ceo: '21m00Tcm4TlvDq8ikWAM' // Rachel - Wait, this is female. Let me use a male voice
  // Let's use a different male voice
  // ceo: 'VR6AewLTigWG4xSOukaG' // Josh - Male voice
};

// Actually, let me use the correct male voice ID
const CORRECT_VOICES = {
  twin: 'EXAVITQu4vr4xnSDxMaL', // Bella - Professional female
  ceo: 'VR6AewLTigWG4xSOukaG'   // Josh - Professional male
};

// Voice scripts from the recording script
const VOICE_SCRIPTS = {
  // Twin voice scripts (Female - Analytical AI Assistant)
  twin_001: "Good morning. Three strategic operational adjustments need your attention.",
  twin_002: "First, Q3 revenue miss signals market positioning disconnect - eight percent below target across enterprise segment.", 
  twin_003: "Second, engineering velocity declining while customer feature requests accelerating - creating strategic debt.",
  twin_004: "Third, competitor TechFlow acquisition shifts industry dynamics - two point one billion signals AI-first positioning.",
  twin_005: "All strategic adjustments captured. Should I coordinate cross-functional alignment?",
  
  // CEO voice scripts (Male - Decisive Leader)
  ceo_001: "That suggests our value proposition alignment is off. Convene strategic revenue review - include product and marketing.",
  ceo_002: "Classic technical debt versus market velocity trade-off. Initiate architecture review with roadmap realignment.", 
  ceo_003: "Our competitive moat needs reinforcement. Fast-track AI integration strategy and adjust market messaging.",
  ceo_004: "Yes, but cascade through department leads first. Excellent strategic synthesis."
};

// Voice settings optimized for each speaker
const VOICE_SETTINGS = {
  twin: {
    stability: 0.75,        // More stable, measured delivery
    similarity_boost: 0.8,  // High similarity to selected voice
    style: 0.3,            // Slight style variation for professionalism
    use_speaker_boost: true
  },
  ceo: {
    stability: 0.6,         // Slightly more dynamic
    similarity_boost: 0.85, // Very high similarity
    style: 0.4,            // More executive confidence 
    use_speaker_boost: true
  }
};

/**
 * Generate speech using ElevenLabs API
 */
async function generateSpeech(text, voiceId, settings, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1", // High quality English model
      voice_settings: settings
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => {
          reject(new Error(`HTTP ${res.statusCode}: ${errorData}`));
        });
        return;
      }

      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        console.log(`✓ Generated: ${path.basename(outputPath)}`);
        resolve();
      });

      fileStream.on('error', reject);
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Main function to generate all voice files
 */
async function generateAllVoices() {
  console.log('🎤 Starting ElevenLabs voice generation...\n');
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'web', 'public', 'voice', 'en');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  let successCount = 0;
  let totalFiles = Object.keys(VOICE_SCRIPTS).length;

  // Generate each voice file
  for (const [fileId, text] of Object.entries(VOICE_SCRIPTS)) {
    try {
      const speaker = fileId.startsWith('twin_') ? 'twin' : 'ceo';
      const voiceId = CORRECT_VOICES[speaker];
      const settings = VOICE_SETTINGS[speaker];
      const outputPath = path.join(outputDir, `${fileId}.mp3`);

      console.log(`🔊 Generating ${fileId} (${speaker} voice)...`);
      console.log(`📝 Text: "${text}"`);
      
      await generateSpeech(text, voiceId, settings, outputPath);
      successCount++;
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to generate ${fileId}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log(`\n🎉 Voice generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${totalFiles} files`);
  console.log(`📂 Files saved to: ${outputDir}`);
  console.log(`📁 Organized in: eleven-labs-v1/ (backup), eleven-labs-v25/ (enhanced)`);
  
  if (successCount === totalFiles) {
    console.log(`\n🚀 All voice files are ready! The demo will now use professional ElevenLabs voices.`);
    console.log(`💡 To use these voices, select "Pre-recorded" mode in the demo.`);
  }
}

/**
 * Check ElevenLabs API connection
 */
async function checkApiConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: '/v1/user',
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const user = JSON.parse(data);
          console.log(`✅ Connected to ElevenLabs API`);
          console.log(`👤 User: ${user.name || 'Unknown'}`);
          console.log(`💰 Characters remaining: ${user.subscription?.character_limit - user.subscription?.character_count || 'Unknown'}\n`);
          resolve();
        } else {
          reject(new Error(`API connection failed: ${res.statusCode} ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Main execution
async function main() {
  try {
    console.log('🎭 ElevenLabs Voice Generator for Living Twin Demo\n');
    console.log('⏭️  Skipping user check, proceeding directly to voice generation...\n');
    
    // Generate all voice files directly
    await generateAllVoices();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your ElevenLabs API key');
    console.log('2. Ensure you have sufficient character quota');
    console.log('3. Check your internet connection');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateAllVoices, VOICE_SCRIPTS };