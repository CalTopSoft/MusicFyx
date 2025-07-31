import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';

function LoginModal() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.username);
      }
    } catch (err) {
      console.error('Error en autenticación:', err.message);
    }
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full"
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full"
              />
            </div>
          )}
          <button onClick={handleSubmit} className="btn-primary">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
          <p className="mt-4 text-center">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent ml-1"
            >
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;