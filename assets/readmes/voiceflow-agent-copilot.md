# Voiceflow Agent Copilot CLI

**Proof of Concept (POC):** This is an experimental CLI tool for updating Voiceflow .vf project files with new agent instructions, models, and API tools. You can also use Anthropic Sonnet to generate the API tools.

## Project Setup

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Environment variables:**
   Create a `.env` file in the project root. **You must set your Anthropic API key:**
   ```env
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

## Directory Structure

- `bin/` — CLI entry points
- `src/` — Source code
- `projects/` — Project files
- `versions/` — Saved project versions
- `exports_examples/` — Example export files
- `template/` — Project templates

## Global Installation

You can install the CLI globally to use the `vf-copilot` command from anywhere:

```sh
npm install -g /path/to/your/voiceflow-agent-copilot
```

After installing globally, run any command like this:

```sh
vf-copilot <command>
```

For example:

```sh
vf-copilot setup-project
```

## Usage

For local development, run commands using Node.js:

```sh
node ./bin/vf-copilot.js <command>
```

Or, if you have made the script executable:

```sh
./bin/vf-copilot.js <command>
```

If you install the CLI globally, you can use:

```sh
vf-copilot <command>
```

## CLI Commands
- `add-api-tool [file]` — Interactive prompt to add an API tool to your agent
- `update-instructions` — Update agent instructions
- `set-model` — Change the agent's model
- `list-versions` — List all saved project versions
- `revert-version <version>` — Revert to a previous version
- `edit-project-meta` — Edit project name and description
- `setup-project` — Guided setup: select base, set metadata, add API tool
- `ai-update-instructions [file]` — Use AI to update agent instructions
- `ai-add-api-tool [file]` — Use AI to generate and add an API tool

See `vf-copilot <command> --help` for command-specific options.
