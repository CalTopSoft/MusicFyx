import { createContext, useState, useRef, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0); // ← NUEVO: tiempo actual en segundos
  const [duration, setDuration] = useState(0); // ← NUEVO: duración total en segundos
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      const current = audio.currentTime || 0;
      const total = audio.duration || 0;
      
      setCurrentTime(current); // ← NUEVO: actualizar tiempo actual
      setDuration(total); // ← NUEVO: actualizar duración total
      setProgress((current / total) * 100 || 0);
    };

    const handleEnded = () => {
      nextSong();
    };

    // ← NUEVO: evento para obtener la duración cuando se carga la canción
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata); // ← NUEVO

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata); // ← NUEVO
    };
  }, []);

  const playSong = (song, playlist = []) => {
    setCurrentSong(song);
    setCurrentPlaylist(playlist);
    audioRef.current.src = song.filePath;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextSong = () => {
    const currentIndex = currentPlaylist.findIndex(s => s.id === currentSong?.id);
    if (currentIndex < currentPlaylist.length - 1) {
      playSong(currentPlaylist[currentIndex + 1], currentPlaylist);
    }
  };

  const prevSong = () => {
    const currentIndex = currentPlaylist.findIndex(s => s.id === currentSong?.id);
    if (currentIndex > 0) {
      playSong(currentPlaylist[currentIndex - 1], currentPlaylist);
    }
  };

  const seekTo = (value) => {
    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
  };

  const setPlayerVolume = (value) => {
    setVolume(value / 100);
    audioRef.current.volume = value / 100;
  };

  return (
    <PlayerContext.Provider value={{
      currentSong,
      isPlaying,
      progress,
      currentTime, // ← NUEVO: tiempo actual en segundos
      duration, // ← NUEVO: duración total en segundos
      volume,
      playSong,
      togglePlayPause,
      nextSong,
      prevSong,
      seekTo,
      setPlayerVolume
    }}>
      {children}
    </PlayerContext.Provider>
  );
};