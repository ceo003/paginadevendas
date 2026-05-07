// FAQ Accordion
const questions = document.querySelectorAll('.faq-question');

questions.forEach((question) => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;

    if (answer.style.display === 'block') {
      answer.style.display = 'none';
    } else {
      answer.style.display = 'block';
    }
  });
});

// Countdown Timer
function startTimer(duration, display) {
  let timer = duration, hours, minutes, seconds;
  setInterval(function () {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer % 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = hours + ":" + minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration; // Reset to 2 hours if it reaches 0
    }
  }, 1000);
}

// Live Viewers Counter
function startLiveCounter() {
  const countElement = document.getElementById('live-count');
  if (!countElement) return;

  setInterval(() => {
    // Generate a random number between 157 and 163
    const newCount = Math.floor(Math.random() * (163 - 157 + 1)) + 157;
    countElement.textContent = newCount;
  }, 3000); // Update every 3 seconds
}

window.onload = function () {
  const twoHours = 60 * 60 * 2;
  const display = document.querySelector('#timer');
  startTimer(twoHours, display);
  startLiveCounter();

  // Tentar forçar o autoplay com som
  const video = document.getElementById('hero-video');
  if (video) {
    video.play().catch(error => {
      console.log("Autoplay com som bloqueado pelo navegador. O usuário precisa interagir primeiro.");
    });
  }
};

// Lógica de Pagamento Dinâmico
async function fazerPagamento(metodo) {
  const originalText = event.target.textContent;
  const btn = event.target;
  
  try {
    btn.disabled = true;
    btn.textContent = "PROCESSANDO...";

    const response = await fetch('/api/pagar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: metodo })
    });

    const data = await response.json();

    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("Erro ao gerar pagamento: " + (data.error || "Tente novamente."));
      btn.disabled = false;
      btn.textContent = originalText;
    }
  } catch (error) {
    alert("Erro de conexão. Verifique sua internet.");
    btn.disabled = false;
    btn.textContent = originalText;
  }
}
