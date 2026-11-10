import React, { useState } from 'react';
import { Star, Plus, Trash2, X, PlusCircle } from 'lucide-react';
import { MealItem, Language } from '../types';
import { I18N } from '../data/translations';
import { sound } from '../utils/audio';

interface FavoriteMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MealItem[];
  onAddFavorite: (meal: MealItem) => void;
  onDeleteFavorite: (index: number) => void;
  onSelectFavorite: (meal: MealItem) => void;
  lang: Language;
  soundEnabled: boolean;
}

export const FavoriteMealsModal: React.FC<FavoriteMealsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onAddFavorite,
  onDeleteFavorite,
  onSelectFavorite,
  lang,
  soundEnabled,
}) => {
  const [cat, setCat] = useState('Kahvaltı');
  const [desc, setDesc] = useState('');
  const [cal, setCal] = useState<string>('400');
  const [protein, setProtein] = useState<string>('20');
  const t = I18N[lang];

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!desc.trim()) {
      alert(lang === 'tr' ? 'Lütfen öğün adı girin.' : 'Please enter a meal name.');
      return;
    }
    const calNum = parseInt(cal, 10) || 0;
    const protNum = parseInt(protein, 10) || 0;
    if (calNum <= 0) {
      alert(lang === 'tr' ? 'Lütfen kalori miktarını girin.' : 'Please enter calories.');
      return;
    }

    sound.playSuccess(soundEnabled);
    onAddFavorite({
      cat,
      desc: desc.trim(),
      cal: calNum,
      protein: protNum,
    });

    setDesc('');
    setCal('400');
    setProtein('20');
  };

  const handleSelect = (item: MealItem) => {
    sound.playSuccess(soundEnabled);
    onSelectFavorite(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md max-h-[88vh] flex flex-col bg-[#101926] border-2 border-[#759667] rounded-3xl p-5 shadow-2xl text-[#d4dde8]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#759667] fill-[#759667]" />
            <h2 className="text-base font-black text-[#e2eaf4]">
              {t.quickMealModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7e91ac] hover:text-white rounded-xl bg-[#0b121b] border border-[#1a273b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form: Add New Favorite */}
        <div className="my-3 p-3 rounded-2xl bg-[#0b121b] border border-[#1b281d]">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#759667] mb-2 uppercase tracking-wider">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.addFavHeading}</span>
          </div>

          <div className="flex gap-2 mb-2">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-1/3 bg-[#101926] border border-[#1a273b] text-[#e2eaf4] text-xs rounded-xl px-2.5 py-2 outline-none focus:border-[#759667]"
            >
              <option value="Kahvaltı">{t.meals.breakfast}</option>
              <option value="Öğle">{t.meals.lunch}</option>
              <option value="Akşam">{t.meals.dinner}</option>
              <option value="Ara Öğün">{t.meals.snack}</option>
            </select>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={t.favFoodPlaceholder}
              className="flex-1 bg-[#101926] border border-[#1a273b] text-[#e2eaf4] text-xs rounded-xl px-3 py-2 outline-none focus:border-[#759667]"
            />
          </div>

          <div className="flex gap-2 items-center">
            {/* Calories Stepper */}
            <div className="flex-1 flex items-center bg-[#101926] border border-[#1a273b] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setCal(String(Math.max(0, (parseInt(cal, 10) || 0) - 50)))}
                className="w-8 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/20 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={cal}
                onChange={(e) => setCal(e.target.value)}
                placeholder="kcal"
                className="w-full bg-transparent text-center text-xs font-bold text-[#e2eaf4] outline-none"
              />
              <button
                type="button"
                onClick={() => setCal(String((parseInt(cal, 10) || 0) + 50))}
                className="w-8 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/20 font-bold"
              >
                +
              </button>
            </div>

            {/* Protein Stepper */}
            <div className="w-28 flex items-center bg-[#101926] border border-[#1a273b] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setProtein(String(Math.max(0, (parseInt(protein, 10) || 0) - 5)))}
                className="w-7 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/20 font-bold"
              >
                -
              </button>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="P (g)"
                className="w-full bg-transparent text-center text-xs font-bold text-[#e2eaf4] outline-none"
              />
              <button
                type="button"
                onClick={() => setProtein(String((parseInt(protein, 10) || 0) + 5))}
                className="w-7 h-8 flex items-center justify-center text-[#759667] hover:bg-[#759667]/20 font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleCreate}
              className="px-3.5 py-2 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Existing favorites list */}
        <p className="text-[11px] text-[#7e91ac] mb-2">
          {t.favListHint}
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scroll min-h-[140px] touch-pan-y overscroll-contain">
          {favorites.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#7e91ac]">
              {t.noFavMeals}
            </div>
          ) : (
            favorites.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0b121b] border border-[#1a273b] hover:border-[#759667] transition group"
              >
                <div
                  onClick={() => handleSelect(item)}
                  className="flex-1 cursor-pointer min-w-0"
                >
                  <div className="text-[10px] font-extrabold uppercase text-[#759667]">
                    [{item.cat}]
                  </div>
                  <div className="text-xs font-black text-[#e2eaf4] truncate group-hover:text-white">
                    {item.desc}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <div
                    onClick={() => handleSelect(item)}
                    className="text-right cursor-pointer"
                  >
                    <div className="text-xs font-black text-[#759667]">
                      {item.cal} kcal
                    </div>
                    <div className="text-[10px] font-bold text-[#7e91ac]">
                      {item.protein || 0}g P
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sound.playTick(soundEnabled);
                      onDeleteFavorite(index);
                    }}
                    className="p-1.5 text-[#7e91ac] hover:text-[#ef4444] rounded-lg transition"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-xl border border-[#1a273b] text-[#7e91ac] text-xs font-bold transition hover:text-white"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};
