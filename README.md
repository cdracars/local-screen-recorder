# Local Screen Recorder

A tiny, private screen recorder that runs entirely in your browser. Select a screen or window, record it, and save the video locally. Nothing is uploaded.

The app is intentionally dependency-free: semantic HTML, standalone CSS, and a small JavaScript module.

## Use it

Open **[cdracars.github.io/local-screen-recorder](https://cdracars.github.io/local-screen-recorder/)**, click **Start recording**, choose a screen or window, and click **Stop and save** when finished.

Current Firefox, Chrome, Edge, and Safari releases are supported where their Screen Capture and MediaRecorder implementations allow it. System-audio capture varies by browser and operating system.

## Run locally

Because screen capture requires a secure context, serve the page from localhost instead of opening the HTML file directly:

```sh
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765>.

## Privacy

All recording and file creation happen in the browser on your device. The app has no server-side code, analytics, or upload feature.

## License

[MIT](LICENSE)
