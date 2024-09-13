// Lista de horários disponíveis para a barbearia
const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00",
    "13:00", "13:30", "14:00", "14:30", "15:00",
    "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

// Lista para armazenar os horários ocupados
let bookedTimes = JSON.parse(localStorage.getItem('bookedTimes')) || [];

// Função para atualizar a lista de horários disponíveis
function updateSchedule() {
    const timeSlotsList = document.getElementById("timeSlots");

    // Limpar a lista
    timeSlotsList.innerHTML = '';

    // Criar conjunto de horários indisponíveis
    let unavailableTimes = new Set(bookedTimes.map(item => item.time));

    // Adicionar horários disponíveis
    timeSlots.forEach(time => {
        const isAvailable = !unavailableTimes.has(time);
        // Criar o item da lista
        const listItem = document.createElement("li");
        listItem.textContent = time;
        listItem.className = isAvailable ? "available" : "booked";
        listItem.onclick = function() {
            if (isAvailable) {
                document.querySelectorAll('#timeSlots li').forEach(li => li.classList.remove('selected'));
                listItem.classList.add('selected');
                document.getElementById("bookingButton").style.display = "inline-block";
                document.getElementById("bookingButton").setAttribute("data-time", time);
            }
        };
        timeSlotsList.appendChild(listItem);
    });

    updateAdminBookings();
}

// Função para atualizar a lista de agendamentos na seção administrativa
function updateAdminBookings() {
    const adminBookingsList = document.getElementById("adminBookings");
    adminBookingsList.innerHTML = '';

    bookedTimes.forEach(booking => {
        const listItem = document.createElement("li");
        listItem.textContent = `Nome: ${booking.name}, Horário: ${booking.time}`;
        listItem.onclick = function() {
            removeBooking(booking.time);
        };
        adminBookingsList.appendChild(listItem);
    });
}

// Função para agendar um horário
function bookTime() {
    const selectedTime = document.getElementById("bookingButton").getAttribute("data-time");
    const clientName = document.getElementById("clientName").value.trim();

    if (selectedTime && clientName) {
        // Adicionar o agendamento ao array
        bookedTimes.push({ name: clientName, time: selectedTime });
        localStorage.setItem('bookedTimes', JSON.stringify(bookedTimes));

        alert(`Horário agendado para ${selectedTime}.`);

        updateSchedule();
        document.getElementById("bookingButton").style.display = "none";
        document.getElementById("clientName").value = ''; // Limpar campo de nome
    } else {
        alert("Por favor, preencha seu nome e selecione um horário disponível.");
    }
}

// Função para remover um agendamento
function removeBooking(time) {
    bookedTimes = bookedTimes.filter(booking => booking.time !== time);
    localStorage.setItem('bookedTimes', JSON.stringify(bookedTimes));
    updateSchedule();
}

// Função para resetar todos os agendamentos
function resetBookings() {
    bookedTimes = [];
    localStorage.removeItem('bookedTimes');
    updateSchedule();
}

// Atualizar o cronograma ao carregar a página
window.onload = updateSchedule;
