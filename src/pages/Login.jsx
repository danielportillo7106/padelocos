import { supabase } from '../supabase';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Le preguntamos a Supabase usando tu columna 'username'
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('username', celular.trim())
        .eq('password', password)
        .maybeSingle(); // <--- LA MAGIA ESTÁ AQUÍ

      // Si hay un error (no lo encontró o la contraseña está mal)
      if (error || !data) {
        alert("Datos incorrectos, crack. Revisa tu usuario o contraseña.");
        setCargando(false);
        return;
      }

      // ¡El login fue exitoso!
      localStorage.setItem('usuarioLogueado', 'true');
      navigate('/home');

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      alert("Hubo un problema al conectar con el servidor.");
      setCargando(false);
    }
  };

  return (
    <div className="login-split-container">
      
      {/* LADO IZQUIERDO: Imagen (Solo visible en Desktop) */}
      <div className="login-image-side">
        <div className="image-overlay">
          <h2 className="overlay-text">BIENVENIDO AL REY DE LA PISTA</h2>
        </div>
      </div>

      {/* LADO DERECHO: El formulario de siempre */}
      <div className="login-form-side">
        <form className="login-content-fusion" onSubmit={handleLogin}>
          
          <div className="avatar-fusion">
            <img src="/logo_padelocos.png" alt="Logo Padelocos" className="logo-img"/>
          </div>

          <h1 className="title-fusion">PADELOCOS</h1>
          
          <div className="input-group-fusion">
            <input 
              type="text" 
              placeholder="Celular" 
              className="input-fusion"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="input-fusion"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="button-fusion" disabled={cargando}>
            {cargando ? 'INGRESANDO...' : 'INGRESAR'}
          </button>

          <a href="#" className="forgot-fusion" onClick={(e) => e.preventDefault()}>
            OLVIDÉ MI CONTRASEÑA
          </a>

        </form>
      </div>
      
    </div>
  );
}

export default Login;