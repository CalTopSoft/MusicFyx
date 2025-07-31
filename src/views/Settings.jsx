import { useConfig } from '../hooks/useConfig.jsx'; // o jsx según como tengas

function Settings() {
  const { darkMode, setDarkMode, audioQuality, setAudioQuality } = useConfig();

  return (
    <div className="view">
      <h1 className="text-2xl font-bold mb-4">Configuración</h1>
      <div className="settings-panel space-y-6">

        <div>
          <h2 className="font-semibold mb-2">Tema</h2>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span>{darkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
          </label>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Calidad de audio</h2>
          <select
            value={audioQuality}
            onChange={(e) => setAudioQuality(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="low">Baja</option>
            <option value="standard">Estándar</option>
            <option value="high">Alta</option>
          </select>
        </div>

      </div>
    </div>
  );
}

export default Settings;
