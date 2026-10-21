import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Lightbulb } from 'lucide-react';
import { useLang } from '@/i18n/LanguageContext';
import { useSpeech } from '@/hooks/useSpeech';

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLang();
  const { speak, stop, speaking, supported } = useSpeech();

  const steps = [t('help.step1'), t('help.step2'), t('help.step3'), t('help.step4'), t('help.step5'), t('help.step6')];

  const readAll = () => {
    if (speaking) {
      stop();
      return;
    }
    const text = `${t('help.intro')} ${steps.join(' ')}`;
    speak(text, lang);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={t('help.title')}
      footer={
        <>
          {supported && (
            <Button variant="outline" onClick={readAll} icon={<Lightbulb size={15} />}>
              {speaking ? t('common.stopListening') : t('common.listen')}
            </Button>
          )}
          <Button variant="primary" onClick={onClose}>
            {t('help.gotIt')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-300 leading-relaxed">{t('help.intro')}</p>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent-cyan/15 text-accent-cyan text-sm font-semibold shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-slate-300 leading-relaxed pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Modal>
  );
}
