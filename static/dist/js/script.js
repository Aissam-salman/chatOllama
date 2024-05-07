import hljs from 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/es/highlight.min.js';
import showdown from 'https://cdn.jsdelivr.net/npm/showdown@2.1.0/+esm'

function cloneAnswerBloc() {
    const output = document.querySelector('#gpt-output');
    const template = document.querySelector('#chat-template');
    const clone = template.cloneNode(true)
    clone.id = "";
    output.append(clone);
    clone.classList.remove("hidden");
    return clone.querySelector(".message")
}

function addToLog(message) {
    const answerBlock = cloneAnswerBloc()
    answerBlock.innerHTML = message;
    return answerBlock;
}

function getChatHistory() {
    const msgBlocks = document.querySelectorAll('.message:not(#chat-template .message)');
    return Array.from(msgBlocks).map(el => el.innerHTML);
}

async function fetchPromptResponse(messages) {
    const res = await fetch("/prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({"messages": messages})
    })

    return res.body.getReader();
}

async function readResponseChunks(reader, answerBlock) {
    const decoder = new TextDecoder()
    const converter = new showdown.Converter();

    let chunks = "";
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks += decoder.decode(value);
        answerBlock.innerHTML = converter.makeHtml(chunks);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('#prompt-form');
    const spinnerIcon = document.querySelector('#spinner-icon');
    const sendIcon = document.querySelector('#send-icon');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        spinnerIcon.classList.remove("hidden");
        sendIcon.classList.add("hidden");

        const prompt = form.elements.prompt.value;
        form.elements.prompt.value = "";
        addToLog(prompt);

        try {
            const messages = getChatHistory();
            const answerBlock = addToLog('Llama3 est en train de répondre...')
            const reader = await fetchPromptResponse(messages);
            await readResponseChunks(reader, answerBlock);
        } catch (err) {
            console.log("error:", err);
        } finally {
            spinnerIcon.classList.add("hidden");
            sendIcon.classList.remove("hidden");
            hljs.highlightAll();
        }
    })
})