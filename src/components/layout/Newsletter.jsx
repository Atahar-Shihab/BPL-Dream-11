import { useState } from 'react';
import { Mail, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollAnimations';
import { toast } from 'react-toastify';
import { playCoinSound } from '../../utils/soundEffects';
import { useTheme } from '../../context/useTheme';

const Newsletter = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.15 });
  const { language, t } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    playCoinSound();
    toast.success(
      language === 'bn'
        ? 'অভিনন্দন! বিপিএল আপডেট সরাসরি আপনার ইনবক্সে পৌঁছাবে।'
        : "Welcome aboard! You'll receive BPL updates at your inbox."
    );
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section
      ref={ref}
      className={`page-container -mb-24 relative z-20 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="p-3 sm:p-4 rounded-[32px] bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-2xl">
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950 p-8 sm:p-12 text-center">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#e7fb25_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

          <div className="relative z-10 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> BPL 2026 Insider
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {t('newsletterHeading', 'Never Miss a BPL Update')}
            </h3>
            <p className="text-sm text-white/60 mb-6 max-w-md mx-auto">
              {t('newsletterSubtitle', 'Get real-time pitch condition reports, squad fantasy trends, and instant bonus coin gift links delivered to your inbox.')}
            </p>

            {submitted ? (
              <div className="flex items-center justify-center gap-2 py-4 text-emerald-400 font-bold animate-fadeIn">
                <CheckCircle className="w-5 h-5" />
                {language === 'bn' ? 'সফলভাবে সাবস্ক্রাইব করা হয়েছে!' : 'Subscribed successfully!'}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder', 'your@email.com')}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition backdrop-blur-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-yellow-400 text-neutral-950 text-sm font-bold hover:bg-yellow-300 active:scale-95 transition flex items-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {t('subscribe', 'Subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
