# Browser SLM Chat with Voiceflow Knowledge Base

A web application that runs small language models (SLMs) locally in your browser using [WebLLM](https://github.com/mlc-ai/web-llm), enhanced with Voiceflow Knowledge Base integration for context-aware responses.

## ✨ Features

- 🧠 **Local SLM Inference**: Run models entirely in your browser - no server required
- 🔍 **Knowledge Base Integration**: Connect to Voiceflow's Knowledge Base for enhanced, context-aware responses
- 🚀 **Multiple Model Support**: Choose from optimized models for different performance needs
- 💾 **Smart Caching**: Models are cached locally for faster subsequent loads
- 🎨 **Modern UI**: Clean, responsive interface with real-time progress tracking
- ⚡ **WebGPU Acceleration**: Leverages WebGPU for high-performance inference
- 🔧 **Configurable Settings**: Customize API keys, chunk limits, and model preferences

## 🎯 Supported Models

| Model | Size | Speed | Memory Usage | Best For |
|-------|------|-------|--------------|----------|
| **Qwen3 0.6B** (Default) | 600M | ⚡⚡⚡ | 🟢 Low | Quick responses, mobile devices |
| **Llama 3.2 1B** | 1B | ⚡⚡ | 🟡 Medium | Balanced performance |
| **TinyLlama 1.1B** | 1.1B | ⚡⚡ | 🟡 Medium | General conversation |
| **Phi 3.5 Mini** | 3.8B | ⚡ | 🟠 High | Complex reasoning |
| **SmolLM2-360M** | 360M | ⚡⚡⚡ | 🟢 Low | Ultra-lightweight |

## 📋 Requirements

### Browser Compatibility
🌐 **A modern browser with WebGPU support:**
- Chrome 113+
- Edge 113+
- Firefox 118+

### Hardware Requirements
💻 **Device specifications:**
- GPU with WebGPU support (integrated or dedicated)
- Minimum 4GB RAM (8GB+ recommended)
- Stable internet connection for initial model download

### Storage Requirements
💾 **Disk space (varies by model):**
- SmolLM2-360M: ~200MB
- Qwen3 0.6B: ~400MB
- Llama 3.2 1B: ~700MB
- TinyLlama 1.1B: ~800MB
- Phi 3.5 Mini: ~2.5GB


## 🚀 Quick Start

### 1. Setup
1. Clone or download this repository
2. Open `index.html` in a supported browser
3. Wait for the default model (Qwen3 0.6B) to download and initialize

### 2. Configure Voiceflow KB
1. Click the ⚙️ settings button
2. Enter your Voiceflow API key (`VF.DM.xxxxx...`)
3. Adjust chunk limit (1-10) for knowledge base queries
4. Save settings

### 3. Start Chatting
- Type your question in the input field
- Press Enter or click Send
- For knowledge base queries, use detailed questions (15+ characters)
- Short questions will use pure SLM responses

## ⚙️ Configuration

### Voiceflow API Key
To enable knowledge base integration:
1. Get your API key from the Voiceflow Dashboard
2. Format: `VF.DM.` followed by your key
3. Configure in Settings → Voiceflow API Key

### Model Selection
Switch between models in Settings:
- Models are downloaded and cached automatically
- Cache persists between sessions
- Use "Clear Cache & Re-download" to force refresh

### Performance Tuning
- **Chunk Limit**: Controls how much context from knowledge base (1-10)
- **Model Choice**: Balance between speed and capability
- **Browser**: Chrome generally offers best WebGPU performance

## 🛠️ Technical Details

### Architecture
```
User Input → Knowledge Base Query → LLM Processing → Markdown Response
     ↓              ↓                    ↓              ↓
  Browser       Voiceflow API        WebLLM         Marked.js
```

### WebLLM Integration
- **Engine**: Uses `@mlc-ai/web-llm` for local inference
- **Acceleration**: WebGPU for GPU acceleration
- **Caching**: IndexedDB and Cache API for model storage
- **Streaming**: Real-time token-by-token response generation

### Data Flow
1. **Short queries (<15 chars)**: Direct LLM processing
2. **Long queries**: Knowledge base search → Context injection → LLM processing
3. **Response rendering**: Markdown parsing with syntax highlighting

## 🔧 Advanced Usage

### Cache Management
- **View Cache**: Check browser DevTools → Application → Storage
- **Clear Specific Model**: Settings → Clear Cache & Re-download
- **Reset Everything**: Settings → Reset Model + Clear Cache

### Model URLs
Models are loaded from MLCEngine's CDN:
```
https://huggingface.co/mlc-ai/{model-name}/resolve/main/
```

### Custom Models
To use custom models, modify the `modelSelect` options in the HTML and ensure the model is in MLC format.

## 🐛 Troubleshooting

### Common Issues

**❌ "WebGPU not supported"**
- Update to Chrome 113+, Edge 113+, or Firefox 118+
- Enable WebGPU flags if needed
- Check GPU drivers are up to date

**❌ Model download fails**
- Check internet connection
- Clear browser cache and try again
- Try a different model

**❌ "Invalid API key"**
- Verify your Voiceflow API key format
- Ensure key has proper permissions
- Check key isn't expired

**❌ Slow performance**
- Try a smaller model (Qwen3 0.6B or SmolLM2-360M)
- Close other tabs to free up GPU memory
- Restart browser to clear memory

### Performance Optimization
- **GPU Memory**: Close other GPU-intensive applications
- **RAM Usage**: Use smaller models on devices with limited RAM
- **Network**: Ensure stable connection for initial download

## 🏗️ Development

### Local Development
```bash
# No build process required - pure web technologies
# Simply open index.html in a supported browser

# For development with live reload:
npx serve .
# or
python -m http.server 8000
```

### Project Structure
```
├── index.html          # Main application file
├── README.md           # This file
└── .gitignore         # Git ignore patterns
```

### Dependencies (CDN)
- `@mlc-ai/web-llm`: LLM inference engine
- `marked`: Markdown parsing and rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with multiple models and browsers
5. Submit a pull request

## 📄 License

This project is open source. Please check individual component licenses:
- [WebLLM](https://github.com/mlc-ai/web-llm) - Apache 2.0
- [Marked.js](https://github.com/markedjs/marked) - MIT

## 🙏 Acknowledgments

- **[MLC AI](https://github.com/mlc-ai)** for the incredible WebLLM framework
- **[Voiceflow](https://voiceflow.com)** for the Knowledge Base API
- **Model providers**: Qwen, Meta (Llama), TinyLlama team, Microsoft (Phi), and Hugging Face (SmolLM2)

## 📚 Additional Resources

- [WebLLM Documentation](https://webllm.mlc.ai/)
- [WebGPU Compatibility](https://caniuse.com/webgpu)
- [Voiceflow API Documentation](https://docs.voiceflow.com/)
- [MLC LLM Project](https://mlc.ai/)

---

