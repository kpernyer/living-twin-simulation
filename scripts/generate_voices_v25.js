#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = 'sk_0e600072320c802a7ee6424cf8f3b08ab6ab569ae1b630bb';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io';

// Enhanced Voice IDs for more natural, conversational voices
const VOICES = {
  // Female voice for Twin (warm, friendly, professional)
  twin: 'EXAVITQu4vr4xnSDxMaL', // Bella - keeping same but with enhanced settings
  
  // Male voice for CEO (confident, executive)
  ceo: 'VR6AewLTigWG4xSOukaG'   // Josh - keeping same but with enhanced settings
};

// Enhanced Voice scripts with natural pauses and personality
const VOICE_SCRIPTS_V25 = {
  // Twin voice scripts (Female - Warm, Friendly Professional AI)
  twin_001: "Good morning Sir! Today we have three strategic operational adjustments that need your attention.",
  twin_002: "First... Q3 revenue miss signals market positioning disconnect - eight percent below target across enterprise segment.", 
  twin_003: "Second... engineering velocity declining while customer feature requests accelerating - creating strategic debt.",
  twin_004: "Third... competitor TechFlow acquisition shifts industry dynamics - two point one billion signals AI-first positioning.",
  twin_005: "Perfect! All strategic adjustments are captured. Should I coordinate the cross-functional alignment?",
  
  // CEO voice scripts (Male - Decisive Executive Leader)
  ceo_001: "That suggests our value proposition alignment is off. Convene strategic revenue review - include product and marketing.",
  ceo_002: "Classic technical debt versus market velocity trade-off. Initiate architecture review with roadmap realignment.", 
  ceo_003: "Our competitive moat needs reinforcement. Fast-track AI integration strategy and adjust market messaging.",
  ceo_004: "Yes, but cascade through department leads first. Excellent strategic synthesis."
};

// Enhanced voice settings with V2.5 optimizations
const VOICE_SETTINGS_V25 = {
  twin: {
    stability: 0.71,        // Slightly more dynamic for warmth
    similarity_boost: 0.82, // High similarity
    style: 0.24,           // More natural conversational style
    use_speaker_boost: true
  },
  ceo: {
    stability: 0.65,        // Confident but natural variation
    similarity_boost: 0.88, // Very high similarity for consistency
    style: 0.35,           // Executive confidence with natural flow
    use_speaker_boost: true
  }
};

// Voice direction prompts for enhanced character delivery
const VOICE_DIRECTIONS = {
  twin: "Speak in a warm, friendly, and professional tone like a helpful AI assistant greeting someone in the morning. Use natural pauses for emphasis on numbered points (First, Second, Third). When saying 'Perfect!' be enthusiastic and emphasize the word, then pause briefly before continuing. Sound genuinely pleasant and approachable while maintaining professionalism.",
  
  ceo: "Speak with confident executive authority and decisive leadership. Use a measured, authoritative pace that conveys experience and strategic thinking. Sound like a CEO making important business decisions - confident, direct, and action-oriented."
};

/**
 * Generate speech using ElevenLabs V2.5 with voice direction
 */
async function generateSpeechV25(text, voiceId, settings, voiceDirection, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: "eleven_turbo_v2_5", // Latest V2.5 model
      voice_settings: settings,
      // Add voice direction for enhanced character delivery
      voice_guidance: voiceDirection,
      // Enable enhanced processing
      optimize_streaming_latency: 0,
      output_format: "mp3_44100_128"
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
        console.log(`✓ Generated V2.5: ${path.basename(outputPath)}`);
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
 * Main function to generate all enhanced voice files
 */
async function generateAllVoicesV25() {
  console.log('🎤 Starting ElevenLabs V2.5 Enhanced Voice Generation...\n');
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'web', 'public', 'voice', 'en');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  let successCount = 0;
  let totalFiles = Object.keys(VOICE_SCRIPTS_V25).length;

  console.log('🎭 Voice Character Profiles:');
  console.log('👩 Twin (Female): Warm, friendly, professional AI assistant');
  console.log('👨 CEO (Male): Confident, decisive, executive leadership');
  console.log('');

  // Generate each enhanced voice file
  for (const [fileId, text] of Object.entries(VOICE_SCRIPTS_V25)) {
    try {
      const speaker = fileId.startsWith('twin_') ? 'twin' : 'ceo';
      const voiceId = VOICES[speaker];
      const settings = VOICE_SETTINGS_V25[speaker];
      const voiceDirection = VOICE_DIRECTIONS[speaker];
      const outputPath = path.join(outputDir, `${fileId}_v25.mp3`);

      console.log(`🔊 Generating ${fileId}_v25 (${speaker} voice)...`);
      console.log(`📝 Text: "${text}"`);
      console.log(`🎬 Direction: ${voiceDirection.substring(0, 80)}...`);
      
      await generateSpeechV25(text, voiceId, settings, voiceDirection, outputPath);
      successCount++;
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1200));
      
    } catch (error) {
      console.error(`❌ Failed to generate ${fileId}_v25:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log(`\n🎉 Enhanced V2.5 voice generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${totalFiles} enhanced files`);
  console.log(`📂 Files saved to: ${outputDir}`);
  console.log(`📝 File naming: *_v25.mp3 for easy comparison`);
  console.log(`📁 Directory structure: eleven-labs-v1/ (backup), eleven-labs-v25/ (enhanced)`);
  
  if (successCount === totalFiles) {
    console.log(`\n🚀 Enhanced voice files are ready!`);
    console.log(`💡 Compare original vs V2.5 versions to hear the difference`);
    console.log(`🔄 Update voiceService.ts to use _v25 files for production`);
  }
}

// Main execution
async function main() {
  try {
    console.log('🎭 ElevenLabs V2.5 Enhanced Voice Generator\n');
    console.log('🆕 Using Turbo V2.5 model with voice direction\n');
    console.log('📋 Script Enhancements:');
    console.log('  • Warmer, friendlier Twin voice');
    console.log('  • Enhanced morning greeting');
    console.log('  • Natural pauses on "First", "Second", "Third"');
    console.log('  • Personality touch with giggle');
    console.log('  • Executive confidence for CEO');
    console.log('');
    
    // Generate all enhanced voice files
    await generateAllVoicesV25();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your ElevenLabs API key');
    console.log('2. Ensure you have V2.5 model access');
    console.log('3. Check your internet connection');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for comparison
module.exports = { 
  generateAllVoicesV25, 
  VOICE_SCRIPTS_V25,
  VOICE_SETTINGS_V25,
  VOICE_DIRECTIONS 
};