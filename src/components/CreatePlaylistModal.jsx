import { useState, useEffect, useContext } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { AuthContext } from '../context/AuthContext.jsx';

function CreatePlaylistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);
  const [songId, setSongId] = useState(null);
  const [playlistName, setPlaylistName] = useState('');
  
  // Obtener usuario del contexto
  const { user } = useContext(AuthContext);
  
  // Pasar userId al hook de WebSocket
  const { playlists, createPlaylist, updatePlaylist, isConnected, connectionStatus } = useWebSocket(user ? user.id : null);

  useEffect(() => {
    const handleOpenAdd = (e) => {
      setSongId(e.detail.songId);
      setIsAddingToPlaylist(true);
      setIsOpen(true);
    };
    const handleOpenCreate = () => {
      setIsAddingToPlaylist(false);
      setIsOpen(true);
    };

    document.addEventListener('openAddToPlaylistModal', handleOpenAdd);
    document.addEventListener('openCreatePlaylistModal', handleOpenCreate);
    return () => {
      document.removeEventListener('openAddToPlaylistModal', handleOpenAdd);
      document.removeEventListener('openCreatePlaylistModal', handleOpenCreate);
    };
  }, []);

  const handleCreate = () => {
    if (!playlistName.trim()) {
      alert('Por favor, ingresa un nombre para la playlist');
      return;
    }

    if (!user?.id) {
      alert('Error: Usuario no identificado. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!isConnected) {
      alert('Error: No hay conexión con el servidor. Inténtalo nuevamente.');
      return;
    }

    console.log('Creating playlist with user:', user.id);
    createPlaylist({ 
      id: `pl_${Date.now()}`, 
      name: playlistName.trim(), 
      songIds: [],
      userId: user.id 
    });
    
    setPlaylistName('');
    setIsOpen(false);
  };

  const handleAddToPlaylist = (playlistId) => {
    if (!user?.id) {
      alert('Error: Usuario no identificado. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (!isConnected) {
      alert('Error: No hay conexión con el servidor. Inténtalo nuevamente.');
      return;
    }

    updatePlaylist(playlistId, songId, 'add');
    setIsOpen(false);
  };

  // No mostrar modal si no hay usuario
  if (!user) {
    return null;
  }

  return (
    isOpen && (
      <div className="modal active">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{isAddingToPlaylist ? 'Agregar a Playlist' : 'Crear Playlist'}</h2>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {isAddingToPlaylist ? (
              <>
                <div className="flex flex-col gap-2">
                  {playlists.length === 0 ? (
                    <p className="text-gray-500">No tienes playlists aún</p>
                  ) : (
                    playlists.map(playlist => (
                      <button
                        key={playlist.id}
                        onClick={() => handleAddToPlaylist(playlist.id)}
                        className="song-action-btn"
                      >
                        {playlist.name}
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={e => setPlaylistName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleCreate()}
                  className="w-full"
                  placeholder="Ingresa el nombre de tu playlist"
                  autoFocus
                />
                <button 
                  onClick={handleCreate} 
                  className="btn-primary mt-4"
                  disabled={!playlistName.trim() || !isConnected}
                >
                  {connectionStatus === 'connecting' ? 'Conectando...' : 
                   connectionStatus === 'connected' ? 'Crear' : 
                   connectionStatus === 'reconnecting' ? 'Reconectando...' :
                   connectionStatus === 'error' ? 'Error de conexión' :
                   connectionStatus === 'no-user' ? 'Sin usuario' :
                   'Desconectado'}
                </button>
                {!isConnected && (
                  <p className="text-red-500 text-sm mt-2">
                    Estado: {connectionStatus}
                    {connectionStatus === 'error' && ' - Verifica que el servidor esté corriendo en puerto 5000'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default CreatePlaylistModal;