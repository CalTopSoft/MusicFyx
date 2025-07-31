import { useState, useEffect } from 'react';
import axios from 'axios';
import SongList from '../components/SongList.jsx';
import AlbumGrid from '../components/AlbumGrid.jsx';
import { API_BASE_URL } from '../config'; // Importa la URL base

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ songs: [], albums: [] });

  useEffect(() => {
    if (query.trim()) {
      const searchData = async () => {
        const songsRes = await axios.get(`${API_BASE_URL}/api/songs`);
        const albumsRes = await axios.get(`${API_BASE_URL}/api/albums`);
        const filteredSongs = songsRes.data.filter(song =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
        );
        const filteredAlbums = albumsRes.data.filter(album =>
          album.title.toLowerCase().includes(query.toLowerCase()) ||
          album.artist.toLowerCase().includes(query.toLowerCase())
        );
        setResults({ songs: filteredSongs, albums: filteredAlbums });
      };
      searchData();
    }
  }, [query]);

  return (
    <div className="view">
      <div className="main-header">
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="¿Qué quieres escuchar?"
            />
            {query && (
              <button onClick={() => setQuery('')} className="clear-search">
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="results-container">
        {query && (
          <>
            <div className="search-section">
              <h3>Canciones</h3>
              <SongList songs={results.songs} />
            </div>
            <div className="search-section">
              <h3>Álbumes</h3>
              <AlbumGrid albums={results.albums} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;
