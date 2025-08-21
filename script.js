const inputElement = document.getElementById("prompt-input");
const buttonElement = document.getElementById("submit-button");
const containerPrompt = document.getElementById("container-prompt");
const apresentationAiElement = document.getElementById("hi");
const containerChatElement = document.getElementById("container-chat");

const sendMessageToLLM = async () => {
  if (!inputElement.value) {
    throw new Error("Prompt vazio!");
  }

  const question = inputElement.value;

  containerChatElement.innerHTML += `
    <div class="container-user-message">
      <div class="user-message">
        <p>
          ${question}
        </p>
      </div>
    </div>
  `;

  inputElement.value = "";

  setTimeout(() => {
    containerChatElement.innerHTML += `
      <div id="loading-message">
        <p>Thinking</p>
      </div>
    `;

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, 600);

  containerPrompt.style.bottom = "40px";
  apresentationAiElement.style.opacity = "0";

  try {
    const responseAPI = await fetch(
      "https://daba-ai-frontend-v1-0.onrender.com/ask-daba-ai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ i: question }),
      }
    );

    if (!responseAPI.ok) throw new Error("Erro!");

    const data = await responseAPI.json();
    console.log(data);

    apresentationAiElement.style.display = "none";
    document.getElementById("loading-message").remove();

    containerChatElement.innerHTML += ` 
      <div class="container-ai-message">
        <div class="ai-message">
          <p>${data.answer}</p>
        </div>
      </div>
    `;

    if (!responseAPI.ok) {
      let errorMessage = `Erro HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (error) {
        const text = await response.text();
        if (text) errorMessage += ` - ${text}`;
      }

      throw new Error(errorMessage);
    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(error);
    containerChatElement.innerHTML += ` 
      <div id="error-ai-message">
        <div id="error-message">
          <p>
            <strong>Erro ao gerar resposta!</strong>
            <br> 
            <p id="p">Por favor, envie uma nova mensagem ou tente amanhã!</p>
          </p>
        </div>
      </div>
    `;

    document.getElementById("loading-message").remove();
  }
};

inputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessageToLLM();
});
buttonElement.addEventListener("click", sendMessageToLLM);
