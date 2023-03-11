let video = null
const canvas = document.getElementById('vid-canvas')
const ctx = canvas.getContext('2d')


const getVideo = () => {

    navigator.mediaDevices.getUserMedia({video:true}).then(vidStream => {
        video = document.createElement('video')
        video.srcObject = vidStream;
        video.play()

        video.onloadedmetadata = (e) => {
                updateCanvas()      
         };
        
    }).catch((e) => {
        if(e.message === 'Permission denied'){
            const errorMsg = document.createElement('div')
            errorMsg.classList.add('Error')
            errorMsg.innerHTML = `
                <h1>ERROR! PERMISSION DENIED</h1>
            `
            document.querySelector('body').innerHTML = ''
            document.querySelector('body').appendChild(errorMsg)
        }
    })
}


const updateCanvas = () => {
    ctx.drawImage(video,0,0)
    window.requestAnimationFrame(updateCanvas)
}

getVideo()

