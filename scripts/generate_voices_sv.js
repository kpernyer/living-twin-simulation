#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'your-api-key-here';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io';

// Swedish Voice IDs - Using multilingual voices
const VOICES_SV = {
  // Female voice for Twin (warm, friendly, professional - Swedish)
  twin: 'EXAVITQu4vr4xnSDxMaL', // Bella - supports multiple languages including Swedish
  
  // Male voice for CEO (confident, executive - Swedish) 
  ceo: 'VR6AewLTigWG4xSOukaG'   // Josh - supports multiple languages including Swedish
};

// Swedish voice scripts with natural pauses and personality
const VOICE_SCRIPTS_SV = {
  // Twin voice scripts (Female - Warm, Friendly Professional AI - Swedish)
  twin_001: "God morgon! Idag har vi tre strategiska operativa justeringar som behöver din uppmärksamhet.",
  twin_002: "För det första... Q3:s intäktsmiss signalerar en koppling till marknadspositionering - åtta procent under målet inom företagssegmentet.", 
  twin_003: "För det andra... ingenjörshastigheten minskar medan kundernas funktionsförfrågningar accelererar - vilket skapar strategisk skuld.",
  twin_004: "För det tredje... konkurrenten TechFlows förvärv förändrar branschdynamiken - två komma en miljard signalerar AI-först positionering.",
  twin_005: "Perfekt! Alla strategiska justeringar är registrerade. Ska jag koordinera tvärfunktionell anpassning?",
  
  // CEO voice scripts (Male - Decisive Executive Leader - Swedish)
  ceo_001: "Det antyder att vår värdeerbjudande-anpassning är felaktig. Sammankalla strategisk intäktsgranskning - inkludera produkt och marknadsföring.",
  ceo_002: "Klassisk teknisk skuld kontra marknadshastighet avvägning. Initiera arkitekturgranskning med färdplansjustering.", 
  ceo_003: "Vår konkurrensfördel behöver förstärkning. Påskynda AI-integrationsstrategi och justera marknadsmeddelanden.",
  ceo_004: "Ja, men kaskad genom avdelningsledare först. Utmärkt strategisk syntes."
};

// Enhanced voice settings optimized for Swedish
const VOICE_SETTINGS_SV = {
  twin: {
    stability: 0.73,        // Slightly more stable for Swedish pronunciation
    similarity_boost: 0.85, // Higher similarity for consistent Swedish accent
    style: 0.25,           // Natural conversational style for Swedish
    use_speaker_boost: true
  },
  ceo: {
    stability: 0.68,        // Confident but natural Swedish delivery
    similarity_boost: 0.88, // Very high similarity for Swedish consistency
    style: 0.38,           // Executive confidence adapted for Swedish
    use_speaker_boost: true
  }
};

// Voice direction prompts for Swedish characters
const VOICE_DIRECTIONS_SV = {
  twin: "Tala med en varm, vänlig och professionell ton som en hjälpsam AI-assistent som hälsar någon på morgonen på svenska. Använd naturliga pauser för betoning på numrerade punkter (För det första, För det andra, För det tredje). När du säger 'Perfekt!' var entusiastisk och betona ordet, pausa sedan kort innan du fortsätter. Låt genuint trevlig och tillgänglig medan du behåller professionalitet.",
  
  ceo: "Tala med självsäker verkställande auktoritet och beslutsam ledarskap på svenska. Använd en måttfull, auktoritativ takt som förmedlar erfarenhet och strategiskt tänkande. Låt som en VD som fattar viktiga affärsbeslut - säker, direkt och handlingsorienterad."
};

/**
 * Generate Swedish speech using ElevenLabs V2.5 with voice direction
 */
async function generateSwedishSpeech(text, voiceId, settings, voiceDirection, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2", // Multilingual model for Swedish
      voice_settings: settings,
      voice_guidance: voiceDirection,
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
        console.log(`✓ Generated Swedish: ${path.basename(outputPath)}`);
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
 * Main function to generate all Swedish voice files
 */
async function generateAllSwedishVoices() {
  console.log('🇸🇪 Starting Swedish Voice Generation with ElevenLabs Multilingual...\n');
  
  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'web', 'public', 'voice', 'sv');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created Swedish directory: ${outputDir}`);
  }

  // Create eleven-labs-v2 subdirectory for versioning
  const versionDir = path.join(outputDir, 'eleven-labs-v2');
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true });
    console.log(`📁 Created version directory: ${versionDir}`);
  }

  let successCount = 0;
  let totalFiles = Object.keys(VOICE_SCRIPTS_SV).length;

  console.log('🎭 Swedish Voice Character Profiles:');
  console.log('👩 Twin (Female): Varm, vänlig, professionell AI-assistent');
  console.log('👨 CEO (Male): Självsäker, beslutsam, verkställande ledarskap');
  console.log('🗣️  Model: eleven_multilingual_v2 för svenska');
  console.log('');

  // Generate each Swedish voice file
  for (const [fileId, text] of Object.entries(VOICE_SCRIPTS_SV)) {
    try {
      const speaker = fileId.startsWith('twin_') ? 'twin' : 'ceo';
      const voiceId = VOICES_SV[speaker];
      const settings = VOICE_SETTINGS_SV[speaker];
      const voiceDirection = VOICE_DIRECTIONS_SV[speaker];
      
      // Create both versioned and main files
      const versionedPath = path.join(versionDir, `${fileId}_sv_v2.mp3`);
      const mainPath = path.join(outputDir, `${fileId}.mp3`);

      console.log(`🔊 Generating Swedish ${fileId} (${speaker} röst)...`);
      console.log(`📝 Text: "${text}"`);
      console.log(`🎬 Direction: ${voiceDirection.substring(0, 80)}...`);
      
      // Generate versioned file first
      await generateSwedishSpeech(text, voiceId, settings, voiceDirection, versionedPath);
      
      // Copy to main directory
      fs.copyFileSync(versionedPath, mainPath);
      console.log(`✓ Copied to main: ${path.basename(mainPath)}`);
      
      successCount++;
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Failed to generate Swedish ${fileId}:`, error.message);
    }
    
    console.log(''); // Empty line for readability
  }

  console.log(`\n🎉 Swedish voice generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${totalFiles} Swedish files`);
  console.log(`📂 Files saved to: ${outputDir}`);
  console.log(`📁 Versioned files in: ${versionDir}`);
  
  if (successCount === totalFiles) {
    console.log(`\n🚀 Swedish voice files are ready!`);
    console.log(`🌐 Demo now supports both English and Swedish`);
    console.log(`💡 To use Swedish voices, update voice service language setting`);
  }
}

// Main execution
async function main() {
  try {
    console.log('🎭 ElevenLabs Swedish Voice Generator for Living Twin Demo\n');
    console.log('🇸🇪 Using Multilingual V2 model for Swedish voices\n');
    console.log('📋 Swedish Script Features:');
    console.log('  • Professional Swedish translations');
    console.log('  • Maintains business context and terminology');
    console.log('  • Same timing and structure as English version');
    console.log('  • Natural Swedish pronunciation and rhythm');
    console.log('');
    
    // Generate all Swedish voice files
    await generateAllSwedishVoices();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your ElevenLabs API key');
    console.log('2. Ensure you have multilingual model access');
    console.log('3. Check your internet connection');
    console.log('4. Verify Swedish language support in your plan');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for use
module.exports = { 
  generateAllSwedishVoices, 
  VOICE_SCRIPTS_SV,
  VOICE_SETTINGS_SV,
  VOICE_DIRECTIONS_SV 
};