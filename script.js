document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular-btn');
    calcularBtn.addEventListener('click', calcularValorEmpresa);

    // Convertir los inputs de porcentaje a formato porcentual
    const percentInputs = [
        'crecimiento-ventas', 
        'consumos-porcentaje', 
        'personal-porcentaje', 
        'otros-gastos-porcentaje', 
        'impuestos-porcentaje', 
        'tasa-descuento', 
        'crecimiento-terminal',
        'nof-incremento'
    ];

    percentInputs.forEach(id => {
        const input = document.getElementById(id);
        // Convertir valores decimales a porcentajes
        input.value = (parseFloat(input.value) * 100).toFixed(2);
    });
    
    // Update default values to be more realistic (smaller percentages)
    document.getElementById('crecimiento-ventas').value = '2';
    document.getElementById('consumos-porcentaje').value = '40';
    document.getElementById('personal-porcentaje').value = '3';
    document.getElementById('otros-gastos-porcentaje').value = '4';
    document.getElementById('impuestos-porcentaje').value = '10';
    document.getElementById('tasa-descuento').value = '5';
    document.getElementById('crecimiento-terminal').value = '1';
    document.getElementById('nof-incremento').value = '3';

    // Añadir botón para mostrar/ocultar el gráfico flotante
    const body = document.querySelector('body');
    const toggleChartBtn = document.createElement('button');
    toggleChartBtn.classList.add('toggle-chart-btn');
    toggleChartBtn.innerHTML = '📊';
    toggleChartBtn.setAttribute('title', 'Mostrar/ocultar gráfico de resultados');
    body.appendChild(toggleChartBtn);
    
    // Crear flecha apuntando hacia el botón de gráfico
    const chartArrow = document.createElement('div');
    chartArrow.classList.add('chart-arrow');
    chartArrow.innerHTML = `
        <svg viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M5,20 L75,20 L65,10 M75,20 L65,30" stroke="#3498db" stroke-width="3" fill="none"/>
            <text x="10" y="15" fill="#2c3e50" font-size="12">Ver gráfico</text>
        </svg>
    `;
    body.appendChild(chartArrow);
    
    // Crear el panel flotante para el gráfico
    const floatingChart = document.createElement('div');
    floatingChart.classList.add('floating-chart', 'hidden');
    floatingChart.innerHTML = `
        <h3>
            Evolución del Valor Empresarial
            <button class="close-chart" title="Cerrar">&times;</button>
        </h3>
        <div class="chart-container">
            <canvas id="results-chart"></canvas>
        </div>
        <div class="chart-summary">
            Cargando resumen...
        </div>
    `;
    body.appendChild(floatingChart);
    
    // Eventos para mostrar/ocultar el gráfico
    toggleChartBtn.addEventListener('click', function() {
        floatingChart.classList.toggle('hidden');
        if (!floatingChart.classList.contains('hidden')) {
            updateChartSummary();
        }
    });
    
    document.querySelector('.close-chart').addEventListener('click', function() {
        floatingChart.classList.add('hidden');
    });

    // Calcular al cargar la página para mostrar valores predeterminados
    calcularValorEmpresa();

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            if (!formValues.nombre || !formValues.email || !formValues.empresa) {
                showFormMessage('Por favor, completa todos los campos obligatorios.', false);
                return;
            }
            
            // Simulate successful submission
            showFormMessage('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.', true);
            contactForm.reset();
        });
    }
    
    function showFormMessage(message, isSuccess) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + (isSuccess ? 'success-message' : 'error-message');
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

function calcularValorEmpresa() {
    // Obtener valores de entrada
    const ventasInicial = parseFloat(document.getElementById('ventas').value);
    const crecimientoVentas = parseFloat(document.getElementById('crecimiento-ventas').value) / 100;
    const consumosPorcentaje = parseFloat(document.getElementById('consumos-porcentaje').value) / 100;
    const personalBase = parseFloat(document.getElementById('personal-base').value);
    const personalIncremento = parseFloat(document.getElementById('personal-porcentaje').value) / 100;
    const otrosGastosBase = parseFloat(document.getElementById('otros-gastos-base').value);
    const otrosGastosIncremento = parseFloat(document.getElementById('otros-gastos-porcentaje').value) / 100;
    const amortizacionBase = parseFloat(document.getElementById('amortizacion').value);
    const gastosFinancieros = parseFloat(document.getElementById('gastos-financieros').value);
    const impuestosPorcentaje = parseFloat(document.getElementById('impuestos-porcentaje').value) / 100;
    const nofIncremento = parseFloat(document.getElementById('nof-incremento').value) / 100;
    const activoFijo = parseFloat(document.getElementById('activo-fijo').value);
    const tasaDescuento = parseFloat(document.getElementById('tasa-descuento').value) / 100;
    const crecimientoTerminal = parseFloat(document.getElementById('crecimiento-terminal').value) / 100;

    // Crear arrays para almacenar los resultados por año
    const años = ['Año 0', 'Año 1', 'Año 2', 'Año 3', 'Año 4', 'Año 5'];
    const ventas = [];
    const consumos = [];
    const personal = [];
    const otrosGastos = [];
    const amortizacion = [];
    const bdoExplotacionBaii = [];
    const impuestos = [];
    const amortizacionFlujo = [];
    const excedentes = [];
    const bdoEjercicio = [];
    const nof = [];
    const inversionNof = [];
    const activoFijoArray = [];
    const flujoCajaLibre = [];

    // Calcular valores para cada año
    for (let i = 0; i < 6; i++) {
        // Ventas
        ventas[i] = i === 0 ? ventasInicial : ventas[i-1] * (1 + crecimientoVentas);
        
        // Consumos basados en % de ventas
        consumos[i] = ventas[i] * consumosPorcentaje;
        
        // Personal con incremento anual
        personal[i] = i === 0 ? personalBase : personal[i-1] * (1 + personalIncremento);
        
        // Otros gastos con incremento anual
        otrosGastos[i] = i === 0 ? otrosGastosBase : otrosGastos[i-1] * (1 + otrosGastosIncremento);
        
        // Amortización (constante)
        amortizacion[i] = amortizacionBase;
        
        // BDO Explotación (BAII) = Ventas - Consumos - Personal - Otros Gastos - Amortización
        bdoExplotacionBaii[i] = ventas[i] - consumos[i] - personal[i] - otrosGastos[i] - amortizacion[i];
        
        // EBITDA = BAII + Amortización
        const ebitda = bdoExplotacionBaii[i] + amortizacion[i];
        
        // Impuestos sobre BAII
        impuestos[i] = bdoExplotacionBaii[i] * impuestosPorcentaje;
        
        // Amortización para flujo de caja (igual que la anterior)
        amortizacionFlujo[i] = amortizacion[i];
        
        // Eliminamos cálculo de excedentes
        excedentes[i] = 0;
        
        // BDO Ejercicio = BAII - Impuestos
        bdoEjercicio[i] = bdoExplotacionBaii[i] - impuestos[i];
        
        // NOF (Necesidades Operativas de Fondos) con incremento anual
        if (i === 0) {
            nof[i] = ventasInicial * 0.35; // 35% de ventas como ejemplo
        } else {
            nof[i] = nof[i-1] * (1 + nofIncremento);
        }
        
        // Inversión en NOF (cambio en NOF)
        inversionNof[i] = i === 0 ? 0 : nof[i] - nof[i-1];
        
        // Activo Fijo (inversión constante)
        activoFijoArray[i] = activoFijo;
        
        // Flujo de Caja Libre = EBITDA - Impuestos - Inv. en NOF - Inv. en Activo Fijo
        flujoCajaLibre[i] = bdoExplotacionBaii[i] + amortizacionFlujo[i] - impuestos[i] - inversionNof[i] - activoFijoArray[i];
    }

    // Valor Actual de los Flujos de Caja
    let vaFlujos = 0;
    for (let i = 1; i < 6; i++) {
        vaFlujos += flujoCajaLibre[i] / Math.pow(1 + tasaDescuento, i);
    }

    // Valor Terminal (usando el método de Gordon-Shapiro)
    const valorTerminal = flujoCajaLibre[5] * (1 + crecimientoTerminal) / (tasaDescuento - crecimientoTerminal);
    
    // Valor actual del Valor Terminal
    const vaValorTerminal = valorTerminal / Math.pow(1 + tasaDescuento, 5);
    
    // Valor Total de la Empresa
    const valorTotal = vaFlujos + vaValorTerminal;

    // Actualizar la tabla de resultados
    actualizarTablaResultados(años, ventas, consumos, personal, otrosGastos, amortizacion, 
                              bdoExplotacionBaii, impuestos, amortizacionFlujo, excedentes,
                              bdoEjercicio, nof, inversionNof, activoFijoArray, flujoCajaLibre);

    // Actualizar los valores de valoración
    document.getElementById('va-flujos').textContent = formatCurrency(vaFlujos);
    document.getElementById('valor-terminal').textContent = formatCurrency(vaValorTerminal);
    document.getElementById('valor-total').textContent = formatCurrency(valorTotal);
    
    // Actualizar el gráfico y resumen
    renderizarGrafico(años.slice(1), flujoCajaLibre.slice(1), vaFlujos, vaValorTerminal, valorTotal);
    updateChartSummary(vaFlujos, vaValorTerminal, valorTotal, crecimientoVentas, crecimientoTerminal);
}

function actualizarTablaResultados(años, ventas, consumos, personal, otrosGastos, amortizacion, 
                                  bdoExplotacionBaii, impuestos, amortizacionFlujo, excedentes,
                                  bdoEjercicio, nof, inversionNof, activoFijoArray, flujoCajaLibre) {
    const tbody = document.querySelector('#results-table tbody');
    tbody.innerHTML = '';

    // Función para crear una fila
    function crearFila(concepto, valores, isSubtotal = false) {
        const tr = document.createElement('tr');
        if (isSubtotal) {
            tr.classList.add('subtotal');
        }
        
        const td = document.createElement('td');
        td.textContent = concepto;
        tr.appendChild(td);
        
        for (let i = 0; i < 6; i++) {
            const td = document.createElement('td');
            td.textContent = formatCurrency(valores[i]);
            tr.appendChild(td);
        }
        
        tbody.appendChild(tr);
    }

    // Añadir filas de datos
    crearFila('VENTAS', ventas);
    crearFila('CONSUMOS', consumos);
    crearFila('PERSONAL', personal);
    crearFila('OTROS GASTOS', otrosGastos);
    crearFila('AMORTIZACIÓN', amortizacion);
    
    // BDO EXPLOTACIÓN (BAII) primero, antes de EBITDA
    crearFila('BDO EXPLOTACIÓN (BAII)', bdoExplotacionBaii, true);
    
    // Calcular EBITDA para cada año
    const ebitda = bdoExplotacionBaii.map((baii, i) => baii + amortizacion[i]);
    crearFila('EBITDA', ebitda, true);
    
    crearFila('IMPUESTOS', impuestos);
    crearFila('BDO EJERCICIO', bdoEjercicio, true);
    
    crearFila('NOF', nof);
    crearFila('INVERSIÓN NOF', inversionNof);
    crearFila('ACTIVO FIJO', activoFijoArray);
    crearFila('FLUJO DE CAJA LIBRE', flujoCajaLibre, true);
}

function renderizarGrafico(años, flujoCajaLibre, vaFlujos, vaValorTerminal, valorTotal) {
    const ctx = document.getElementById('results-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.resultsChart) {
        window.resultsChart.destroy();
    }
    
    // Crear nuevo gráfico
    window.resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: años,
            datasets: [
                {
                    label: 'Flujo de Caja Libre',
                    data: flujoCajaLibre,
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrencyShort(value);
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(context.parsed.y);
                        }
                    }
                }
            }
        }
    });
}

function updateChartSummary(vaFlujos, vaValorTerminal, valorTotal, crecimientoVentas, crecimientoTerminal) {
    if (!vaFlujos) return;
    
    const chartSummary = document.querySelector('.chart-summary');
    const porcentajeValorTerminal = (vaValorTerminal / valorTotal * 100).toFixed(1);
    const porcentajeFlujos = (vaFlujos / valorTotal * 100).toFixed(1);
    
    chartSummary.innerHTML = `
        <p>El valor total de la empresa es <strong>${formatCurrency(valorTotal)}</strong>, 
        compuesto por un ${porcentajeFlujos}% del valor actual de flujos 
        (${formatCurrency(vaFlujos)}) y un ${porcentajeValorTerminal}% del valor terminal 
        (${formatCurrency(vaValorTerminal)}).</p>
        <p>Con un crecimiento anual de ventas del ${(crecimientoVentas * 100).toFixed(1)}% 
        y un crecimiento terminal del ${(crecimientoTerminal * 100).toFixed(1)}%, 
        el modelo indica una empresa con valoración ${valorTotal > vaFlujos * 2 ? 'fuerte' : 'moderada'}.</p>
    `;
}

function formatCurrency(number) {
    return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function formatCurrencyShort(number) {
    if (Math.abs(number) >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M €';
    } else if (Math.abs(number) >= 1000) {
        return (number / 1000).toFixed(0) + 'K €';
    } else {
        return number + ' €';
    }
}