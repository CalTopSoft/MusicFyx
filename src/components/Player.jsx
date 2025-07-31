import { usePlayer } from '../hooks/usePlayer.js';

function Player() {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    currentTime, // ← NUEVO
    duration,    // ← NUEVO
    volume, 
    togglePlayPause, 
    nextSong, 
    prevSong, 
    seekTo, 
    setPlayerVolume 
  } = usePlayer();

  // Función para formatear tiempo en mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) return null;

  return (
    <div className="music-player">
      <div className="player-song-info">
        <div className="song-cover">
          <img src={currentSong.cover || '/default-cover.png'} alt="Cover" />
        </div>
        <div className="song-details">
          <p className="song-title">{currentSong.title}</p>
          <p className="song-artist">{currentSong.artist}</p>
        </div>
      </div>
      <div className="player-controls">
        <div className="control-buttons">
          <button onClick={prevSong} className="control-btn">
            <i className="fas fa-step-backward"></i>
          </button>
          <button onClick={togglePlayPause} className="control-btn play-pause">
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button onClick={nextSong} className="control-btn">
            <i className="fas fa-step-forward"></i>
          </button>
        </div>
        <div className="progress-bar">
          <div className="time-display">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="time-separator"> / </span>
            <span className="total-time">{formatTime(duration)}</span>
          </div>
          <div className="progress-container">
            <div className="progress" style={{ width: `${progress}%` }}></div>
            <input
              type="range"
              value={progress}
              onChange={e => seekTo(e.target.value)}
              className="progress-slider"
              max="100"
            />
          </div>
        </div>
      </div>
      <div className="player-extras">
        <div className="volume-control">
          <i className="fas fa-volume-up volume-btn"></i>
          <input
            type="range"
            value={volume * 100}
            onChange={e => setPlayerVolume(e.target.value)}
            className="volume-slider"
            max="100"
          />
        </div>
      </div>
    </div>
  );
}

export default Player;