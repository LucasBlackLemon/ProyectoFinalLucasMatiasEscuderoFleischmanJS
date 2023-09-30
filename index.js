
const clima = document.querySelector('#btnClima')
clima.addEventListener('click', () => {

    const key = "a96fd788a2b7558cdee739e307b89a8f";
    let ciudad = document.querySelector('#ciudad').value
    ciudad = encodeURIComponent(ciudad)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${key}`

    fetch(url)
        .then((res) => {
            return res.json()
        })
        .then((clima => {

            Swal.fire({
                position: 'center',
                icon: 'info',
                title: `Clima en ${(ciudad).toUpperCase()}`,
                text: `Temp. actual: ${parseInt(clima.main.temp -273.15)}° - Sensación térmica: ${parseInt(clima.main.feels_like -273.15)}°  - Humedad: ${clima.main.humidity}% - Viento: ${parseInt(clima.wind.speed *1.60934)}k/h`,
                showConfirmButton: false,
                showCloseButton: true,

            })

        }))
        .catch((error) => {
            Swal.fire({
                position: 'center',
                icon: 'error',
                text: 'No se encontraron resultados para la ciudad seleccionada.'
            });

        })

})



class ReservaTurno {
    constructor() {
        this.nombre = '';
        this.edad = 0;
        this.reservas = JSON.parse(localStorage.getItem('reservas')) || {};
    }

    mostrarMensaje(mensaje) {
        alert(mensaje);
    }

    getHorarioDisponible(horaReserva, mesSeleccionado) {
        const [year, month] = mesSeleccionado.split('-');
        const fechaInicio = new Date(year, month - 1, 1);
        const fechaFin = new Date(year, month, 0); 

        const horarioDisponible = [];

        const horaInicio = parseInt(horaReserva.split(':')[0]);

        for (let dia = 1; dia <= fechaFin.getDate(); dia++) {
            const fecha = new Date(year, month - 1, dia, horaInicio, 0);
            const fechaHoraReserva = fecha.toISOString().split('T')[0] + '-' + horaReserva;

            if (!this.reservas[fechaHoraReserva]) {
                horarioDisponible.push(fecha.getDate());
            }
        }

        return horarioDisponible;
    }

    realizarReserva() {
        const form = document.querySelector('form');
        this.nombre = document.getElementById('name');
        this.edad = document.getElementById('age');

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            this.nombre = this.nombre.value;
            this.edad = parseInt(this.edad.value);
            const horaDeReserva = document.getElementById('horario').value;
            const fechaSeleccionada = document.querySelector('.calendario2 input[type="date"]').value;

            if (horaDeReserva && fechaSeleccionada) {
                const fecha = new Date(fechaSeleccionada);
                const horaInicio = parseInt(horaDeReserva.split(':')[0]);

                if (horaInicio >= 9 && horaInicio <= 18) {
                    const fechaHoraReserva = fecha.toISOString().split('T')[0] + '-' + horaDeReserva;
                    if (this.reservas[fechaHoraReserva]) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Intente nuevamente',
                            text: 'Este turno ya ha sido reservado. Por favor, elige otra fecha u hora.',
                        });
                    } else {
                        this.reservas[fechaHoraReserva] = {
                            nombre: this.nombre,
                            edad: this.edad,
                        };
                        localStorage.setItem('reservas', JSON.stringify(this.reservas));
                        this.nombre = '';
                        this.edad = 0;
                        document.getElementById('horario').value = '';
                        document.querySelector('.calendario2 input[type="date"]').value = '';
                        Swal.fire(
                            'Reserva realizada!',
                            `Muchas gracias, lo esperamos el día ${fecha.toLocaleDateString()} a las ${horaDeReserva}`,
                            'success');
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Intente nuevamente',
                        text: 'Hora ingresada no válida. El horario debe estar entre 09:00 y 18:00.',
                    });
                }
            } else {
                Swal.fire('Por favor, completa todos los campos del formulario.');
            }
        });
    }
}

const simulador = new ReservaTurno();
simulador.realizarReserva();

document.querySelector('.botonConsulta').addEventListener('click', function () {
    const horaReserva = document.querySelector('#horarioC').value;
    const mesSeleccionado = document.querySelector('#month').value;

    if (horaReserva && mesSeleccionado) {
        const diasDisponibles = simulador.getHorarioDisponible(horaReserva, mesSeleccionado);
        const listaDias = document.querySelector('#diasDisponibles');

        if (diasDisponibles.length > 0) {
            const mensaje = `Días disponibles: ${diasDisponibles.join(', ')}`;
            Swal.fire('Días Disponibles', mensaje, 'info');
        } else {
            Swal.fire('Días Disponibles', 'No hay días disponibles en ese horario para el mes seleccionado.', 'info');
        }
    }
});