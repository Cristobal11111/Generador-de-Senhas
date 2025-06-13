// Elementos do DOM
const campoSenha = document.getElementById('campoSenha');
const btnGenerar = document.getElementById('btnGenerar');
const btnCopiar = document.getElementById('btnCopiar');
const btnDisminuir = document.getElementById('btnDisminuir');
const btnAumentar = document.getElementById('btnAumentar');
const valorLongitud = document.getElementById('valorLongitud');
const opciones = document.querySelectorAll('.opcion');
const nivelFuerza = document.getElementById('nivelFuerza');
const botonConfig = document.getElementById('botonConfig');
const panelConfig = document.getElementById('panelConfig');
const btnGuardar = document.getElementById('btnGuardar');
const temaColor = document.getElementById('temaColor');
const tamanoFuente = document.getElementById('tamanoFuente');
const animaciones = document.getElementById('animaciones');

// Variáveis
let longitud = 12;
let opcionesSeleccionadas = {
    mayusculas: true,
    minusculas: true,
    numeros: false,
    simbolos: false
};

// Conjuntos de caracteres
const caracteres = {
    mayusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Gerar senha inicial
gerarSenha();

// Event Listeners
btnGenerar.addEventListener('click', gerarSenha);
btnCopiar.addEventListener('click', copiarSenha);
btnDisminuir.addEventListener('click', () => alterarComprimento(-1));
btnAumentar.addEventListener('click', () => alterarComprimento(1));

opciones.forEach(opcion => {
    opcion.addEventListener('click', () => {
        const tipo = opcion.dataset.tipo;
        opcion.classList.toggle('activa');
        opcionesSeleccionadas[tipo] = !opcionesSeleccionadas[tipo];
        gerarSenha();
    });
});

botonConfig.addEventListener('click', () => {
    panelConfig.classList.toggle('aberto');
});

btnGuardar.addEventListener('click', salvarPreferencias);

// Funções
function alterarComprimento(variacao) {
    longitud += variacao;
    if (longitud < 6) longitud = 6;
    if (longitud > 24) longitud = 24;
    valorLongitud.textContent = longitud;
    gerarSenha();
}

function gerarSenha() {
    // Construir o conjunto de caracteres disponíveis
    let caracteresDisponiveis = '';
    if (opcionesSeleccionadas.mayusculas) caracteresDisponiveis += caracteres.mayusculas;
    if (opcionesSeleccionadas.minusculas) caracteresDisponiveis += caracteres.minusculas;
    if (opcionesSeleccionadas.numeros) caracteresDisponiveis += caracteres.numeros;
    if (opcionesSeleccionadas.simbolos) caracteresDisponiveis += caracteres.simbolos;
    
    // Se não há caracteres selecionados, usar maiúsculas e minúsculas
    if (!caracteresDisponiveis) {
        caracteresDisponiveis = caracteres.mayusculas + caracteres.minusculas;
    }
    
    // Gerar a senha
    let senha = '';
    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteresDisponiveis.length);
        senha += caracteresDisponiveis[indiceAleatorio];
    }
    
    campoSenha.value = senha;
    atualizarForca();
}

function copiarSenha() {
    campoSenha.select();
    document.execCommand('copy');
    
    // Feedback visual
    const textoOriginal = btnCopiar.innerHTML;
    btnCopiar.innerHTML = '<i class="fas fa-check"></i> Copiada!';
    btnCopiar.style.background = '#2ecc71';
    
    setTimeout(() => {
        btnCopiar.innerHTML = textoOriginal;
        btnCopiar.style.background = '';
    }, 2000);
}

function atualizarForca() {
    // Calcular força baseada no comprimento e tipos de caracteres
    let forca = 0;
    if (longitud >= 8) forca += 25;
    if (longitud >= 12) forca += 25;
    if (opcionesSeleccionadas.mayusculas) forca += 15;
    if (opcionesSeleccionadas.minusculas) forca += 15;
    if (opcionesSeleccionadas.numeros) forca += 10;
    if (opcionesSeleccionadas.simbolos) forca += 10;
    
    // Garantir que não ultrapasse 100%
    forca = Math.min(forca, 100);
    
    // Atualizar a barra visual
    nivelFuerza.style.width = `${forca}%`;
    
    // Mudar cor conforme a força
    if (forca < 40) {
        nivelFuerza.style.background = 'linear-gradient(90deg, #8B0000, #D4AF37)';
    } else if (forca < 70) {
        nivelFuerza.style.background = 'linear-gradient(90deg, #D4AF37, #FFD700)';
    } else {
        nivelFuerza.style.background = 'linear-gradient(90deg, #FFD700, #2ecc71)';
    }
}

function salvarPreferencias() {
    // 1. Aplicar tema de color
    const tema = temaColor.value;
    document.body.className = ''; // Limpiar clases anteriores
    document.body.classList.add(tema);
    
    // 2. Aplicar tamaño de fuente
    const tamanhoFonte = tamanoFuente.value + 'px';
    document.documentElement.style.fontSize = tamanhoFonte;
    
    // 3. Aplicar animaciones
    const animacoesAtivas = animaciones.value === 'si';
    const contenedor = document.querySelector('.contenedor-principal');
    if (animacoesAtivas) {
        contenedor.classList.add('animar');
    } else {
        contenedor.classList.remove('animar');
    }
    
    // Cerrar panel y dar feedback
    panelConfig.classList.remove('aberto');
    btnGuardar.textContent = 'Preferências Salvas!';
    setTimeout(() => {
        btnGuardar.textContent = 'Salvar Preferências';
    }, 2000);
}

// Inicializar eventos para los settings
temaColor.addEventListener('change', () => {
    document.body.className = temaColor.value;
});

tamanoFuente.addEventListener('input', () => {
    document.documentElement.style.fontSize = tamanoFuente.value + 'px';
});

// Inicializar força
atualizarForca();