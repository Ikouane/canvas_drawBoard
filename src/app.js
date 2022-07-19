/*
 * @Author: ikouane
 * @Date: 2022-07-19 13:29:20
 * @LastEditTime: 2022-07-19 17:51:32
 * @LastEditors: ikouane
 * @Description:
 * @version:
 */
const canvasEl = canvas,
  ctx = canvasEl.getContext("2d");

let pickedColor = "#000000",
  pickedSize = 2,
  startPosition = {
    x: 0,
    y: 0,
  },
  isDrawing = false,
  isErasing = false;

canvasEl.width = window.innerWidth;
canvasEl.height = window.innerHeight;

const colorPicker = document.querySelector(".color-picker__wrapper"),
  colorPickerButton = document.querySelector(".tools__item.pick-color"),
  weightPicker = document.querySelector(".weight-picker__wrapper"),
  weightPickerButton = document.querySelector(".tools__item.pick-weight");

let timer = null;

let domEl = document.createDocumentFragment();
const colorArr = [
  "#000000",
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
];

colorArr.forEach((color) => {
  let el = document.createElement("li");
  el.className = "color-picker__item";
  el.dataset.color = color;
  el.style.setProperty("--color", color);
  domEl.appendChild(el);
});

colorPicker.appendChild(domEl);

colorPicker.addEventListener("click", (e) => {
  if (e.target.dataset.color) {
    pickedColor = e.target.dataset.color;
    colorPicker.querySelectorAll("li").forEach((item) => {
      if (pickedColor == item.dataset.color) item.classList.add("active");
      else item.classList.remove("active");
    });
    document
      .querySelector(".tools__wrapper")
      .style.setProperty("--pickedColor", pickedColor);
    setTimeout(() => {
      colorPicker.classList.remove("show");
    }, 100);

    isErasing = false;
    canvasEl.classList.remove("eraser");
    document.querySelector(".tools__item.pencil").classList.add("active");
    document.querySelector(".tools__item.eraser").classList.remove("active");
  }
});

colorPickerButton.addEventListener("click", () => {
  if (colorPicker.classList.contains("show")) {
    colorPicker.classList.remove("show");
  } else {
    colorPicker.classList.add("show");
  }
});

weightPicker.addEventListener("click", (e) => {
  if (e.target.dataset.size) {
    pickedSize = e.target.dataset.size;
    weightPicker.classList.remove("show");

    weightPicker.querySelectorAll("li").forEach((item) => {
      if (pickedSize == item.dataset.size) item.classList.add("active");
      else item.classList.remove("active");
    });
  }
});

weightPickerButton.addEventListener("click", () => {
  if (weightPicker.classList.contains("show")) {
    weightPicker.classList.remove("show");
  } else {
    weightPicker.classList.add("show");
  }
});

document.querySelector(".tools__item.pencil").addEventListener("click", () => {
  isErasing = false;
  canvasEl.classList.remove("eraser");
  document.querySelector(".tools__item.pencil").classList.add("active");
  document.querySelector(".tools__item.eraser").classList.remove("active");
});

document.querySelector(".tools__item.eraser").addEventListener("click", () => {
  isErasing = true;
  canvasEl.classList.add("eraser");
  document.querySelector(".tools__item.pencil").classList.remove("active");
  document.querySelector(".tools__item.eraser").classList.add("active");
});

document.querySelector(".tools__item.clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
});

document.querySelector(".tools__item.save").addEventListener("click", () => {
  let image = canvasEl.toDataURL("image/png");
  let link = document.createElement("a");
  link.download = "my-image.png";
  link.href = image;
  link.click();
});

canvasEl.addEventListener("mousedown", (e) => {
  isDrawing = true;
  startPosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
  clearTimeout(timer);
  document.querySelector(".tools").classList.remove("show");
  colorPicker.classList.add("hide");
  weightPicker.classList.add("hide");
});

canvasEl.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  if (isErasing) {
    ctx.clearRect(e.offsetX, e.offsetY, 10, 10);
  } else {
    ctx.strokeStyle = pickedColor;
    ctx.lineWidth = pickedSize;
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.closePath();
    ctx.stroke();
    startPosition.x = e.offsetX;
    startPosition.y = e.offsetY;
  }
});

canvasEl.addEventListener("mouseup", (e) => {
  isDrawing = false;
  timer = setTimeout(() => {
    document.querySelector(".tools").classList.add("show");
    colorPicker.classList.remove("hide");
    weightPicker.classList.remove("hide");
  }, 400);
});
