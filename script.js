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
  const fifteenMinutes = 60 * 15;
  const display = document.querySelector('#timer');
  startTimer(fifteenMinutes, display);
  startLiveCounter();
  iniciarNotificacoes();
};

function darLike(btn, likesIniciais) {
  if (btn.classList.contains('liked')) {
    return;
  }
  
  btn.classList.add('liked');
  const countElement = btn.querySelector('.like-count');
  const novoTotal = likesIniciais + 1;
  countElement.textContent = novoTotal;
}

function fazerPagamentoDireto(metodo) {
  // Verifica o número de WhatsApp primeiro
  const inputFinal = document.getElementById('whatsapp-number-final');
  const numero = inputFinal.value.trim();
  
  if (numero.length < 9 || !/^\d+$/.test(numero.replace(/\s/g, ''))) {
    alert('Por favor, insira um número de WhatsApp válido!');
    return;
  }

  // Se o WhatsApp for válido, chama a função de pagamento diretamente
  fazerPagamento(metodo);
}

// Lógica de Pagamento Dinâmico
async function fazerPagamento(metodo) {
  // Pega todos os botões de pagamento
  const botoes = document.querySelectorAll('.payment-btn-final');
  
  try {
    // Desabilita todos os botões e altera o texto do que foi clicado
    botoes.forEach(botao => {
      botao.disabled = true;
    });
    
    // Salva o conteúdo original do botão clicado
    const btnClicado = event.currentTarget;
    const originalContent = btnClicado.innerHTML;
    btnClicado.innerHTML = "<span style='font-size: 0.8rem;'>AGUARDE...</span>";

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
      // Restaura os botões
      botoes.forEach(botao => {
        botao.disabled = false;
      });
      btnClicado.innerHTML = originalContent;
    }
  } catch (error) {
    console.error("Erro no pagamento:", error);
    alert("Erro: " + error.message);
    // Restaura os botões
    const btnClicado = event.currentTarget;
    const originalContent = btnClicado ? btnClicado.innerHTML : '';
    botoes.forEach(botao => {
      botao.disabled = false;
    });
    if (btnClicado) {
      btnClicado.innerHTML = originalContent;
    }
  }
}
