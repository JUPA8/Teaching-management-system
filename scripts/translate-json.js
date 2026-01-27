#!/usr/bin/env node

/**
 * AI Translation Automation Script
 *
 * This script scans the English (en.json) translation file and automatically
 * fills in missing translations for Arabic (ar.json) and German (de.json)
 * using OpenAI or DeepL API.
 *
 * Usage:
 *   node scripts/translate-json.js
 *
 * Environment Variables:
 *   OPENAI_API_KEY - Your OpenAI API key (for OpenAI provider)
 *   DEEPL_API_KEY - Your DeepL API key (for DeepL provider)
 *   TRANSLATION_PROVIDER - 'openai' or 'deepl' (default: 'openai')
 *
 * Install dependencies:
 *   npm install openai deepl-node dotenv
 */

const fs = require('fs');
const path = require('path');

// Configuration
const MESSAGES_DIR = path.join(__dirname, '..', 'src', 'messages');
const SOURCE_LOCALE = 'en';
const TARGET_LOCALES = ['de', 'ar'];

const LOCALE_NAMES = {
  en: 'English',
  de: 'German',
  ar: 'Arabic',
};

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const PROVIDER = process.env.TRANSLATION_PROVIDER || 'openai';

/**
 * Flatten a nested object into dot-notation keys
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

/**
 * Unflatten dot-notation keys back to nested object
 */
function unflattenObject(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

/**
 * Find missing keys in target compared to source
 */
function findMissingKeys(source, target) {
  const sourceFlat = flattenObject(source);
  const targetFlat = flattenObject(target);

  const missing = {};

  for (const [key, value] of Object.entries(sourceFlat)) {
    if (!(key in targetFlat)) {
      missing[key] = value;
    }
  }

  return missing;
}

/**
 * Translate text using OpenAI
 */
async function translateWithOpenAI(texts, targetLocale) {
  const OpenAI = require('openai');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const targetLang = LOCALE_NAMES[targetLocale];

  // Build the prompt
  const textsJson = JSON.stringify(texts, null, 2);

  const systemPrompt = `You are a professional translator specializing in educational and Islamic content.
Translate the following JSON object values from English to ${targetLang}.
Keep the JSON structure exactly the same - only translate the string values.
Maintain the same tone, formality, and meaning.
For Arabic translations, use Modern Standard Arabic.
For religious terms, use commonly accepted translations.
Return ONLY the translated JSON object, no explanations.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: textsJson },
    ],
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;

  // Parse the JSON response
  try {
    // Remove markdown code blocks if present
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse translation response');
  }
}

/**
 * Translate text using DeepL
 */
async function translateWithDeepL(texts, targetLocale) {
  const deepl = require('deepl-node');

  const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

  const targetLangMap = {
    de: 'DE',
    ar: 'AR',
  };

  const targetLang = targetLangMap[targetLocale];
  const results = {};

  // DeepL requires individual translations
  for (const [key, value] of Object.entries(texts)) {
    if (typeof value === 'string') {
      try {
        const result = await translator.translateText(value, 'EN', targetLang);
        results[key] = result.text;
      } catch (error) {
        console.error(`Failed to translate key "${key}":`, error.message);
        results[key] = value; // Keep original on failure
      }
    } else {
      results[key] = value;
    }
  }

  return results;
}

/**
 * Translate texts based on provider
 */
async function translate(texts, targetLocale) {
  if (Object.keys(texts).length === 0) {
    return {};
  }

  console.log(`  Translating ${Object.keys(texts).length} keys using ${PROVIDER}...`);

  if (PROVIDER === 'deepl') {
    return translateWithDeepL(texts, targetLocale);
  }

  // Default to OpenAI
  // Split into batches to avoid token limits
  const BATCH_SIZE = 50;
  const keys = Object.keys(texts);
  const results = {};

  for (let i = 0; i < keys.length; i += BATCH_SIZE) {
    const batchKeys = keys.slice(i, i + BATCH_SIZE);
    const batch = {};
    for (const key of batchKeys) {
      batch[key] = texts[key];
    }

    console.log(`    Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(keys.length / BATCH_SIZE)}...`);

    const translated = await translateWithOpenAI(batch, targetLocale);
    Object.assign(results, translated);

    // Add delay to avoid rate limits
    if (i + BATCH_SIZE < keys.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = deepMerge(result[key] || {}, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Main function
 */
async function main() {
  console.log('Translation Automation Script');
  console.log('============================\n');

  // Check for API key
  if (PROVIDER === 'openai' && !process.env.OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY environment variable is not set.');
    console.error('Set it in .env.local or export it in your shell.');
    process.exit(1);
  }

  if (PROVIDER === 'deepl' && !process.env.DEEPL_API_KEY) {
    console.error('Error: DEEPL_API_KEY environment variable is not set.');
    console.error('Set it in .env.local or export it in your shell.');
    process.exit(1);
  }

  // Load source translations
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LOCALE}.json`);
  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

  console.log(`Source: ${sourcePath}`);
  console.log(`Provider: ${PROVIDER}\n`);

  for (const targetLocale of TARGET_LOCALES) {
    console.log(`\nProcessing ${LOCALE_NAMES[targetLocale]} (${targetLocale})...`);

    const targetPath = path.join(MESSAGES_DIR, `${targetLocale}.json`);

    // Load existing target translations (or create empty object)
    let targetData = {};
    if (fs.existsSync(targetPath)) {
      targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    }

    // Find missing keys
    const missingKeys = findMissingKeys(sourceData, targetData);
    const missingCount = Object.keys(missingKeys).length;

    if (missingCount === 0) {
      console.log('  No missing translations found.');
      continue;
    }

    console.log(`  Found ${missingCount} missing translations.`);

    // Translate missing keys
    const translated = await translate(missingKeys, targetLocale);

    // Unflatten the translated keys
    const translatedNested = unflattenObject(translated);

    // Merge with existing translations
    const mergedData = deepMerge(targetData, translatedNested);

    // Write back to file
    fs.writeFileSync(targetPath, JSON.stringify(mergedData, null, 2) + '\n', 'utf-8');

    console.log(`  Updated ${targetPath}`);
  }

  console.log('\nDone!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
