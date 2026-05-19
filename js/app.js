/* =====================================================
   UACJ – Sistemas Web 2
   app.js – Funciones del dispositivo
   ===================================================== */

// ── Utilidades ──────────────────────────────────────────

/** Muestra un toast Bootstrap en la esquina inferior */
function mostrarToast(mensaje, tipo = 'bg-success') {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  toast.className = `toast align-items-center text-white border-0 ${tipo}`;
  msg.textContent = mensaje;
  bootstrap.Toast.getOrCreateInstance(toast, { delay: 3000 }).show();
}

/** Agrega una línea al log de eventos */
function logEvento(texto, icono = '▶') {
  const lista = document.getElementById('lista-log');
  const li = document.createElement('li');
  li.className = 'list-group-item';
  const ahora = new Date().toLocaleTimeString('es-MX');
  li.innerHTML = `<span class="text-muted">[${ahora}]</span> ${icono} ${texto}`;
  lista.prepend(li);   // los más recientes arriba
}

// ── 1. Guardar registro ─────────────────────────────────

function guardarRegistro() {
  const nombre    = document.getElementById('nombre').value.trim();
  const matricula = document.getElementById('matricula').value.trim();

  if (!nombre || !matricula) {
    mostrarToast('⚠ Completa nombre y matrícula', 'bg-warning text-dark');
    return;
  }

  document.getElementById('txt-nombre').textContent    = nombre;
  document.getElementById('txt-matricula').textContent = `Matrícula: ${matricula}`;
  document.getElementById('resultado-registro').classList.remove('d-none');

  mostrarToast(`✅ Registro guardado: ${nombre}`);
  logEvento(`Usuario registrado → ${nombre} (${matricula})`, '👤');
}

// ── 2. Geolocalización ──────────────────────────────────

function obtenerUbicacion() {
  if (!navigator.geolocation) {
    mostrarToast('❌ Geolocalización no soportada en este navegador', 'bg-danger');
    logEvento('Geolocalización: NO soportada', '❌');
    return;
  }

  logEvento('Solicitando geolocalización…', '🔄');
  mostrarToast('📡 Obteniendo ubicación…', 'bg-info');

  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude.toFixed(6);
      const lon = pos.coords.longitude.toFixed(6);

      document.getElementById('txt-lat').textContent = `Latitud:  ${lat}`;
      document.getElementById('txt-lon').textContent = `Longitud: ${lon}`;

      const url = `https://www.google.com/maps?q=${lat},${lon}`;
      document.getElementById('link-maps').href = url;

      document.getElementById('resultado-ubicacion').classList.remove('d-none');
      mostrarToast(`📍 Ubicación obtenida (${lat}, ${lon})`);
      logEvento(`Geolocalización OK → Lat: ${lat}, Lon: ${lon}`, '📍');
    },
    function (err) {
      let msg = 'Error al obtener ubicación';
      if (err.code === 1) msg = 'Permiso de ubicación denegado';
      if (err.code === 2) msg = 'Posición no disponible';
      if (err.code === 3) msg = 'Tiempo de espera agotado';
      mostrarToast(`❌ ${msg}`, 'bg-danger');
      logEvento(`Geolocalización FAIL → ${msg}`, '❌');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// ── 3. Vibración ────────────────────────────────────────

function vibrarTelefono() {
  if (!navigator.vibrate) {
    mostrarToast('❌ Vibración no soportada en este dispositivo', 'bg-warning text-dark');
    logEvento('Vibración: NO soportada', '❌');
    return;
  }
  // Patrón: vibra 200ms, pausa 100ms, vibra 200ms
  navigator.vibrate([200, 100, 200]);
  mostrarToast('📳 ¡Vibrando!');
  logEvento('Vibración activada (patrón: 200-100-200 ms)', '📳');
}

// ── 4. Cámara ───────────────────────────────────────────

function abrirCamara() {
  document.getElementById('camara').click();
  logEvento('Cámara abierta…', '📷');
}

function mostrarFoto(event) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('img-preview').src = e.target.result;
    document.getElementById('resultado-foto').classList.remove('d-none');
    mostrarToast('📸 Foto capturada correctamente');
    logEvento(`Foto capturada → ${archivo.name} (${(archivo.size / 1024).toFixed(1)} KB)`, '📸');
  };
  reader.readAsDataURL(archivo);
}

// ── 5. Info del dispositivo (para la tabla de resultados) ─

function cargarInfoDispositivo() {
  const ua  = navigator.userAgent;
  const sw  = window.screen.width;
  const sh  = window.screen.height;
  const geo = 'geolocation'   in navigator ? '✅ Soportada' : '❌ No soportada';
  const vib = 'vibrate'       in navigator ? '✅ Soportada' : '❌ No soportada';
  const cam = 'mediaDevices'  in navigator ? '✅ Disponible' : '❌ No disponible';

  // Detectar SO a grandes rasgos
  let so = 'Desconocido';
  if (/android/i.test(ua))       so = '🤖 Android';
  else if (/iphone|ipad/i.test(ua)) so = '🍎 iOS';
  else if (/windows/i.test(ua))  so = '🪟 Windows';
  else if (/mac/i.test(ua))      so = '🍏 macOS';
  else if (/linux/i.test(ua))    so = '🐧 Linux';

  const filas = [
    ['Sistema Operativo', so],
    ['Resolución de pantalla', `${sw} × ${sh} px`],
    ['Geolocalización', geo],
    ['Vibración', vib],
    ['Cámara / MediaDevices', cam],
    ['Idioma del navegador', navigator.language || 'N/D'],
  ];

  const tbody = document.getElementById('tabla-dispositivo');
  tbody.innerHTML = filas
    .map(([clave, valor]) => `<tr><td>${clave}</td><td>${valor}</td></tr>`)
    .join('');
}

// ── Inicialización ──────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  cargarInfoDispositivo();
  logEvento('Aplicación iniciada', '🚀');
});
