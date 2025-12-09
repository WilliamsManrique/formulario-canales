// Variables globales
let equipoAEliminar = null;

// Convertir código a mayúsculas automáticamente
document.addEventListener('DOMContentLoaded', function() {
    const codigoInput = document.querySelector('input[name="codigo"]');
    if (codigoInput) {
        codigoInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase().replace(/[^A-Z0-9\-_]/g, '');
        });
    }

    // Establecer fecha de mantenimiento por defecto (hoy + 30 días)
    const hoy = new Date();
    const fechaMantenimiento = document.querySelector('input[name="fecha_mantenimiento"]');
    const fechaRegistro = document.querySelector('input[name="fecha_registro"]');
    
    // Fecha de mantenimiento por defecto: hoy + 30 días
    const fechaMant = new Date(hoy);
    fechaMant.setDate(fechaMant.getDate() + 30);
    
    if (fechaMantenimiento && !fechaMantenimiento.value) {
        fechaMantenimiento.value = fechaMant.toISOString().split('T')[0];
    }
    
    if (fechaRegistro && !fechaRegistro.value) {
        fechaRegistro.value = hoy.toISOString().split('T')[0];
    }
    
    // Configurar eventos de eliminación
    configurarEliminacion();
    
    // Configurar modal de confirmación
    configurarModal();
    
    // Configurar validación del formulario
    configurarValidacion();
});

// Configurar eventos de eliminación
function configurarEliminacion() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar, .btn-eliminar-modal');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            const codigo = this.getAttribute('data-codigo');
            mostrarModalEliminacion(id, codigo);
        });
    });
}

// Configurar modal de confirmación
function configurarModal() {
    const modal = document.getElementById('confirmModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    
    if (!modal) return;
    
    // Botón cancelar
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        equipoAEliminar = null;
    });
    
    // Botón confirmar
    confirmBtn.addEventListener('click', function() {
        if (equipoAEliminar) {
            window.location.href = `/eliminar/${equipoAEliminar.id}`;
        }
    });
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            equipoAEliminar = null;
        }
    });
}

// Mostrar modal de eliminación
function mostrarModalEliminacion(id, codigo) {
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal && modalMessage) {
        equipoAEliminar = { id, codigo };
        modalMessage.textContent = `¿Está seguro que desea eliminar el equipo ${codigo}?`;
        modal.style.display = 'block';
    }
}

// Configurar validación del formulario
function configurarValidacion() {
    const formularios = document.querySelectorAll('form');
    
    formularios.forEach(formulario => {
        formulario.addEventListener('submit', function(event) {
            // Validación básica
            const codigo = this.querySelector('input[name="codigo"]');
            const tipoEquipo = this.querySelector('select[name="tipo_equipo"]');
            const marca = this.querySelector('input[name="marca"]');
            
            if (codigo && tipoEquipo && marca) {
                if (!codigo.value.trim()) {
                    event.preventDefault();
                    mostrarAlerta('Por favor, ingrese un código', 'warning');
                    codigo.focus();
                    return false;
                }
                
                if (!tipoEquipo.value) {
                    event.preventDefault();
                    mostrarAlerta('Por favor, seleccione un tipo de equipo', 'warning');
                    tipoEquipo.focus();
                    return false;
                }
                
                if (!marca.value.trim()) {
                    event.preventDefault();
                    mostrarAlerta('Por favor, ingrese una marca', 'warning');
                    marca.focus();
                    return false;
                }
            }
            
            return true;
        });
    });
}

// Mostrar alerta personalizada
function mostrarAlerta(mensaje, tipo) {
    // Crear elemento de alerta
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-custom fade-in`;
    alerta.innerHTML = `
        <span>
            ${tipo === 'success' ? '✅' : 
              tipo === 'danger' ? '❌' : 
              tipo === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span>${mensaje}</span>
    `;
    
    // Insertar al principio del contenedor
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alerta, container.firstChild);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.style.opacity = '0';
                alerta.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (alerta.parentNode) {
                        alerta.parentNode.removeChild(alerta);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Función para búsqueda rápida
function buscarEquipos(termino) {
    window.location.href = `/buscar?q=${encodeURIComponent(termino)}`;
}

// Configurar búsqueda en tiempo real (opcional)
function configurarBusquedaEnTiempoReal() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        let timeoutId;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            const termino = this.value.trim();
            
            if (termino.length >= 2) {
                timeoutId = setTimeout(() => {
                    buscarEquipos(termino);
                }, 500);
            } else if (termino.length === 0) {
                // Si se borra el término, recargar sin búsqueda
                clearTimeout(timeoutId);
                window.location.href = '/';
            }
        });
    }
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    configurarBusquedaEnTiempoReal();
});