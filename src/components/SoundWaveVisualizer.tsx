import React, { useEffect, useState } from 'react';
import { sound, SoundEvent } from '../utils/audio';

interface SoundWaveVisualizerProps {
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  barColor?: string;
  showIcon?: boolean;
  className?: string;
}

export const SoundWaveVisualizer: React.FC<SoundWaveVisualizerProps> = ({
  size = 'md',
  isActive: forcedActive,
  barColor = 'bg-[#759667]',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastType, setLastType] = useState<SoundEvent['type'] | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;
    let isMounted = true;

    const unsubscribe = sound.subscribe((event) => {
      if (!isMounted) return;
      setIsPlaying(true);
      setLastType(event.type);
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (!isMounted) return;
        setIsPlaying(false);
        setLastType(null);
      }, Math.max(180, event.duration));
    });

    return () => {
      isMounted = false;
      unsubscribe();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const active = forcedActive || isPlaying;

  // Define bar height scales based on sound type
  const getMultiplier = () => {
    if (!active) return 0.2;
    if (lastType === 'finish') return 1.0;
    if (lastType === 'success') return 0.9;
    if (lastType === 'warning') return 0.75;
    return 0.6; // tap / default active
  };

  const multiplier = getMultiplier();

  const barDimensions = {
    sm: { containerH: 'h-4', barW: 'w-0.5 sm:w-1', maxH: 14, gap: 'gap-0.5 sm:gap-1' },
    md: { containerH: 'h-6', barW: 'w-1 sm:w-1.5', maxH: 22, gap: 'gap-1' },
    lg: { containerH: 'h-9', barW: 'w-1.5 sm:w-2', maxH: 34, gap: 'gap-1.5' },
  }[size];

  // 5 bar animated heights (values from 0.1 to 1.0)
  const baseHeights = [0.45, 0.85, 1.0, 0.7, 0.5];

  return (
    <div
      className={`inline-flex items-center justify-center ${barDimensions.containerH} ${barDimensions.gap} ${className}`}
      title={active ? 'Ses çalıyor' : 'Ses hazır'}
    >
      {baseHeights.map((bh, i) => {
        const heightPx = Math.max(3, Math.round(bh * multiplier * barDimensions.maxH));
        return (
          <span
            key={i}
            className={`rounded-full transition-all duration-150 ${barDimensions.barW} ${barColor} ${
              active ? 'opacity-100 shadow-[0_0_8px_rgba(117,150,103,0.6)]' : 'opacity-35'
            }`}
            style={{
              height: `${heightPx}px`,
              transitionDelay: `${i * 20}ms`,
            }}
          />
        );
      })}
    </div>
  );
};
