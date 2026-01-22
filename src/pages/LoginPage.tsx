import React, { useState } from 'react';
import upfLogo from '../assets/upf-logo.png';
import loginIcon from '../assets/login-icon.svg';
import passwordIcon from '../assets/password-icon.svg';

const LoginPage: React.FC = () => {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ identifiant: '', motDePasse: '' });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { identifiant: '', motDePasse: '' };

    if (!identifiant.trim()) {
      newErrors.identifiant = 'Vous devez entrer votre identifiant.';
    }

    if (!motDePasse.trim()) {
      newErrors.motDePasse = 'Vous devez entrer votre mot de passe.';
    }

    setErrors(newErrors);

    if (!newErrors.identifiant && !newErrors.motDePasse) {
      console.log('Connexion réussie:', { identifiant, motDePasse });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#2b8aaf] to-[#1e5f7f] font-ubuntu">
      {/* Main Card */}
      <div className="bg-white rounded-lg shadow-2xl w-[440px] overflow-hidden">
        
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="px-12 py-10 flex flex-col gap-6">
          
          {/* Logo */}
          <div className="w-full flex justify-center mb-2">
            <img src={upfLogo} alt="UPF Logo" className="w-56 h-auto object-contain" />
          </div>

          {/* Identifiant Field */}
          <div className="flex flex-col">
            <input 
              type="text" 
              placeholder="Identifiant *"
              value={identifiant}
              onChange={(e) => {
                setIdentifiant(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, identifiant: '' });
                }
              }}
              className={`w-full h-14 outline-none px-4 text-sm text-gray-600 border-2 rounded placeholder-gray-400 transition-colors bg-white ${
                errors.identifiant ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {errors.identifiant && (
              <span className="text-red-500 text-xs mt-1.5">{errors.identifiant}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <div className={`flex w-full h-14 border-2 rounded overflow-hidden transition-colors ${
              errors.motDePasse ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
            }`}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mot de passe *"
                value={motDePasse}
                onChange={(e) => {
                  setMotDePasse(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors({ ...errors, motDePasse: '' });
                  }
                }}
                className="flex-1 h-full outline-none px-4 text-sm text-gray-600 placeholder-gray-400 bg-white"
              />
              <button 
                onClick={togglePasswordVisibility}
                type="button"
                className="bg-[#1a3a4d] px-4 flex items-center justify-center hover:bg-[#0f2a3b] transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            {errors.motDePasse && (
              <span className="text-red-500 text-xs mt-1.5">{errors.motDePasse}</span>
            )}
          </div>

          {/* Login Button */}
          <button type="submit" className="w-full bg-[#1a3a4d] text-white h-11 rounded-lg shadow-md flex items-center justify-center gap-2 hover:bg-[#0f2a3b] transition-all mt-2 font-semibold text-sm uppercase tracking-widest">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 17v-6h4v6h5v-8h3L12 2 2 9h3v8z"/>
            </svg>
            <span>SE CONNECTER</span>
          </button>

          {/* Separator */}
          <div className="h-px bg-gray-300 w-full my-2"></div>

          {/* Footer Text */}
          <div className="text-sm leading-relaxed text-gray-700">
            <span className="text-gray-700">Pour des raisons de sécurité, veuillez vous </span>
            <a href="#" className="text-blue-600 hover:underline font-medium">déconnecter</a>
            <span className="text-gray-700"> et fermer votre navigateur lorsque vous avez fini d'accéder aux services authentifiés.</span>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
