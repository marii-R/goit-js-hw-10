import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let timerInterval = null;


const datetimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector("[data-start]");
const timerDisplay = {
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

const addLeadingZero = (value) => String(value).padStart(2, "0");


const convertMs = (ms) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  return {
    days: Math.floor(ms / day),
    hours: Math.floor((ms % day) / hour),
    minutes: Math.floor(((ms % day) % hour) / minute),
    seconds: Math.floor((((ms % day) % hour) % minute) / second),
  };
};


const updateTimerDisplay = ({ days, hours, minutes, seconds }) => {
  timerDisplay.days.textContent = addLeadingZero(days);
  timerDisplay.hours.textContent = addLeadingZero(hours);
  timerDisplay.minutes.textContent = addLeadingZero(minutes);
  timerDisplay.seconds.textContent = addLeadingZero(seconds);
};


const startTimer = () => {
  timerInterval = setInterval(() => {
    const currentTime = Date.now();
    const timeRemaining = userSelectedDate - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({ title: "Timer Complete", message: "The countdown has ended!" });
      datetimePicker.disabled = false;
      startButton.disabled = true;
      return;
    }

    updateTimerDisplay(convertMs(timeRemaining));
  }, 1000);
};


flatpickr(datetimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= Date.now()) {
      iziToast.error({ title: "Invalid Date", message: "Please choose a date in the future." });
      startButton.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
});


startButton.addEventListener("click", () => {
  if (!userSelectedDate) return;

  datetimePicker.disabled = true;
  startButton.disabled = true;
  startTimer();
});
