#!/usr/bin/env node
/**
 * personalize-dc.mjs
 *
 * Personalizes the harness intro DC with DS voice + component-aware gallery pruning.
 */
import fs from 'node:fs';
import path from 'node:path';
import { voiceToPlaceholderMap } from './extract-ds-voice.mjs';
import { introDcFilename } from './intro-dc.mjs';

function applyVoicePlaceholders(text, voice) {
  let out = text;
  const map = voiceToPlaceholderMap(voice);
  for (const [key, value] of Object.entries(map)) {
    out = out.replaceAll(`{{${key}}}`, value);
  }
  return out;
}

function pruneRequiresBlocks(text, components) {
  const set = new Set(components);
  return text.replace(
    /<!-- CDP:REQUIRES:(\w+) -->[\s\S]*?<!-- \/CDP:REQUIRES:\1 -->/g,
    (block, name) => {
      if (!set.has(name)) return '';
      return block
        .replace(/<!-- CDP:REQUIRES:\w+ -->\n?/g, '')
        .replace(/\n?<!-- \/CDP:REQUIRES:\w+ -->/g, '');
    },
  );
}

function pruneGalleryCards(text, components) {
  const set = new Set(components);
  return text.replace(
    /<!-- CDP:GALLERY:(\w+) -->[\s\S]*?<!-- \/CDP:GALLERY:\1 -->/g,
    (block, name) => {
      if (!set.has(name)) return '';
      return block
        .replace(/<!-- CDP:GALLERY:\w+ -->\n?/g, '')
        .replace(/\n?<!-- \/CDP:GALLERY:\w+ -->/g, '');
    },
  );
}

const GALLERY_COMPONENTS = [
  'Button',
  'Badge',
  'Icon',
  'Input',
  'Textarea',
  'Label',
  'Switch',
  'Checkbox',
  'Alert',
  'Avatar',
  'Progress',
  'Tabs',
  'StatChip',
  'SectionHeader',
  'BookCard',
  'Card',
];

function pruneStarterGalleryByTitle(text, components) {
  const set = new Set(components);
  let out = text;
  for (const name of GALLERY_COMPONENTS) {
    if (set.has(name)) continue;
    const re = new RegExp(
      String.raw`\s*<x-import component-from-global-scope="(?:\{\{BOUND_DS_NAMESPACE\}\}|[^"]+)\.Card"[\s\S]*?<x-import[^>]*CardTitle[^>]*>${name}</x-import>[\s\S]*?</x-import>\s*</x-import>`,
      'g',
    );
    out = out.replace(re, '');
  }
  return out;
}

function setThemeDefault(text, voice) {
  return text.replace(
    /"default":"(?:dark|light)"/g,
    `"default":"${voice.themeDefault}"`,
  );
}

export function personalizeDcContent(text, binding, voice) {
  let out = text;
  out = applyVoicePlaceholders(out, voice);
  out = pruneRequiresBlocks(out, binding.components);
  out = pruneGalleryCards(out, binding.components);
  out = pruneStarterGalleryByTitle(out, binding.components);
  out = setThemeDefault(out, voice);
  return out;
}

export function personalizeIntroDc(binding, voice, cwd = process.cwd()) {
  const rel = binding.introDc || introDcFilename(voice.language);
  const abs = path.join(cwd, rel);
  if (!fs.existsSync(abs)) {
    return { personalized: 0, targets: 0, filename: rel };
  }

  const before = fs.readFileSync(abs, 'utf8');
  const after = personalizeDcContent(before, binding, voice);
  if (after !== before) {
    fs.writeFileSync(abs, after);
    return { personalized: 1, targets: 1, filename: rel };
  }
  return { personalized: 0, targets: 1, filename: rel };
}

/** @deprecated use personalizeIntroDc */
export function personalizeDcFiles(binding, voice, cwd = process.cwd()) {
  const result = personalizeIntroDc(binding, voice, cwd);
  return { personalized: result.personalized, targets: result.targets };
}