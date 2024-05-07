from flask import Flask, render_template, request, Response
import ollama

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/prompt", methods=["POST"])
def prompt():
    messages = request.json['messages']
    conversation = build_conversation_dict(messages)
    return Response(event_stream(conversation), mimetype='text/event-stream')


def build_conversation_dict(messages: list) -> list[dict]:
    return [
        {'role': 'user' if i % 2 == 0 else "assistant", 'content': message}
        for i, message in enumerate(messages)
    ]


def event_stream(conversation: list[dict]) -> str:
    batch_size = 5  # Nombre de messages à envoyer à la fois à Ollama
    for i in range(0, len(conversation), batch_size):
        batch = conversation[i:i + batch_size]
        response = ollama.chat(
            model='llama3',
            messages=batch,
            stream=True
        )

        for part in response:
            text = part['message']['content']
            if len(text):
                yield text


if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)
    # messages = build_conversation_dict(["Bonjour, quel model es-tu ?"])
    # for line in event_stream(messages):
    #     print(line)
