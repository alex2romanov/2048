(function () {
  const tg = window.Telegram.WebApp;

  const MODELS = [
    { id: "openai/gpt-4o-mini",          label: "GPT-4o Mini" },
    { id: "openai/gpt-4o",               label: "GPT-4o" },
    { id: "openai/gpt-4.1",              label: "GPT-4.1" },
    { id: "openai/gpt-4.1-mini",         label: "GPT-4.1 Mini" },
    { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
    { id: "anthropic/claude-3.5-haiku",  label: "Claude 3.5 Haiku" },
    { id: "google/gemini-1.5-pro",       label: "Gemini 1.5 Pro" },
    { id: "google/gemini-1.5-flash",     label: "Gemini 1.5 Flash" },
    { id: "deepseek/deepseek-r1",        label: "DeepSeek R1" },
    { id: "mistralai/mistral-large-latest", label: "Mistral Large" },
    { id: "meta-llama/llama-3.1-70b-instruct", label: "Llama 3.1 70B" },
    { id: "qwen/qwen-2.5-72b-instruct",  label: "Qwen 2.5 72B" },
  ];

  const modelSelect = document.getElementById("modelSelect");
  MODELS.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    modelSelect.appendChild(opt);
  });

  document.getElementById("applyModel").onclick = () => {
    const id = modelSelect.value;
    const label = (MODELS.find(m => m.id === id) || {}).label || id;
    tg.HapticFeedback.impactOccurred("rigid");
    tg.sendData(JSON.stringify({ action: "set_model", model_id: id, label }));
    tg.close();
  };
})();

