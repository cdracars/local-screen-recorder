const MIME_TYPES = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
  'video/mp4'
];

const elements = {
  start: document.querySelector('#start'),
  stop: document.querySelector('#stop'),
  status: document.querySelector('#status'),
  includeAudio: document.querySelector('#audio')
};

let recorder;
let stream;
let chunks = [];

function assertRecordingSupport() {
  if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) {
    throw new Error(
      'This browser does not support screen recording. Try a current Firefox, Chrome, Edge, or Safari release.'
    );
  }
}

function getSupportedMimeType() {
  return MIME_TYPES.find(mimeType => MediaRecorder.isTypeSupported(mimeType));
}

function setRecordingState(isRecording, message) {
  elements.start.disabled = isRecording;
  elements.stop.disabled = !isRecording;
  elements.status.textContent = message;
}

function stopTracks() {
  stream?.getTracks().forEach(track => track.stop());
}

function downloadRecording() {
  const mimeType = recorder.mimeType || 'video/webm';
  const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const blob = new Blob(chunks, { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `screen-recording-${new Date().toISOString().replaceAll(':', '-')}.${extension}`;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  stopTracks();
  setRecordingState(false, `Saved ${extension.toUpperCase()} recording to your Downloads folder.`);
}

function stopRecording() {
  if (recorder?.state !== 'inactive') {
    recorder.stop();
  }
}

function configureRecorder(captureStream) {
  const mimeType = getSupportedMimeType();
  const options = mimeType ? { mimeType } : undefined;

  chunks = [];
  recorder = new MediaRecorder(captureStream, options);
  recorder.addEventListener('dataavailable', event => {
    if (event.data.size) chunks.push(event.data);
  });
  recorder.addEventListener('stop', downloadRecording, { once: true });
  captureStream.getVideoTracks()[0].addEventListener('ended', stopRecording, { once: true });
}

async function startRecording() {
  try {
    assertRecordingSupport();
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { frameRate: 30 },
      audio: elements.includeAudio.checked
    });

    configureRecorder(stream);
    recorder.start(1000);
    setRecordingState(true, 'Recording…');
  } catch (error) {
    stopTracks();
    const message = error.name === 'NotAllowedError'
      ? 'Screen selection was cancelled or permission was denied.'
      : `Could not start: ${error.message}`;
    setRecordingState(false, message);
  }
}

elements.start.addEventListener('click', startRecording);
elements.stop.addEventListener('click', stopRecording);
