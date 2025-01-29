import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const delay = Number(form.elements.delay.value);
    const state = form.elements.state.value;
    
    createPromise(delay, state)
      .then((message) => {
        iziToast.success({
          title: "Success",
          message,
          position: "topRight",
        });
      })
      .catch((message) => {
        iziToast.error({
          title: "Error",
          message,
          position: "topRight",
        });
      });

    form.reset();
  });
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  });
}