import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface LuxuryVideoPlayerProps {
  src: string;
  onClose?: () => void;
  autoPlay?: boolean;
}

export default function LuxuryVideoPlayer({ src, onClose, autoPlay = true }: LuxuryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log('Autoplay blocked or failed, waiting for user click:', e);
      });
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [src, autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="relative w-full aspect-video bg-[#030303] overflow-hidden rounded-[1px] border border-zinc-900 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="custom-luxury-video-player"
    >
      {/* 📹 Borderless video element - no native controls */}
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted={isMuted}
        className="w-full h-full object-cover cursor-pointer hover:brightness-105 transition-all"
        onClick={togglePlay}
      />

      {/* 🖤 Dim overlay when paused or when mouse is hovered */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-300 pointer-events-none ${
          !isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 🏷️ Mini HUD on Top Left */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span className="bg-[#d4af37]/85 text-black text-[7px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-xs">
          Rendu Porté
        </span>
      </div>

      {/* ❌ Close button on Top Right if provided */}
      {onClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 z-20 h-6 w-6 flex items-center justify-center bg-black/75 hover:bg-[#d4af37] text-zinc-400 hover:text-black border border-zinc-800 hover:border-[#d4af37] transition-all rounded-xs cursor-pointer active:scale-90"
          title="Fermer la vidéo"
        >
          <X className="h-3 w-3" />
        </button>
      )}

      {/* 🎯 Big Play Button overlay in the absolute center when paused */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto h-12 w-12 flex items-center justify-center rounded-full bg-[#d4af37] text-black hover:scale-105 transition-transform duration-300 shadow-xl shadow-[#d4af37]/20 z-10 cursor-pointer"
        >
          <Play className="h-5 w-5 fill-black ml-0.5" />
        </button>
      )}

      {/* 🎛️ CUSTOM LUXURY BOTTOM CONTROLS BAR */}
      <div 
        className={`absolute bottom-0 inset-x-0 p-3 z-20 flex flex-col gap-2 bg-gradient-to-t from-black via-black/90 to-transparent transition-all duration-300 ${
          !isPlaying || isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0 pointer-events-none'
        }`}
      >
        {/* Seek Bar/Timeline */}
        <div className="flex items-center gap-2 group/timeline">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#d4af37] focus:outline-none transition-colors duration-150 py-1"
            style={{
              background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${progress}%, #27272a ${progress}%, #27272a 100%)`
            }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause control */}
            <button
              type="button"
              onClick={togglePlay}
              className="text-[#d4af37] hover:text-white transition-colors cursor-pointer active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : progress >= 99 ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            {/* Mute/Unmute control */}
            <button
              type="button"
              onClick={toggleMute}
              className="text-zinc-400 hover:text-[#d4af37] transition-colors cursor-pointer active:scale-95"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            {/* Timer Counter */}
            <div className="text-[9px] font-mono text-zinc-400">
              {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration || 0)}
            </div>
          </div>

          <div className="text-[8px] font-mono uppercase tracking-widest text-[#d4af37]/60">
            L'Atelier Aurum
          </div>
        </div>
      </div>
    </motion.div>
  );
}
