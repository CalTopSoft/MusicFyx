import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Player from './components/Player.jsx';
import Home from './views/Home.jsx';
import Search from './views/Search.jsx';
import Library from './views/Library.jsx';
import AlbumDetail from './views/AlbumDetail.jsx';
import PlaylistDetail from './views/PlaylistDetail.jsx';
import Settings from './views/Settings.jsx';
import Help from './views/Help.jsx';
import About from './views/About.jsx';
import LoginModal from './components/LoginModal.jsx';
import CreatePlaylistModal from './components/CreatePlaylistModal.jsx';
import { useAuth } from './hooks/useAuth.js';

function App() {
  const { user } = useAuth();

  if (!user) {
    return <LoginModal />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <main className="content-views">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/album/:id" element={<AlbumDetail />} />
            <Route path="/playlist/:id" element={<PlaylistDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Player />
      </div>
      <CreatePlaylistModal />
    </div>
  );
}

export default App;