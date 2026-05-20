document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ingreso-form');
    const formErrors = document.getElementById('form-errors');
    const tipoClienteRadios = document.querySelectorAll('input[name="tipo-cliente"]');
    const empresaFields = document.getElementById('empresa-fields');
    const inputEmpresaNombre = document.getElementById('empresa-nombre');
    const inputCuit = document.getElementById('cuit');
    const tipoDispositivo = document.getElementById('tipo-dispositivo');
    const otroDispositivoField = document.getElementById('otro-dispositivo-field');
    const inputOtroDispositivo = document.getElementById('otro-dispositivo');
    const marcaSelect = document.getElementById('marca');
    const otraMarcaField = document.getElementById('otra-marca-field');
    const inputOtraMarca = document.getElementById('otra-marca');
    const garantiaCheckbox = document.getElementById('garantia');
    const garantiaField = document.getElementById('garantia-field');
    const inputOrdenCompra = document.getElementById('orden-compra');
    const datosImportantesCheckbox = document.getElementById('datos-importantes');
    const advertenciaDatos = document.getElementById('advertencia-datos');
    const intentoRepararCheckbox = document.getElementById('intento-reparar');
    const detalleIntento = document.getElementById('detalle-intento');
    const entregaRadios = document.querySelectorAll('input[name="entrega"]');
    const direccionRetiro = document.getElementById('direccion-retiro');
    const inputDireccion = document.getElementById('direccion');
    const descripcionProblema = document.getElementById('descripcion-problema');
    const contadorProblema = document.getElementById('contador-problema');
    const detalleReparacion = document.getElementById('detalle-reparacion');
    const contadorIntento = document.getElementById('contador-intento');
    const contactoGroup = document.getElementById('contacto-group');
    const contactoError = document.getElementById('contacto-error');
    const frecuenciaGroup = document.getElementById('frecuencia-group');
    const entregaGroup = document.getElementById('entrega-group');
    const confirmationSection = document.getElementById('confirmation-section');
    const confirmNombre = document.getElementById('confirm-nombre');
    const confirmDispositivo = document.getElementById('confirm-dispositivo');
    const confirmMarcaModelo = document.getElementById('confirm-marca-modelo');
    const confirmEntrega = document.getElementById('confirm-entrega');
    const confirmOrden = document.getElementById('confirm-orden');
    const btnIngresarOtro = document.getElementById('btn-ingresar-otro');

    const showElement = (element, show) => {
        element.classList.toggle('hidden', !show);
    };

    const clearFieldState = (field) => {
        field.classList.remove('campo-error', 'campo-ok');
        const container = field.closest('label') || field.closest('.radio-group') || field.closest('.checkbox-group') || field;
        if (!container) return;
        const errorMessage = container.querySelector('.field-error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    };

    const setFieldState = (field, valid, message) => {
        const target = field.closest('label') || field.closest('.radio-group') || field.closest('.checkbox-group') || field;
        field.classList.toggle('campo-error', !valid);
        field.classList.toggle('campo-ok', valid);

        if (!target) return;

        let errorMessage = target.querySelector('.field-error-message');
        if (!errorMessage && !valid) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'field-error-message';
            target.appendChild(errorMessage);
        }

        if (errorMessage) {
            errorMessage.textContent = valid ? '' : message;
            errorMessage.style.display = valid ? 'none' : 'block';
        }
    };

    const clearAllFieldStates = () => {
        form.querySelectorAll('.campo-error, .campo-ok').forEach(el => el.classList.remove('campo-error', 'campo-ok'));
        form.querySelectorAll('.field-error-message').forEach(el => el.remove());
    };

    const limpiarErrores = () => {
        formErrors.innerHTML = '';
        formErrors.classList.add('hidden');
        contactoError.classList.remove('visible');
        contactoGroup.classList.remove('campo-error', 'campo-ok');
    };

    const mostrarErrores = (errores) => {
        if (!errores.length) {
            limpiarErrores();
            return;
        }

        formErrors.innerHTML = `
            <p>Se encontraron ${errores.length} errores en el formulario:</p>
            <ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>
        `;
        formErrors.classList.remove('hidden');
    };

    const contarDigitos = (valor) => (valor.match(/\d/g) || []).length;

    const esEmailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    const esCuitValido = (valor) => /^(\d{2}-\d{8}-\d{1}|\d{11})$/.test(valor);

    const updateCounter = (textarea, counter, max) => {
        const length = textarea.value.length;
        counter.textContent = length;
        counter.classList.toggle('contador-rojo', length >= max);
        counter.classList.toggle('contador-naranja', length >= max * 0.8 && length < max);
    };

    const clearHiddenField = (field) => {
        if (!field) return;
        if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else {
                field.value = '';
            }
        }
        if (field.tagName === 'SELECT') {
            field.selectedIndex = 0;
        }
        clearFieldState(field);
    };

    const setEmpresaFields = () => {
        const isEmpresa = document.querySelector('input[name="tipo-cliente"]:checked')?.value === 'empresa';
        showElement(empresaFields, isEmpresa);
        inputEmpresaNombre.required = isEmpresa;
        inputCuit.required = isEmpresa;
        if (!isEmpresa) {
            clearHiddenField(inputEmpresaNombre);
            clearHiddenField(inputCuit);
        }
    };

    const setOtroDispositivo = () => {
        const isOtro = tipoDispositivo.value === 'Otro';
        showElement(otroDispositivoField, isOtro);
        inputOtroDispositivo.required = isOtro;
        if (!isOtro) {
            clearHiddenField(inputOtroDispositivo);
        }
    };

    const setOtraMarca = () => {
        const isOtra = marcaSelect.value === 'Otro';
        showElement(otraMarcaField, isOtra);
        inputOtraMarca.required = isOtra;
        if (!isOtra) {
            clearHiddenField(inputOtraMarca);
        }
    };

    const setGarantiaField = () => {
        showElement(garantiaField, garantiaCheckbox.checked);
        inputOrdenCompra.required = garantiaCheckbox.checked;
        if (!garantiaCheckbox.checked) {
            clearHiddenField(inputOrdenCompra);
        }
    };

    const setEntregaField = () => {
        const isRetiro = document.querySelector('input[name="entrega"]:checked')?.value === 'retiro';
        showElement(direccionRetiro, isRetiro);
        inputDireccion.required = isRetiro;
        if (!isRetiro) {
            clearHiddenField(inputDireccion);
        }
    };

    const getContactoSeleccionado = () => Array.from(document.querySelectorAll('input[name="contacto"]')).some(input => input.checked);

    const validarFormulario = () => {
        clearAllFieldStates();
        limpiarErrores();

        const errores = [];
        let primerError = null;

        const nombre = document.getElementById('nombre').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const email = document.getElementById('email').value.trim();
        const confirmEmail = document.getElementById('confirm-email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const provincia = document.getElementById('provincia').value;
        const localidad = document.getElementById('localidad').value.trim();
        const tipoProblema = document.getElementById('tipo-problema').value;
        const desde = document.getElementById('desde').value;
        const frecuencia = document.querySelector('input[name="frecuencia"]:checked');
        const contactoSeleccionado = getContactoSeleccionado();
        const entregaSeleccion = document.querySelector('input[name="entrega"]:checked');

        const checkField = (condition, field, message) => {
            if (!condition) {
                errores.push(message);
                if (!primerError) primerError = field;
                setFieldState(field, false, message);
            } else {
                setFieldState(field, true);
            }
        };

        checkField(/^[A-Za-zÀ-ÿ\s]{5,80}$/.test(nombre), document.getElementById('nombre'), 'Nombre completo debe tener solo letras y espacios, entre 5 y 80 caracteres.');
        checkField(/^\d{7,8}$/.test(dni), document.getElementById('dni'), 'DNI debe contener solo números y tener entre 7 y 8 dígitos.');
        checkField(esEmailValido(email), document.getElementById('email'), 'Correo electrónico no tiene formato válido.');
        checkField(email === confirmEmail, document.getElementById('confirm-email'), 'Confirmar correo debe coincidir exactamente con el correo electrónico.');
        checkField(/^[\d\s+\-]+$/.test(telefono) && contarDigitos(telefono) >= 8, document.getElementById('telefono'), 'Teléfono debe contener solo dígitos, espacios, guiones o + y al menos 8 dígitos numéricos.');

        const tipoClienteSeleccionado = document.querySelector('input[name="tipo-cliente"]:checked');
        checkField(!!tipoClienteSeleccionado, document.getElementById('tipo-cliente-group'), 'Debe seleccionarse un tipo de cliente.');

        if (tipoClienteSeleccionado?.value === 'empresa') {
            checkField(!!inputEmpresaNombre.value.trim(), inputEmpresaNombre, 'El nombre de la empresa no puede estar vacío si el cliente es Empresa.');
            checkField(esCuitValido(inputCuit.value.trim()), inputCuit, 'CUIT debe tener formato ##-########-# o 11 dígitos numéricos seguidos.');
        }

        checkField(!!provincia, document.getElementById('provincia'), 'Provincia es obligatoria.');
        checkField(localidad.length >= 2, document.getElementById('localidad'), 'Localidad no puede estar vacía y debe tener al menos 2 caracteres.');

        if (tipoDispositivo.value === 'Otro') {
            checkField(!!inputOtroDispositivo.value.trim(), inputOtroDispositivo, 'Debes especificar el tipo de dispositivo cuando eliges Otro.');
        } else {
            checkField(!!tipoDispositivo.value, tipoDispositivo, 'Tipo de dispositivo es obligatorio.');
        }

        if (marcaSelect.value === 'Otro') {
            checkField(!!inputOtraMarca.value.trim(), inputOtraMarca, 'Debes especificar la marca cuando eliges Otra.');
        } else {
            checkField(!!marcaSelect.value, marcaSelect, 'Marca es obligatoria.');
        }

        checkField(document.getElementById('modelo').value.trim().length >= 2, document.getElementById('modelo'), 'Modelo no puede estar vacío y debe tener al menos 2 caracteres.');
        checkField(!!document.getElementById('sistema-operativo').value, document.getElementById('sistema-operativo'), 'Sistema operativo es obligatorio.');

        if (garantiaCheckbox.checked) {
            checkField(!!inputOrdenCompra.value.trim(), inputOrdenCompra, 'El número de orden o fecha de compra no puede estar vacío si el equipo está en garantía.');
        }

        checkField(!!tipoProblema, document.getElementById('tipo-problema'), 'Tipo de problema principal es obligatorio.');
        checkField(!!desde, document.getElementById('desde'), 'Debes indicar desde cuándo ocurre el problema.');
        checkField(descripcionProblema.value.trim().length >= 20 && descripcionProblema.value.trim().length <= 500, descripcionProblema, 'Descripción detallada del problema debe tener entre 20 y 500 caracteres.');
        checkField(!!frecuencia, frecuenciaGroup, 'Selecciona si el problema es permanente o intermitente.');

        if (intentoRepararCheckbox.checked) {
            checkField(detalleReparacion.value.trim().length <= 300, detalleReparacion, 'La descripción de la reparación previa no puede superar los 300 caracteres.');
        }

        if (entregaSeleccion?.value === 'retiro') {
            checkField(inputDireccion.value.trim().length >= 10, inputDireccion, 'La dirección debe tener al menos 10 caracteres si eliges retiro a domicilio.');
        }

        checkField(!!entregaSeleccion, entregaGroup, 'Debe seleccionarse una modalidad de entrega.');
        checkField(!!document.getElementById('presupuesto').value, document.getElementById('presupuesto'), 'Presupuesto autorizado es obligatorio.');
        checkField(contactoSeleccionado, contactoGroup, 'Selecciona al menos una forma de contacto para notificaciones.');
        checkField(!!document.getElementById('horario').value, document.getElementById('horario'), 'Horario preferido para ser contactado es obligatorio.');
        checkField(document.getElementById('acepta-diagnostico').checked, document.getElementById('acepta-diagnostico'), 'Debes aceptar que el diagnóstico puede demorar hasta 48 horas hábiles.');
        checkField(document.getElementById('acepta-terminos').checked, document.getElementById('acepta-terminos'), 'Debes aceptar los Términos y Condiciones.');

        if (!contactoSeleccionado) {
            contactoError.classList.add('visible');
        } else {
            contactoError.classList.remove('visible');
        }

        return { errores, primerError };
    };

    const mostrarConfirmacion = () => {
        const nombre = document.getElementById('nombre').value.trim();
        const dispositivo = tipoDispositivo.value === 'Otro' ? inputOtroDispositivo.value.trim() : tipoDispositivo.value;
        const marca = marcaSelect.value === 'Otro' ? inputOtraMarca.value.trim() : marcaSelect.value;
        const modelo = document.getElementById('modelo').value.trim();
        const entregaSeleccion = document.querySelector('input[name="entrega"]:checked')?.value;
        const direccion = inputDireccion.value.trim();
        const modalidad = entregaSeleccion === 'retiro' ? `Retiro a domicilio (${direccion})` : 'Lo llevo personalmente al local';
        const orden = `TF-${Math.floor(100000 + Math.random() * 900000)}`;

        confirmNombre.textContent = nombre;
        confirmDispositivo.textContent = dispositivo;
        confirmMarcaModelo.textContent = `${marca} - ${modelo}`;
        confirmEntrega.textContent = modalidad;
        confirmOrden.textContent = orden;

        showElement(form, false);
        showElement(confirmationSection, true);
        confirmationSection.scrollIntoView({ behavior: 'smooth' });
    };

    tipoClienteRadios.forEach(radio => {
        radio.addEventListener('change', setEmpresaFields);
    });

    tipoDispositivo.addEventListener('change', setOtroDispositivo);
    marcaSelect.addEventListener('change', setOtraMarca);
    garantiaCheckbox.addEventListener('change', setGarantiaField);
    datosImportantesCheckbox.addEventListener('change', () => {
        showElement(advertenciaDatos, datosImportantesCheckbox.checked);
    });
    intentoRepararCheckbox.addEventListener('change', () => {
        showElement(detalleIntento, intentoRepararCheckbox.checked);
        if (!intentoRepararCheckbox.checked) {
            clearHiddenField(detalleReparacion);
            updateCounter(detalleReparacion, contadorIntento, 300);
        }
    });
    entregaRadios.forEach(radio => {
        radio.addEventListener('change', setEntregaField);
    });

    descripcionProblema.addEventListener('input', () => {
        updateCounter(descripcionProblema, contadorProblema, 500);
    });

    detalleReparacion.addEventListener('input', () => {
        updateCounter(detalleReparacion, contadorIntento, 300);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const { errores, primerError } = validarFormulario();
        if (errores.length) {
            mostrarErrores(errores);
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (typeof primerError.focus === 'function') {
                    primerError.focus();
                }
            }
            return;
        }

        limpiarErrores();
        mostrarConfirmacion();
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            setEmpresaFields();
            setOtroDispositivo();
            setOtraMarca();
            setGarantiaField();
            setEntregaField();
            showElement(advertenciaDatos, false);
            showElement(detalleIntento, false);
            descripcionProblema.value = '';
            detalleReparacion.value = '';
            contadorProblema.textContent = '0';
            contadorIntento.textContent = '0';
            contadorProblema.classList.remove('contador-naranja', 'contador-rojo');
            contadorIntento.classList.remove('contador-naranja', 'contador-rojo');
            limpiarErrores();
            clearAllFieldStates();
        }, 0);
    });

    btnIngresarOtro.addEventListener('click', () => {
        form.reset();
        showElement(confirmationSection, false);
        showElement(form, true);
        form.scrollIntoView({ behavior: 'smooth' });
    });

    setEmpresaFields();
    setOtroDispositivo();
    setOtraMarca();
    setGarantiaField();
    setEntregaField();
    updateCounter(descripcionProblema, contadorProblema, 500);
    updateCounter(detalleReparacion, contadorIntento, 300);
});