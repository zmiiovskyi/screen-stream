import WebSocket from 'ws';
import { createCanvas } from 'canvas';

const ws = new WebSocket('ws://localhost:8080/stream');

// Параметри відео
const WIDTH = 640;
const HEIGHT = 360;

ws.on('open', () => {
  console.log('🟢 Підключено до сервера');
  let hue = 0;

  setInterval(() => {
    // Створюємо кольоровий кадр
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Конвертуємо в PNG
    const buffer = canvas.toBuffer('image/png');

    // Надсилаємо
    ws.send(buffer);

    hue = (hue + 10) % 360;
  }, 300); // ~3 кадри/секунду
});
