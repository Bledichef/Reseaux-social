<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <img
            class="logo"
            alt="Logo"
            src="./assets/social-media.png"
          />
          <span class="brand-text">Réseau Social</span>
        </div>
        
        <div class="navbar-links">
          <router-link to="/Home/" class="nav-link">
            <i class="fas fa-home"></i>
            <span>Accueil</span>
          </router-link>
          <router-link to="/" class="nav-link">
            <i class="fas fa-user"></i>
            <span>Profil</span>
          </router-link>
          <router-link to="/Connexion" class="nav-link">
            <i class="fas fa-sign-in-alt"></i>
            <span>Connexion</span>
          </router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {},
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --secondary-color: #ec4899;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #1e293b;
  --bg-hover: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --border-color: #334155;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  min-height: 100vh;
  color: var(--text-primary);
}

.navbar {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-md);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: var(--shadow-md);
}

.nav-link i {
  font-size: 1rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .navbar-links {
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-link span {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
}

.fa-thumbs-up {
  color: var(--success-color);
}

.fa-thumbs-down {
  color: var(--danger-color);
}

.fa-heart {
  color: var(--danger-color);
}
</style>
