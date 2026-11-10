import React, { useState } from 'react';
import { Camera, Image, RotateCcw, X, Check } from 'lucide-react';
import { Language } from '../types';
import { I18N } from '../data/translations';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  postureId: string;
  exerciseName: string;
  currentPhoto: string | undefined;
  onSavePhoto: (postureId: string, url: string | null) => void;
  lang: Language;
}

export const MediaModal: React.FC<MediaModalProps> = ({
  isOpen,
  onClose,
  postureId,
  exerciseName,
  currentPhoto,
  onSavePhoto,
  lang,
}) => {
  const [url, setUrl] = useState('');
  const t = I18N[lang];

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      if (base64) {
        onSavePhoto(postureId, base64);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = () => {
    if (url.trim()) {
      onSavePhoto(postureId, url.trim());
    }
    onClose();
  };

  const handleReset = () => {
    onSavePhoto(postureId, null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#101926] border-2 border-[#759667] rounded-3xl p-6 shadow-2xl text-[#d4dde8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1a273b]">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#759667]" />
            <h2 className="text-base font-black text-[#e2eaf4]">
              {exerciseName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#7e91ac] hover:text-white rounded-xl bg-[#0b121b] border border-[#1a273b]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#7e91ac] mt-3 mb-4">
          {t.mediaModalDesc}
        </p>

        {/* Gallery / File Picker */}
        <label className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-[#759667]/15 border-2 border-dashed border-[#759667] text-[#e2eaf4] text-xs font-bold cursor-pointer hover:bg-[#759667]/25 transition mb-3">
          <Image className="w-4 h-4 text-[#759667]" />
          <span>{t.chooseFromGallery}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* URL Input */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-[#7e91ac] mb-1.5 uppercase tracking-wider">
            {t.orImageUrl}
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-[#0b121b] border border-[#1a273b] focus:border-[#759667] text-xs text-[#e2eaf4] rounded-xl px-3 py-2.5 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1a273b]">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-[#ef4444]/40 hover:bg-[#ef4444]/15 text-[#ef4444] text-xs font-bold transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetToDefault}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-[#1a273b] hover:border-[#7e91ac] text-xs font-bold text-[#7e91ac] transition"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleUrlSave}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#759667] hover:bg-[#92b683] text-[#060a0f] text-xs font-black transition active:scale-95 shadow-md shadow-[#759667]/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
