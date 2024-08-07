# Chat ollama with llama3 model
![img.png](img.png)

## Stack
- python3.12.3
- JS 
- HTML 
- Tailwindcss

I use poetry to manage python package. 

Package python need: 
- Flask
- ollama



JS libraries: 
- highlight
- showdown

## Getting started

- go here : https://ollama.com/
- install ollama
  ```curl -fsSL https://ollama.com/install.sh | sh```
- run model
  ```ollama pull llama3.1``` I use this model, select has you want
  
- clone this repo
```git clone https://github.com/Aissam-salman/chatOllama.git```
- go to chatOllama directory
```cd chatOllama```

- install poetry 

**linux, macOS**
```curl -sSL https://install.python-poetry.org | python3 -```

**windows** 
```(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py - ```

- install package 
```poetry install && poetry update```

- run server flask 
```python app.py or flask run```
- Open your navigator with http://127.0.0.1:5000
- Start chat with model selected

