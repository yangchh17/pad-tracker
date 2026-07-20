const STORAGE_KEY = 'pad-tracker:data';
export const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.entries)) return [];
      return parsed.entries;
    } catch (e) {
      return [];
    }
  },
  save(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, entries }));
    } catch (e) {
      console.error('PAD Tracker: failed to save entries', e);
    }
  },
};

const LLM_SETTINGS_KEY = 'pad-tracker:llm-settings';
export const DEFAULT_LLM_BASE_URL = 'https://my-brain-1.tail28b58f.ts.net:8443';
export const DEFAULT_LLM_MODEL = 'gemma4:12b';
export const LlmSettings = {
  load() {
    try {
      const raw = localStorage.getItem(LLM_SETTINGS_KEY);
      if (!raw) return { enabled: false, baseUrl: DEFAULT_LLM_BASE_URL, model: DEFAULT_LLM_MODEL };
      const parsed = JSON.parse(raw);
      return {
        enabled: !!parsed.enabled,
        baseUrl: typeof parsed.baseUrl === 'string' && parsed.baseUrl ? parsed.baseUrl : DEFAULT_LLM_BASE_URL,
        model: typeof parsed.model === 'string' && parsed.model ? parsed.model : DEFAULT_LLM_MODEL,
      };
    } catch (e) {
      return { enabled: false, baseUrl: DEFAULT_LLM_BASE_URL, model: DEFAULT_LLM_MODEL };
    }
  },
  save(settings) {
    try {
      localStorage.setItem(
        LLM_SETTINGS_KEY,
        JSON.stringify({ enabled: !!settings.enabled, baseUrl: settings.baseUrl || '', model: settings.model || '' })
      );
    } catch (e) {
      console.error('PAD Tracker: failed to save LLM settings', e);
    }
  },
};

const ONBOARD_KEY = 'pad-tracker:onboarded';
export const ONBOARDING_PAGES = 3;
export const Onboarding = {
  isDone() {
    try {
      return !!localStorage.getItem(ONBOARD_KEY);
    } catch (e) {
      return false;
    }
  },
  markDone() {
    try {
      localStorage.setItem(ONBOARD_KEY, '1');
    } catch (e) {}
  },
};
