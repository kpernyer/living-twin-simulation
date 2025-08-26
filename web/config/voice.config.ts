// Voice Configuration - Single source of truth for all voice settings
export interface VoiceVersionConfig {
  path: string;           // Directory path under /voice/{language}/
  displayName: string;    // Human readable name
  description: string;    // Description of voice quality/version
}

export interface LanguageVoiceConfig {
  defaultVersion: string;                    // Default version for this language
  availableVersions: Record<string, VoiceVersionConfig>;
}

export interface VoiceConfiguration {
  defaultLanguage: 'en' | 'sv';
  languages: Record<'en' | 'sv', LanguageVoiceConfig>;
}

// MAIN VOICE CONFIGURATION - Change this to control all voice behavior
export const VOICE_CONFIG: VoiceConfiguration = {
  defaultLanguage: 'en',
  
  languages: {
    en: {
      defaultVersion: 'eleven-labs-v3alpha',
      availableVersions: {
        'eleven-labs-v1': {
          path: 'eleven-labs-v1',
          displayName: 'V1 Professional',
          description: 'Basic professional voices (backup)'
        },
        'eleven-labs-v25': {
          path: 'eleven-labs-v25', 
          displayName: 'V2.5 Enhanced',
          description: 'Enhanced voices with personality'
        },
        'eleven-labs-v3alpha': {
          path: 'eleven-labs-v3alpha',
          displayName: 'V3 Alpha',
          description: 'Latest alpha voices with improved quality'
        }
      }
    },
    
    sv: {
      defaultVersion: 'eleven-labs-v2',
      availableVersions: {
        'eleven-labs-v2': {
          path: 'eleven-labs-v2',
          displayName: 'V2 Swedish',
          description: 'Professional Swedish voices using Multilingual V2'
        }
      }
    }
  }
};

// Helper functions to get configuration values
export function getDefaultVoiceVersion(language: 'en' | 'sv'): string {
  return VOICE_CONFIG.languages[language].defaultVersion;
}

export function getVoiceVersionConfig(language: 'en' | 'sv', version: string): VoiceVersionConfig | null {
  return VOICE_CONFIG.languages[language].availableVersions[version] || null;
}

export function getVoiceVersionPath(language: 'en' | 'sv', version?: string): string {
  const actualVersion = version || getDefaultVoiceVersion(language);
  const config = getVoiceVersionConfig(language, actualVersion);
  return config ? config.path : 'eleven-labs-v1'; // fallback
}

export function getAvailableVersions(language: 'en' | 'sv'): Record<string, VoiceVersionConfig> {
  return VOICE_CONFIG.languages[language].availableVersions;
}