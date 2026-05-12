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

// Notificações de Prova Social
const nomes = [
  "Alberto Mucove",
  "Maria da Graça",
  "João Muchanga",
  "Ana Sousa",
  "Carlos Zefanias",
  "Teresa Mazive",
  "David Simões",
  "Luísa Nhantumbo",
  "Fernando Chissano",
  "Isabel Mavunha",
  "Paulo Manjate",
  "Célia Matavele",
  "Ricardo Ngule",
  "Sofia Uamusse",
  "Eduardo Júnior",
  "Marta Dinis",
  "António Macaringue",
  "Clara Chauque",
  "Miguel Cuambe",
  "Helena Sitoe",
  "Luís Malate",
  "Rosa Tembe",
  "Jorge Nhabinde",
  "Fátima Mondlane",
  "André Mazive"
];

const metodos = ["M-Pesa", "e-Mola"];

function criarNotificacao() {
  const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
  const metodoAleatorio = metodos[Math.floor(Math.random() * metodos.length)];
  const minutosAtras = Math.floor(Math.random() * 15) + 1; // 1 a 15 minutos atrás

  const notification = document.createElement('div');
  notification.className = 'social-notification';
  notification.innerHTML = `
    <div class="icon">✓</div>
    <div class="text">
      <strong>${nomeAleatorio}</strong> acabou de comprar via <strong>${metodoAleatorio}</strong><br>
      <small>há ${minutosAtras} minuto${minutosAtras > 1 ? 's' : ''}</small>
    </div>
  `;

  const container = document.getElementById('social-notifications');
  container.appendChild(notification);

  // Remover a notificação após a animação
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function iniciarNotificacoes() {
  // Primeira notificação após 5 segundos
  setTimeout(criarNotificacao, 5000);

  // Notificações subsequentes a cada 8-15 segundos
  setInterval(() => {
    const intervalo = Math.floor(Math.random() * (15000 - 8000 + 1)) + 8000;
    setTimeout(criarNotificacao, intervalo);
  }, 10000);
}

window.onload = function () {
  const twoHours = 60 * 60 * 2;
  const display = document.querySelector('#timer');
  startTimer(twoHours, display);
  startLiveCounter();
  iniciarNotificacoes();

  // Tentar forçar o autoplay com som
  const video = document.getElementById('hero-video');
  if (video) {
    video.play().catch(error => {
      console.log("Autoplay com som bloqueado pelo navegador. O usuário precisa interagir primeiro.");
    });
  }
};

// Lógica do Questionário e Fluxo de Venda
function mostrarQuestionario() {
  // Chamado pelo botão do Hero
  const card = document.getElementById('main-action-card');
  card.scrollIntoView({ behavior: 'smooth' });
  
  // Se ainda não iniciou, inicia automaticamente
  if (document.getElementById('inicio-fluxo').style.display !== 'none') {
    iniciarQuestionario();
  }
}

function iniciarQuestionario() {
  document.getElementById('inicio-fluxo').style.display = 'none';
  document.getElementById('questionario-fluxo').style.display = 'block';
  document.getElementById('main-action-card').scrollIntoView({ behavior: 'smooth' });
}

function proximaPergunta(atual, resposta) {
  console.log(`Pergunta ${atual} respondida: ${resposta}`);
  
  const stepAtual = document.getElementById(`pergunta-${atual}`);
  stepAtual.style.display = 'none';

  const proximo = atual + 1;
  const proximoStep = document.getElementById(`pergunta-${proximo}`);

  if (proximoStep) {
    proximoStep.style.display = 'block';
  } else {
    // Se não houver próxima pergunta, mostra o resultado
    document.getElementById('quiz-resultado').style.display = 'block';
  }
}

function mostrarWhatsApp() {
  document.getElementById('quiz-resultado').style.display = 'none';
  document.getElementById('whatsapp-step').style.display = 'block';
  document.getElementById('main-action-card').scrollIntoView({ behavior: 'smooth' });
}

function validarWhatsApp() {
  const input = document.getElementById('whatsapp-number');
  const numero = input.value.trim();
  
  // Verifica se o número tem pelo menos 9 dígitos (formato moçambicano)
  if (numero.length < 9 || !/^\d+$/.test(numero.replace(/\s/g, ''))) {
    alert('Por favor, insira um número de WhatsApp válido!');
    return;
  }

  // Se o número for válido, continua para o pagamento
  document.getElementById('whatsapp-step').style.display = 'none';
  document.getElementById('pagamento-fluxo').style.display = 'block';
  document.getElementById('main-action-card').scrollIntoView({ behavior: 'smooth' });
}

function mostrarPagamento() {
  document.getElementById('questionario-fluxo').style.display = 'none';
  document.getElementById('pagamento-fluxo').style.display = 'block';
  document.getElementById('main-action-card').scrollIntoView({ behavior: 'smooth' });
}

// Lógica de Pagamento Dinâmico
async function fazerPagamento(metodo) {
  // Captura o botão que foi clicado
  const btn = event.currentTarget;
  const originalContent = btn.innerHTML;
  
  try {
    btn.disabled = true;
    btn.innerHTML = "<span style='font-size: 0.8rem;'>AGUARDE...</span>";

    const response = await fetch('/api/pagar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: metodo })
    });

    // Se a resposta for um erro de rede ou servidor
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erro no servidor");
    }

    const data = await response.json();

    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      alert("Erro ao gerar pagamento: " + (data.error || "Tente novamente."));
      btn.disabled = false;
      btn.innerHTML = originalContent;
    }
  } catch (error) {
    console.error("Erro no pagamento:", error);
    alert("Erro: " + error.message);
    btn.disabled = false;
    btn.innerHTML = originalContent;
  }
}
