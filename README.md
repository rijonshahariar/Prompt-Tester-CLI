# Prompt Tester CLI

A lightweight CLI tool to test AI prompts locally with mock responses or live API calls, saving API costs during development.

## Installation

```bash
npm install -g prompt-tester-cli
```

## Usage

### Initialize a mock file
Create a `mocks.json` file to store mock prompt-response pairs:
```bash
prompt-tester-cli init
```
This creates an empty `mocks.json` file in your current directory.

### Test a prompt with a mock response
Test a prompt using a mock response from `mocks.json`:
```bash
prompt-tester-cli test --prompt "What is the capital of France?" --mock mocks.json
```
If the prompt exists in the mock file, it returns the stored response. If not, it adds the prompt with a placeholder response.

### Test a prompt with a live API
Test a prompt using a live AI API (requires an OpenAI API key):
```bash
export OPENAI_API_KEY=your-openai-api-key
prompt-tester-cli test --prompt "What is the capital of France?" --live
```
Set `OPENAI_API_KEY` in your environment for live testing.

## Mock File Format
The `mocks.json` file should follow this format:
```json
[
  {
    "prompt": "Your prompt here",
    "response": "Mock response here"
  }
]
```

## Prerequisites
- Node.js >= 16
- For live testing, an OpenAI API key.

## Development
1. Clone the repo:
   ```bash
   git clone https://github.com/rijonshahariar/Prompt-Tester-CLI.git
   cd prompt-tester-cli
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Run locally:
   ```bash
   npm start -- test --prompt "Test prompt" --mock mocks.json
   ```

## License
MIT