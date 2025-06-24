# Voiceflow KB Content Export

## Running the compiled executable

This is a command-line application. To run it:

1. Open Terminal
2. Navigate to the cloned repo directory
3. Run the following command:

```bash
   ./app/kbce
```

Follow the prompts to enter your domain and API key.

## Running the source code

To install dependencies:

```bash
bun install
```

To run:

```bash
bun start
```

### To compile the executable:

```bash
bun build --compile --minify --sourcemap ./index.ts --outfile kbce
chmod +x kbce
```

https://bun.sh/docs/bundler/executables



[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow-community_vf-kb-content-export&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=voiceflow-community_vf-kb-content-export)
