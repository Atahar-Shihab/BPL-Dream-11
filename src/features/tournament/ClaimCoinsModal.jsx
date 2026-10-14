import { useState } from 'react';
import { X, Coins, Sparkles, Trophy, Zap, Gift } from 'lucide-react';
import { playCoinSound, playCheerSound } from '../../utils/soundEffects';
import { triggerCoinShower } from '../../utils/confetti';
import { toast } from 'react-toastify';

const PACKAGES = [
  { id: 'starter', title: 'Rookie Grant', coins: 25000, desc: 'Essential coin boost to sign talented youngsters.', icon: Coins, color: 'from-amber-500 to-yellow-400' },
  { id: 'bpl_sponsor', title: 'BPL Title Sponsor', coins: 50000, desc: 'Official franchise grant to bid for marquee legends.', icon: Trophy, color: 'from-emerald-500 to-teal-400', popular: true },
  { id: 'vip_owner', title: 'VIP Team Owner Bonus', coins: 100000, desc: 'Unlimited auction muscle for your ultimate dream squad.', icon: Zap, color: 'from-purple-500 to-pink-500' },
];

const ClaimCoinsModal = ({ isOpen, onClose, onClaimCoins }) => {
  const [claimingId, setClaimingId] = useState(null);

  if (!isOpen) return null;

  const handleClaim = (pkg) => {
    setClaimingId(pkg.id);
    playCoinSound();

    setTimeout(() => {
      onClaimCoins(pkg.coins);
      triggerCoinShower();
      playCheerSound();
      toast.success(`Claimed +${pkg.coins.toLocaleString()} Coins from ${pkg.title}!`);
      setClaimingId(null);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-yellow-400/20 text-yellow-500 dark:text-yellow-400">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 id="modal-title" className="text-xl font-extrabold text-neutral-900 dark:text-white">
                Franchise Coin Grants
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Boost your team budget anytime for free!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Packages List */}
        <div className="mt-6 space-y-4">
          {PACKAGES.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                  pkg.popular
                    ? 'border-yellow-400/60 bg-yellow-50/50 dark:bg-yellow-950/20'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-yellow-400 text-neutral-900 shadow">
                    Most Popular
                  </span>
                )}
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${pkg.color} text-white shadow-md flex-none`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      {pkg.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {pkg.desc}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-sm font-black text-amber-500 dark:text-amber-400">
                      <span>+{pkg.coins.toLocaleString()}</span>
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleClaim(pkg)}
                  disabled={claimingId === pkg.id}
                  className="flex-none px-4 py-2 text-xs font-bold rounded-xl bg-neutral-900 text-yellow-300 dark:bg-yellow-400 dark:text-neutral-950 hover:opacity-90 active:scale-95 transition shadow"
                >
                  {claimingId === pkg.id ? 'Claiming…' : 'Claim Now'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
          <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            No real money needed! Enjoy unlimited squad simulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimCoinsModal;
