import { IntroSettings } from '../intro/intro.types';

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export function drawIntroOnContext(
  ctx: CanvasRenderingContext2D,
  settings: IntroSettings,
  elapsed: number, // elapsed is in seconds
  w: number,
  h: number,
) {
  ctx.save();
  const progress = Math.min(1, Math.max(0, elapsed / settings.duration));
  const mainText = settings.title || "";
  const subText = settings.subtitle || "";
  const template = settings.template || "minimal";

  // Font setup (scaled to match 450px base layout)
  const baseScale = h / 450;
  const mainFontSize = Math.round((settings.titleFontSize || 100) * baseScale);
  const subFontSize = Math.round((settings.subtitleFontSize || 50) * baseScale);
  const fontMain = `bold ${mainFontSize}px "${settings.fontFamily}", sans-serif`;
  const fontSub = `normal ${subFontSize}px "${settings.fontFamily}", sans-serif`;

  const yOffsetMain = subText ? -mainFontSize * 0.5 : 0;
  const yOffsetSub = mainText ? mainFontSize * 0.6 : 0;

  // Render background first
  ctx.fillStyle = settings.bgColor;
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = settings.textColor;
  ctx.textBaseline = "middle";

  if (template === "minimal") {
    // Fade in 0.5s, fade out 0.5s
    let alpha = 1;
    if (elapsed < 0.5) alpha = elapsed / 0.5;
    else if (elapsed > settings.duration - 0.5) alpha = Math.max(0, (settings.duration - elapsed) / 0.5);
    
    ctx.globalAlpha = alpha;
    ctx.textAlign = "center";
    
    // Gentle float up
    const yFloat = (1 - easeOutQuart(progress)) * (h * 0.05);

    ctx.font = fontMain;
    if (mainText) {
      ctx.fillText(mainText, w / 2, h / 2 + yOffsetMain + yFloat);
    }
    if (subText) {
      ctx.font = fontSub;
      ctx.globalAlpha = alpha * 0.8;
      ctx.fillText(subText, w / 2, h / 2 + yOffsetSub + yFloat);
    }
  } 
  else if (template === "cinematic") {
     // Cinematic black bars
     const barHeight = h * 0.12;
     ctx.fillStyle = "#000000";
     ctx.fillRect(0, 0, w, barHeight);
     ctx.fillRect(0, h - barHeight, w, barHeight);

     let alpha = 1;
     if (elapsed < 0.5) alpha = Math.max(0, elapsed / 0.5);
     else if (elapsed > settings.duration - 0.5) alpha = Math.max(0, (settings.duration - Math.max(0, elapsed)) / 0.5);
     
     ctx.globalAlpha = alpha;
     ctx.fillStyle = settings.textColor;
     ctx.textAlign = "center";

     // Very slow scale from 1.15 down to 1.0 
     const scale = 1.15 - (progress * 0.15); 
     
     ctx.translate(w/2, h/2);
     ctx.scale(scale, scale);
     
     // Shadow
     ctx.shadowColor = "rgba(0,0,0,0.8)";
     ctx.shadowBlur = h * 0.02;

     ctx.font = fontMain;
     if (mainText) ctx.fillText(mainText, 0, yOffsetMain);
     if (subText) {
       ctx.font = fontSub;
       ctx.globalAlpha = alpha * 0.7;
       ctx.fillText(subText, 0, yOffsetSub);
     }
  }
  else if (template === "glitch") {
    let alpha = 1;
    if (elapsed < 0.2) alpha = elapsed / 0.2;
    else if (elapsed > settings.duration - 0.2) alpha = Math.max(0, (settings.duration - elapsed) / 0.2);
    ctx.globalAlpha = alpha;
    
    ctx.textAlign = "center";
    
    // Calculate glitch timing based on actual seconds
    const isGlitchTime = (Math.random() < 0.08) && progress > 0.1 && progress < 0.9;
    
    let xOffset = 0;
    let yOffset = 0;
    if (isGlitchTime) {
      xOffset = (Math.random() - 0.5) * (w * 0.03);
      yOffset = (Math.random() - 0.5) * (h * 0.02);
    }

    ctx.font = fontMain;
    const yMain = h / 2 + yOffsetMain + yOffset;
    const xMain = w / 2 + xOffset;

    if (isGlitchTime && mainText) {
      // Split RGB
      ctx.globalCompositeOperation = 'screen';
      const offsetAmt = w * 0.015;
      
      ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
      ctx.fillText(mainText, xMain - offsetAmt, yMain);
      
      ctx.fillStyle = 'rgba(0, 255, 0, 0.9)';
      ctx.fillText(mainText, xMain + offsetAmt, yMain);
      
      ctx.fillStyle = 'rgba(0, 0, 255, 0.9)';
      ctx.fillText(mainText, xMain, yMain + offsetAmt * 0.5);
      
      // Glitch visual block
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
      ctx.fillRect(0, yMain - (Math.random() * mainFontSize), w, Math.random() * mainFontSize);
    } else if (mainText) {
      ctx.fillText(mainText, xMain, yMain);
    }
    
    ctx.globalCompositeOperation = 'source-over';
    if (subText) {
      ctx.font = fontSub;
      ctx.fillStyle = settings.textColor;
      ctx.fillText(subText, w / 2, h / 2 + yOffsetSub);
    }
  }
  else if (template === "neon") {
    // Darken background context to ensure neon pops
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, w, h);

    ctx.textAlign = "center";
    
    // Fast pulsing effect (flicker)
    const pulseFreq = 10;
    const pulse = Math.sin(elapsed * Math.PI * pulseFreq) * 0.15 + 0.85;
    
    let alpha = 1;
    if (elapsed < 0.3) alpha = elapsed / 0.3;
    else if (elapsed > settings.duration - 0.3) alpha = Math.max(0, (settings.duration - elapsed) / 0.3);
    
    ctx.globalAlpha = alpha;
    ctx.font = fontMain;
    ctx.shadowColor = settings.textColor;
    ctx.shadowBlur = (h * 0.04) * pulse;
    ctx.fillStyle = settings.textColor;
    
    if (mainText) {
      ctx.fillText(mainText, w / 2, h / 2 + yOffsetMain);
    }
    
    if (subText) {
      ctx.font = fontSub;
      ctx.shadowBlur = (h * 0.02) * pulse;
      ctx.globalAlpha = alpha * 0.9;
      ctx.fillText(subText, w / 2, h / 2 + yOffsetSub);
    }
  }
  else if (template === "typewriter") {
    // Typing duration scales slightly with text length, capped at 60% of duration
    const maxTypingDur = settings.duration * 0.6;
    const typingDuration = Math.min(1.5, maxTypingDur);
    const typingProgress = Math.min(1, elapsed / typingDuration);
    
    const charCount = Math.floor(typingProgress * mainText.length);
    const visibleText = mainText.substring(0, charCount);
    
    // Cursor blinks every 400ms
    const showCursor = (Math.floor((elapsed * 1000) / 400) % 2 === 0);
    
    ctx.font = fontMain;
    const textWidth = ctx.measureText(mainText).width;
    ctx.textAlign = "left";
    
    const startX = (w - textWidth) / 2;
    if (mainText) {
      ctx.fillText(visibleText + (showCursor && progress < 0.95 ? "_" : ""), startX, h / 2 + yOffsetMain);
    }
    
    if (subText && elapsed > typingDuration) {
      const remainingTime = elapsed - typingDuration;
      const subTypingProgress = Math.min(1, remainingTime / 0.5);
      const subCharCount = Math.floor(subTypingProgress * subText.length);
      const subVisibleText = subText.substring(0, subCharCount);
      
      ctx.font = fontSub;
      const subWidth = ctx.measureText(subText).width;
      const subStartX = (w - subWidth) / 2;
      ctx.fillText(subVisibleText, subStartX, h / 2 + yOffsetSub);
    }
  }

  ctx.restore();
}
