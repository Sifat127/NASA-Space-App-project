import React, { useState } from 'react';
import { 
  MapPin, 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  HelpCircle,
  LocateFixed,
  X
} from 'lucide-react';
import { FarmProfile, SoilType, FarmerPriority } from '@/src/types';
import { CROP_LIST } from '@/src/lib/crops/database';
import { useI18n } from '@/src/lib/i18n/context';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: FarmProfile) => void;
  initialFarm: FarmProfile;
}

const REGIONAL_PRESETS = [
  { name: 'Indo-Gangetic Plain / Bengal Delta', lat: 23.81, lon: 90.41, region: 'Bengal Agro-Climatic Basin', country: 'Bangladesh / India' },
  { name: 'Corn Belt, Midwest', lat: 41.87, lon: -93.09, region: 'Midwest Agricultural Corridor', country: 'United States' },
  { name: 'Central Valley, California', lat: 36.65, lon: -119.85, region: 'California Central Basin', country: 'United States' },
  { name: 'Mato Grosso Savanna', lat: -12.68, lon: -55.99, region: 'Cerrado Agricultural Hub', country: 'Brazil' },
  { name: 'Darling Downs, Queensland', lat: -27.56, lon: 151.95, region: 'Queensland Basin', country: 'Australia' }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialFarm
}) => {
  const { t, language } = useI18n();

  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Step 1: Location
  const [locationName, setLocationName] = useState(initialFarm.location.address || 'Bengal Agro-Climatic Basin');
  const [regionName, setRegionName] = useState(initialFarm.location.region || 'Bengal Basin');
  const [latitude, setLatitude] = useState(initialFarm.location.latitude);
  const [longitude, setLongitude] = useState(initialFarm.location.longitude);

  // Step 2: Size
  const [size, setSize] = useState<number>(initialFarm.size || 5);
  const [unit, setUnit] = useState<'acres' | 'hectares'>(initialFarm.unit || 'acres');

  // Step 3: Soil
  const [soilType, setSoilType] = useState<SoilType>(initialFarm.soilType || 'Loamy');

  // Step 4: Current Crop
  const [currentCropId, setCurrentCropId] = useState<string>(initialFarm.currentCropId || 'rice');

  // Step 5: Priorities
  const [priorities, setPriorities] = useState<FarmerPriority[]>(initialFarm.priorities.length > 0 ? initialFarm.priorities : ['Save water', 'Improve soil health']);

  if (!isOpen) return null;

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert(language === 'bn' ? 'আপনার ব্রাউজার লোকেশন সমর্থন করে না।' : 'Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(Number(pos.coords.latitude.toFixed(4)));
        setLongitude(Number(pos.coords.longitude.toFixed(4)));
        setLocationName(language === 'bn' ? 'আমার বর্তমান অবস্থান' : 'My Current Location');
        setRegionName(language === 'bn' ? 'স্থানীয় কৃষি অঞ্চল' : 'Local Farm Region');
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      }
    );
  };

  const handleSelectPreset = (preset: typeof REGIONAL_PRESETS[0]) => {
    setLocationName(preset.name);
    setRegionName(preset.region);
    setLatitude(preset.lat);
    setLongitude(preset.lon);
  };

  const togglePriority = (p: FarmerPriority) => {
    if (priorities.includes(p)) {
      if (priorities.length > 1) {
        setPriorities(priorities.filter(item => item !== p));
      }
    } else {
      if (priorities.length < 3) {
        setPriorities([...priorities, p]);
      }
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    const updatedFarm: FarmProfile = {
      ...initialFarm,
      name: locationName.split(',')[0] + (language === 'bn' ? ' খামার' : ' Farm'),
      location: {
        address: locationName,
        region: regionName,
        latitude,
        longitude,
        country: 'Auto-Identified'
      },
      size,
      unit,
      soilType,
      currentCropId,
      priorities,
      updatedAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsFinishing(false);
      onComplete(updatedFarm);
    }, 1200);
  };

  const soilOptions: { type: SoilType; label: string; desc: string; icon: string }[] = [
    { type: 'Loamy', label: t.soilLoamy, desc: language === 'bn' ? 'উর্বর, নরম, জল ও বায়ু সহজে চলাচল করে' : 'Dark, crumbly, holds balanced moisture', icon: '🌱' },
    { type: 'Clay', label: t.soilClay, desc: language === 'bn' ? 'ভারী আঠালো মাটি, জল ধরে রাখে' : 'Dense, sticky when wet, holds high water', icon: '🧱' },
    { type: 'Sandy', label: t.soilSandy, desc: language === 'bn' ? 'হালকা মাটি, জল দ্রুত শুকিয়ে যায়' : 'Gritty, drains quickly, needs regular watering', icon: '🏖️' },
    { type: 'Silty', label: t.soilSilty, desc: language === 'bn' ? 'নদীর পলি মাটি, নরম ও পুষ্টিকর' : 'Smooth like flour, fertile river sediment', icon: '🌊' },
    { type: 'Unknown', label: t.notSure, desc: language === 'bn' ? 'আমরা স্যাটেলাইট তথ্য দিয়ে অনুমান করব' : "We'll estimate using regional satellite soil models", icon: '❓' }
  ];

  const priorityOptions: { key: FarmerPriority; label: string; icon: string }[] = [
    { key: 'Save water', label: t.priorityWater, icon: '💧' },
    { key: 'Improve soil health', label: t.prioritySoil, icon: '🌱' },
    { key: 'Reduce climate risk', label: t.priorityClimate, icon: '🛡️' },
    { key: 'Maximize yield', label: t.priorityYield, icon: '🌾' },
    { key: 'Increase crop diversity', label: t.priorityDiversity, icon: '🔄' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#0B1220] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              {t.step} {step} {t.of} 5
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* STEP 1: LOCATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.step1Title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t.step1Desc}
                </p>
              </div>

              <button
                onClick={handleUseLocation}
                disabled={isLocating}
                className="w-full min-h-[52px] flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-emerald-900 font-bold hover:bg-emerald-100 transition-all cursor-pointer"
              >
                <LocateFixed className={`w-5 h-5 text-emerald-700 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? (language === 'bn' ? 'অবস্থান খোঁজা হচ্ছে...' : 'Detecting location...') : t.useMyLocation}</span>
              </button>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  {language === 'bn' ? 'অথবা জনপ্রিয় কৃষি অঞ্চল বেছে নিন:' : 'Or choose your farming region:'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {REGIONAL_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                        locationName === preset.name
                          ? 'border-emerald-600 bg-emerald-50/60 font-semibold text-slate-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-sm font-semibold">{preset.name}</div>
                          <div className="text-xs text-slate-500">{preset.region}</div>
                        </div>
                      </div>
                      {locationName === preset.name && (
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SIZE */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.step2Title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t.step2Desc}
                </p>
              </div>

              {/* Big Number Selector */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSize(prev => Math.max(0.5, prev - 1))}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-300 text-2xl font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    -
                  </button>
                  <div className="min-w-[120px]">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">
                      {size}
                    </span>
                  </div>
                  <button
                    onClick={() => setSize(prev => prev + 1)}
                    className="w-12 h-12 rounded-2xl bg-white border border-slate-300 text-2xl font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Unit Switcher */}
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setUnit('acres')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      unit === 'acres'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {t.acres}
                  </button>
                  <button
                    onClick={() => setUnit('hectares')}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                      unit === 'hectares'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white border border-slate-300 text-slate-700'
                    }`}
                  >
                    {t.hectares}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 5, 10, 25, 50, 100, 250].map((presetVal) => (
                  <button
                    key={presetVal}
                    onClick={() => setSize(presetVal)}
                    className={`py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      size === presetVal
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {presetVal} {unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SOIL */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.step3Title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t.step3Desc}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {soilOptions.map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => setSoilType(opt.type)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                      soilType === opt.type
                        ? 'border-emerald-600 bg-emerald-50/70 font-semibold text-slate-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl p-2 bg-slate-100 rounded-xl">{opt.icon}</span>
                      <div>
                        <div className="text-base font-bold text-slate-900">{opt.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                    {soilType === opt.type && (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CURRENT CROP */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.step4Title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t.step4Desc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CROP_LIST.slice(0, 9).map((crop) => {
                  const isSelected = currentCropId === crop.id;
                  const localizedName = language === 'bn' && crop.localNames?.bn ? crop.localNames.bn : crop.name;
                  return (
                    <button
                      key={crop.id}
                      onClick={() => setCurrentCropId(crop.id)}
                      className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center min-h-[100px] cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-950 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span className="text-3xl mb-1.5">{crop.icon}</span>
                      <span className="text-sm font-semibold leading-tight">{localizedName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PRIORITIES */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {t.step5Title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {t.step5Desc}
                </p>
              </div>

              <div className="space-y-2.5">
                {priorityOptions.map((opt) => {
                  const isSelected = priorities.includes(opt.key);
                  return (
                    <button
                      key={opt.key}
                      onClick={() => togglePriority(opt.key)}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-base">{opt.label}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                        isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="min-h-[48px] px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="min-h-[48px] px-4 py-2.5 rounded-xl text-slate-500 font-medium hover:text-slate-800 transition-colors"
            >
              {t.skip}
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="min-h-[48px] px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer ml-auto"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isFinishing}
              className="min-h-[48px] px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-900/20 transition-all cursor-pointer ml-auto"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isFinishing ? (language === 'bn' ? 'সংযুক্ত হচ্ছে...' : 'Connecting...') : t.finishOnboarding}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
