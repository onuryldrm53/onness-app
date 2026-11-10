import React, { useEffect, useRef } from 'react';
import { WeightRecord } from '../types';

interface WeightChartProps {
  weights: WeightRecord[];
  targetWeight: number;
  emptyText: string;
}

export const WeightChart: React.FC<WeightChartProps> = ({ weights, targetWeight, emptyText }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 220 * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = 220;
    ctx.clearRect(0, 0, W, H);

    if (weights.length === 0) {
      ctx.fillStyle = '#7e91ac';
      ctx.font = '13px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(emptyText, W / 2, H / 2);
      return;
    }

    const padding = { top: 25, right: 30, bottom: 35, left: 45 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    const values = weights.map(w => w.weight);
    let minW = Math.min(...values, targetWeight) - 2;
    let maxW = Math.max(...values, targetWeight) + 2;
    if (minW === maxW) {
      minW -= 2;
      maxW += 2;
    }

    const getY = (val: number) => padding.top + chartH - ((val - minW) / (maxW - minW)) * chartH;
    const getX = (idx: number) => {
      if (weights.length === 1) return padding.left + chartW / 2;
      return padding.left + (idx / (weights.length - 1)) * chartW;
    };

    // Horizontal grid lines
    ctx.strokeStyle = 'rgba(27, 40, 29, 0.45)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const val = minW + ((maxW - minW) / 4) * i;
      const y = getY(val);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#7e91ac';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(1), padding.left - 8, y + 3);
    }

    // Target dashed line
    const targetY = getY(targetWeight);
    ctx.save();
    ctx.strokeStyle = '#7fa890';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, targetY);
    ctx.lineTo(W - padding.right, targetY);
    ctx.stroke();
    ctx.restore();

    // Area fill gradient
    ctx.beginPath();
    weights.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.weight);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    grad.addColorStop(0, 'rgba(117, 150, 103, 0.28)');
    grad.addColorStop(1, 'rgba(117, 150, 103, 0.0)');

    ctx.lineTo(getX(weights.length - 1), padding.top + chartH);
    ctx.lineTo(getX(0), padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    ctx.strokeStyle = '#759667';
    ctx.lineWidth = 3;
    weights.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.weight);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Circles and labels
    weights.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt.weight);

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#060a0f';
      ctx.fill();
      ctx.strokeStyle = '#92b683';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#e2eaf4';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${pt.weight}`, x, y - 9);

      ctx.fillStyle = '#7e91ac';
      ctx.font = '10px -apple-system, sans-serif';
      ctx.fillText(pt.date, x, H - padding.bottom + 18);
    });
  }, [weights, targetWeight, emptyText]);

  return <canvas ref={canvasRef} className="w-full h-[220px] block touch-pan-y" />;
};
