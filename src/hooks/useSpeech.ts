import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Optional voice announcements via the Web Speech API (SpeechSynthesis).
 * Prefers a Hindi (hi-IN) voice when available, falling back to any voice.
 * No audio is sent anywhere — it is synthesized locally in the browser.
 */
export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load);
  }, [supported]);

  const pickVoice = useCallback((lang: 'hi' | 'en') => {
    const voices = voicesRef.current;
    if (voices.length === 0) return undefined;
    const want = lang === 'hi' ? 'hi' : 'en';
    const exact = voices.find((v) => v.lang?.toLowerCase().startsWith(want));
    return exact ?? voices.find((v) => v.lang?.toLowerCase().startsWith(want.slice(0, 2))) ?? voices[0];
  }, []);

  const speak = useCallback(
    (text: string, lang: 'hi' | 'en' = 'hi') => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.96;
      u.pitch = 1;
      u.volume = 1;
      const v = pickVoice(lang);
      if (v) u.voice = v;
      if (v) u.lang = v.lang;
      else u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [pickVoice, supported],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, stop };
}
