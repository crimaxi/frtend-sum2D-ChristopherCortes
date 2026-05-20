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
    const contactoError = document.getElementById('contacto-error');

    const limpiarErrores = () => {
        formErrors.innerHTML = '';
        formErrors.classList.add('hidden');
        contactoError.classList.remove('visible');
    };

    const mostrarErrores = (errores) => {
        if (!errores.length) {
            limpiarErrores();
            return;
        }

        formErrors.innerHTML = `<ul>${errores.map(error => `<li>${error}</li>`).join('')}</ul>`;
        formErrors.classList.remove('hidden');
    };

    const contarDigitos = (valor) => (valor.match(/\d/g) || []).length;

    const esEmailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

    const esCuitValido = (valor) => /^(\d{2}-\d{8}-\d{1}|\d{11})$/.test(valor);

    const mostrarCampo = (elemento, mostrar) => {
        elemento.classList.toggle('hidden', !mostrar);
    };

    const setEmpresaFields = () => {
        const isEmpresa = document.querySelector('input[name="tipo-cliente"]:checked')?.value === 'empresa';
        mostrarCampo(empresaFields, isEmpresa);
        inputEmpresaNombre.required = isEmpresa;
        inputCuit.required = isEmpresa;
    };

    const setOtroDispositivo = () => {
        const isOtro = tipoDispositivo.value === 'Otro';
        mostrarCampo(otroDispositivoField, isOtro);
        inputOtroDispositivo.required = isOtro;
    };

    const setOtraMarca = () => {
        const isOtra = marcaSelect.value === 'Otro';
        mostrarCampo(otraMarcaField, isOtra);
        inputOtraMarca.required = isOtra;
    };

    const setGarantiaField = () => {
        mostrarCampo(garantiaField, garantiaCheckbox.checked);
        inputOrdenCompra.required = garantiaCheckbox.checked;
    };

    const setEntregaField = () => {
        const isRetiro = document.querySelector('input[name="entrega"]:checked')?.value === 'retiro';
        mostrarCampo(direccionRetiro, isRetiro);
        if (inputDireccion) {
            inputDireccion.required = isRetiro;
        }
    };

    const validarFormulario = () => {
        const errores = [];
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
        const contactoSeleccionado = Array.from(document.querySelectorAll('input[name="contacto"]')).some(input => input.checked);

        if (!/^[A-Za-zÀ-ÿ\s]{5,80}$/.test(nombre)) {
            errores.push('Nombre completo debe tener solo letras y espacios, entre 5 y 80 caracteres.');
        }

        if (!/^\d{7,8}$/.test(dni)) {
            errores.push('DNI debe contener solo números y tener entre 7 y 8 dígitos.');
        }

        if (!esEmailValido(email)) {
            errores.push('Correo electrónico no tiene formato válido.');
        }

        if (email !== confirmEmail) {
            errores.push('Confirmar correo debe coincidir exactamente con el correo electrónico.');
        }

        if (!/^[\d\s+\-]+$/.test(telefono) || contarDigitos(telefono) < 8) {
            errores.push('Teléfono debe contener solo dígitos, espacios, guiones o + y al menos 8 dígitos numéricos.');
        }

        if (!document.querySelector('input[name="tipo-cliente"]:checked')) {
            errores.push('Debe seleccionarse un tipo de cliente.');
        }

        if (document.querySelector('input[name="tipo-cliente"]:checked')?.value === 'empresa') {
            if (!inputEmpresaNombre.value.trim()) {
                errores.push('El nombre de la empresa no puede estar vacío si el cliente es Empresa.');
            }
            if (!esCuitValido(inputCuit.value.trim())) {
                errores.push('CUIT debe tener formato ##-########-# o 11 dígitos numéricos seguidos.');
            }
        }

        if (!provincia) {
            errores.push('Provincia es obligatoria.');
        }

        if (localidad.length < 2) {
            errores.push('Localidad no puede estar vacía y debe tener al menos 2 caracteres.');
        }

        if (!tipoDispositivo.value) {
            errores.push('Tipo de dispositivo es obligatorio.');
        } else if (tipoDispositivo.value === 'Otro' && !inputOtroDispositivo.value.trim()) {
            errores.push('Debes especificar el tipo de dispositivo cuando eliges Otro.');
        }

        if (!marcaSelect.value) {
            errores.push('Marca es obligatoria.');
        } else if (marcaSelect.value === 'Otro' && !inputOtraMarca.value.trim()) {
            errores.push('Debes especificar la marca cuando eliges Otra.');
        }

        const modelo = document.getElementById('modelo').value.trim();
        if (modelo.length < 2) {
            errores.push('Modelo no puede estar vacío y debe tener al menos 2 caracteres.');
        }

        if (!document.getElementById('sistema-operativo').value) {
            errores.push('Sistema operativo es obligatorio.');
        }

        if (garantiaCheckbox.checked && !inputOrdenCompra.value.trim()) {
            errores.push('El número de orden o fecha de compra no puede estar vacío si el equipo está en garantía.');
        }

        if (!tipoProblema) {
            errores.push('Tipo de problema principal es obligatorio.');
        }

        if (!desde) {
            errores.push('Debes indicar desde cuándo ocurre el problema.');
        }

        const descripcion = descripcionProblema.value.trim();
        if (descripcion.length < 20 || descripcion.length > 500) {
            errores.push('Descripción detallada del problema debe tener entre 20 y 500 caracteres.');
        }

        if (!frecuencia) {
            errores.push('Selecciona si el problema es permanente o intermitente.');
        }

        if (intentoRepararCheckbox.checked) {
            const detalle = detalleReparacion.value.trim();
            if (detalle.length > 300) {
                errores.push('La descripción de la reparación previa no puede superar los 300 caracteres.');
            }
        }

        if (!contactoSeleccionado) {
            errores.push('Selecciona al menos una forma de contacto para notificaciones.');
        }

        if (!contactoSeleccionado) {
            contactoError.classList.add('visible');
        } else {
            contactoError.classList.remove('visible');
        }

        return errores;
    };

    tipoClienteRadios.forEach(radio => {
        radio.addEventListener('change', setEmpresaFields);
    });

    tipoDispositivo.addEventListener('change', setOtroDispositivo);
    marcaSelect.addEventListener('change', setOtraMarca);
    garantiaCheckbox.addEventListener('change', setGarantiaField);
    datosImportantesCheckbox.addEventListener('change', () => {
        mostrarCampo(advertenciaDatos, datosImportantesCheckbox.checked);
    });
    intentoRepararCheckbox.addEventListener('change', () => {
        mostrarCampo(detalleIntento, intentoRepararCheckbox.checked);
    });
    entregaRadios.forEach(radio => {
        radio.addEventListener('change', setEntregaField);
    });

    descripcionProblema.addEventListener('input', () => {
        contadorProblema.textContent = descripcionProblema.value.length;
    });

    detalleReparacion.addEventListener('input', () => {
        contadorIntento.textContent = detalleReparacion.value.length;
    });

    form.addEventListener('submit', (event) => {
        const errores = validarFormulario();
        if (errores.length) {
            event.preventDefault();
            mostrarErrores(errores);
            return;
        }
        limpiarErrores();
        alert('Ingreso registrado correctamente. Nos contactaremos pronto.');
    });

    form.addEventListener('reset', () => {
        setTimeout(() => {
            setEmpresaFields();
            setOtroDispositivo();
            setOtraMarca();
            setGarantiaField();
            setEntregaField();
            mostrarCampo(advertenciaDatos, false);
            mostrarCampo(detalleIntento, false);
            descripcionProblema.value = '';
            detalleReparacion.value = '';
            contadorProblema.textContent = '0';
            contadorIntento.textContent = '0';
            limpiarErrores();
        }, 0);
    });

    setEmpresaFields();
    setOtroDispositivo();
    setOtraMarca();
    setGarantiaField();
    setEntregaField();
});