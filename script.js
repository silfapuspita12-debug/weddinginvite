// 1. Ambil nama tamu dari URL, contoh: index.html?to=Silfa
const params = new URLSearchParams(window.location.search);
const guestName = params.get('to') || 'Tamu Undangan';
document.getElementById('guest-name').textContent = guestName;

// 2. Klik "Buka Undangan": cover ilang, scroll dilepas, bunga mekar
document.getElementById('open-btn').addEventListener('click', function () {
  document.getElementById('cover').classList.add('hidden');
  document.body.classList.add('opened');
  document.querySelectorAll('.flower').forEach(function (f) {
  f.classList.add('blooming');
});
});

// Countdown ke tanggal pernikahan
const targetDate = new Date("2026-12-20T08:00:00+07:00").getTime();

function updateCountdown() {
  const distance = targetDate - new Date().getTime();

  const days    = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours   = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

  document.getElementById('days').textContent    = String(days).padStart(2, '0');
  document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic' });

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById('rsvp-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('guest-input-name').value.trim();
  const attendance = this.querySelector('input[name="attendance"]:checked');
  const message = document.getElementById('guest-message').value.trim();
  if (!name || !attendance || !message) return;

   fetch("https://script.google.com/macros/s/AKfycbwluSM1BgGcxAY3BRMJB2wMhfAYSAnjbCO0oI-sixHElGK7fTT2QhG4nNLxDTbxuvKo/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      type: "rsvp",
      nama: name,
      kehadiran: attendance.value,
      pesan: message
    })
  });

  const emptyState = document.getElementById('wish-empty');
  if (emptyState) emptyState.style.display = 'none';

  const item = document.createElement('div');
  item.className = 'wish-item';
  item.innerHTML =
    '<div class="wish-header"><strong>' + escapeHtml(name) + '</strong>' +
    '<span class="badge ' + (attendance.value === 'hadir' ? 'badge-hadir' : 'badge-tidak') + '">' +
    (attendance.value === 'hadir' ? 'Hadir' : 'Tidak Hadir') + '</span></div>' +
    '<p>' + escapeHtml(message) + '</p>';

  document.getElementById('wish-list').prepend(item);
  this.reset();
});

document.querySelectorAll('.copy-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    const targetId = this.getAttribute('data-target');
    const bankName = this.getAttribute('data-bank');
    const accountNumber = document.getElementById(targetId).textContent;

    navigator.clipboard.writeText(accountNumber).then(() => {
      const originalText = this.textContent;
      this.textContent = 'Tersalin!';
      this.classList.add('copied');
      setTimeout(() => {
        this.textContent = originalText;
        this.classList.remove('copied');
      }, 2000);
    });

    fetch("https://script.google.com/macros/s/AKfycbwluSM1BgGcxAY3BRMJB2wMhfAYSAnjbCO0oI-sixHElGK7fTT2QhG4nNLxDTbxuvKo/exec", {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({
        type: "gift_copy",
        nama: guestName,
        bank: bankName
      })
    });
  });
});