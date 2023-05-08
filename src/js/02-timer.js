import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');
const timer = document.querySelector('.timer');
const fields = document.querySelectorAll('.field');

let intervalId;

timer.style.display = 'flex';
timer.style.gap = '10px';

fields.forEach(field => {
  field.style.display = 'flex';
  field.style.flexDirection = 'column';
  field.style.textAlign = 'center';
  const valueNumber = field.querySelector('.value');
  valueNumber.style.fontSize = '35px';
  const label = field.querySelector('.label');
  label.style.fontSize = '13px';
  label.style.textTransform = 'uppercase';
  label.style.fontWeight = '500';
});
startButton.disabled = true;

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function start() {
  const selectedDate = new Date(dateTimePicker.value);
  const now = new Date();
  const timeDifference = selectedDate.getTime() - now.getTime();

  if (timeDifference <= 0) {
    clearInterval(intervalId);
    daysElement.textContent = '00';
    hoursElement.textContent = '00';
    minutesElement.textContent = '00';
    secondsElement.textContent = '00';
    startButton.disabled = true;
    return;
  }
  startButton.disabled = false;

  const { days, hours, minutes, seconds } = convertMs(timeDifference);
  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

startButton.addEventListener('click', () => {
  intervalId = setInterval(start, 1000);
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate < new Date()) {
      Notify.failure('Please choose a date in the future');
      // window.alert('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(dateTimePicker, options);
