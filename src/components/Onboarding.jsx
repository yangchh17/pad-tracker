import { ONBOARDING_PAGES } from '../lib/storage';
import { buildOnboardInstallBody } from '../lib/llm';

export default function Onboarding({ visible, step, t, lang, isIOS, isAndroid, enLabelColor, zhLabelColor, knob, onToggleLang, onNext, onSkip }) {
  if (!visible || step <= 0) return null;

  // Title by step
  const titleKey = `onboardTitle${step}`;
  // Body text by step
  let bodyText;
  if (step === 1) {
    bodyText = buildOnboardInstallBody(lang, isIOS, isAndroid);
  } else if (step === 2) {
    bodyText = t.onboardBody2;
  } else {
    bodyText = t.onboardBody3;
  }

  // Button label: last step shows "Got it", others show "Next"
  const isLastStep = step >= ONBOARDING_PAGES;
  const buttonLabel = isLastStep ? t.onboardDone : t.onboardNext;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Backdrop blur */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,.5)', backdropFilter: 'blur(2px)' }} />

      {/* Centered card */}
      <div style={{ position: 'relative', background: '#1a162e', border: '1px solid rgba(217,190,122,.2)', borderRadius: 16, padding: '32px 24px', maxWidth: 340, width: 'calc(100% - 48px)', boxSizing: 'border-box' }}>
        {/* EN/中 toggle */}
        <div className="pv" onClick={onToggleLang} style={{ width: 52, marginBottom: 24 }}>
          <span style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', font: "600 8px 'JetBrains Mono',monospace", color: enLabelColor, pointerEvents: 'none' }}>EN</span>
          <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', font: "600 8px 'JetBrains Mono',monospace", color: zhLabelColor, pointerEvents: 'none' }}>中</span>
          <div className="pv-knob" style={{ left: knob }} />
        </div>

        {/* Title */}
        <div style={{ font: "400 20px/1.3 'EB Garamond',serif", color: '#D9BE7A', marginBottom: 16, textAlign: 'center' }}>
          {t[titleKey]}
        </div>

        {/* Body text */}
        <div style={{ font: "400 13px 'EB Garamond',serif", color: 'rgba(232,224,255,.7)', whiteSpace: 'pre-line', lineHeight: 1.6, marginBottom: 24, textAlign: 'center' }}>
          {bodyText}
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ width: 6, height: 6, borderRadius: '50%', background: n === step ? '#D9BE7A' : 'rgba(232,224,255,.2)' }} />
          ))}
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Skip button — hidden on last step */}
          {!isLastStep && (
            <div
              className="chip"
              onClick={onSkip}
              style={{ font: "400 12px 'EB Garamond',serif", color: 'rgba(232,224,255,.4)', cursor: 'pointer' }}
            >
              {t.onboardSkip}
            </div>
          )}

          {/* Spacer for last step (center "Done" button) */}
          {isLastStep && <div style={{ flex: 1 }} />}

          {/* Next / Got it button */}
          <div
            className="chip"
            onClick={onNext}
            style={{ font: "400 12px 'EB Garamond',serif", color: '#D9BE7A', cursor: 'pointer' }}
          >
            {buttonLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
