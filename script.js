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
      "https://daba-ai-backend-v1-0.onrender.com/ask-daba-ai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      }
    );

    if (!responseAPI.ok) {
      let errorMessage = `Erro HTTP ${responseAPI.status}`;
      try {
        const errorData = await responseAPI.json();
        errorMessage += ` - ${JSON.stringify(errorData)}`;
      } catch (error) {
        const text = await responseAPI.text();
        if (text) errorMessage += ` - ${text}`;
      }

      throw new Error(errorMessage);
    }

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

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(error);
  }
};

inputElement.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessageToLLM();
});
buttonElement.addEventListener("click", sendMessageToLLM);
