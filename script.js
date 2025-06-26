// Gun setup with public relay
const gun = Gun('https://gun-manhattan.herokuapp.com/gun');

const dotRef = gun.get('dotToggleSync');
const camRef = gun.get('camToggleSync');

const dotToggle = document.getElementById('dotToggle');
const camToggle = document.getElementById('camToggle');
const dot = document.getElementById('dot');
const video = document.getElementById('video');

// Sync: Dot Toggle
dotToggle.addEventListener('change', () => {
  const state = dotToggle.checked ? 'on' : 'off';
  dotRef.put({ state });
});

dotRef.on((data) => {
  if (!data || !data.state) return;
  const isOn = data.state === 'on';
  dot.style.backgroundColor = isOn ? 'white' : 'black';
  dotToggle.checked = isOn;
});

// Sync: Camera Toggle
camToggle.addEventListener('change', () => {
  const state = camToggle.checked ? 'on' : 'off';
  camRef.put({ state });
});

camRef.on((data) => {
  if (!data || !data.state) return;
  const isOn = data.state === 'on';
  camToggle.checked = isOn;

  if (isOn) {
    startCamera();
  } else {
    stopCamera();
  }
});

// Functions to start/stop front camera
let stream = null;

function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  }).then(s => {
    stream = s;
    video.srcObject = stream;
    video.style.display = 'block';
  }).catch(err => {
    console.error("Camera Error:", err);
  });
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }
  video.style.display = 'none';
}
