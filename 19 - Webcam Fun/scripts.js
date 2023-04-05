const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
  navigator.mediaDevices.getUserMedia({video:true,audio:false})
    .then(videoStream => {
      video.srcObject=videoStream
        video.play()
    })
    .catch(err => {
    console.error(err)
  })
  
}


function paintCanvas() {
  let imageData = [];
  canvas.width=video.clientWidth
  canvas.height = video.clientHeight
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    imageData = ctx.getImageData(0, 0, video.videoWidth,video.videoHeight)
    // imageData=redShift(imageData)
    // imageData=splitColors(imageData)
    imageData =removeRGBValues(imageData)
    ctx.putImageData(imageData,0,0)

    // console.log(imageData)
    // debugger;
    
  }, 20)
  
  function redShift(imageData) {
    
    for (let i = 0; i < imageData.data.length - 3; i += 4) {
      imageData.data[i + 0] = imageData.data[i + 0] + 150
      imageData.data[i + 1] = imageData.data[i + 0] - 150
      imageData.data[i + 2] = imageData.data[i + 0] - 150
    }

    return imageData;
  }
    
  }

  function splitColors(imageData) {
    for (let i = 0; i < imageData.data.length-3; i+=4){
      imageData.data[i-50]=imageData.data[i+0]
      imageData.data[i+0]=imageData.data[i+1]
      imageData.data[i+50]=imageData.data[i+2]
    }
    return imageData
  }
  
  let inputsVals={}
  function removeRGBValues(imageData) {
    const inputs = document.querySelectorAll('input')
    inputs.forEach(input => input.addEventListener('change', () => {
      inputsVals[input.name] = input.value;
    }
    ))
    for (let i = 0; i < imageData.data.length-3; i+=4){
      let red=imageData.data[i+0] //red
      let green=imageData.data[i+1] //green
      let blue = imageData.data[i + 2] //blue
      if (
        red >= inputsVals['rmin'] && red <= inputsVals['rmax']
        || green >= inputsVals['gmin'] && green <= inputsVals['gmax']
        || blue >= inputsVals['bmin'] && blue <= inputsVals['bmax']
      )
      imageData.data[i+4]=0 //alpha
    }
    return imageData;
  }

function takePhoto() {
  snap.play()
  const data = canvas.toDataURL("image/jpeg")
  let linkEl = document.createElement('a')
  linkEl.href = data;
  linkEl.setAttribute('download', `snap_${Math.floor(Math.random()*100)}`)
  linkEl.innerHTML = `<img src=${data} alt='snapshot'/>`
  strip.appendChild(linkEl)
}

video.addEventListener('canplay', paintCanvas)

getVideo()