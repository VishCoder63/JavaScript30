const video = document.querySelector('video')
const progress = document.querySelector('.progress')
const progress_filler = document.querySelector('.progress .progress__filled')
const button = document.querySelector('.toggle');
const slider_inputs = document.querySelectorAll('input[class="player__slider"]');
const playRateButtons = document.querySelectorAll('[data-skip]');

let isPressed = false;

function handleDurationChange() {
  progress_filler.style.flexBasis =`${(100/ this.duration) * this.currentTime}%`
}
function handleClick() {
  video.paused ? video.play() : video.pause()
  button.innerText=video.paused ? "►" : "❚ ❚";
}

function handlePlayrate(e) {
  let { target: { key } } = e;
  if (key) {
    if (key === 'ArrowRight') video.currentTime += 25;
    else if (key === 'ArrowLeft') video.currentTime -= 25;
  }
  else video.currentTime += parseFloat(this.dataset.skip);
}

function handleSliderInput(e) {
  let { target: { key } } = e;
  if (key) {
    let volumeSlider = [...slider_inputs].find(el => el.name === e.target.name);
    let max = parseFloat(volumeSlider.max);
    let min = parseFloat(volumeSlider.min);
    if (key === 'ArrowUp')video[e.target.name] = Math.min(max, video[e.target.name] + parseFloat(volumeSlider.step));
    else if (key === 'ArrowDown')video[e.target.name] = Math.max(min, video[e.target.name] - parseFloat(volumeSlider.step));
    volumeSlider.value=video[e.target.name]
  }else video[e.target.name] = e.target.value;
}

function handlePlayPosition(e) {
  video.currentTime=(video.duration / this.clientWidth) * e.offsetX;
  progress_filler.style.flexBasis =`${(100/ this.clientWidth) * e.offsetX}%`
}


function handlePlayPositionDrag(e) {
  if (!isPressed) return;
  video.currentTime =(video.duration / this.clientWidth) * e.offsetX
    progress_filler.style.flexBasis =`${(100/ this.clientWidth) * e.offsetX}%`
}
video.addEventListener('click',handleClick)
video.addEventListener('timeupdate',handleDurationChange)
button.addEventListener('click',handleClick)
playRateButtons.forEach(button=>button.addEventListener('click',handlePlayrate))
slider_inputs.forEach(slider=>slider.addEventListener('input',handleSliderInput))

progress.addEventListener('click', handlePlayPosition)
progress.addEventListener('mousedown', () => isPressed = true)
progress.addEventListener('mouseup', () => isPressed = false)
progress.addEventListener('mousemove', handlePlayPositionDrag)
window.addEventListener('keydown', (e) => {
  if (!e.key.includes('Arrow')) return;
  else {
    if (e.key == 'ArrowRight' || e.key == 'ArrowLeft') handlePlayrate({ target: { name: 'playbackRate', key: e.key } })
    else handleSliderInput({ target: { name: 'volume', key: e.key } })
    
  }
})
