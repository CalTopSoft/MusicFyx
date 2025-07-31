import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext.jsx';

export const usePlayer = () => useContext(PlayerContext);