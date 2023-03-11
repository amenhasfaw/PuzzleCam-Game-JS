let VIDEO = null
const canvas = document.getElementById('vid-canvas')
const startBtn = document.getElementById('start')
const ctx = canvas.getContext('2d')
let SIZE = {x:180,y:60,width:640,height:480,row:5,column:5}
const CANVAS = {width:1000,height:600}
let PIECES = []


const main = () => {

    navigator.mediaDevices.getUserMedia({video:true}).then(vidStream => {
        VIDEO = document.createElement('video')
        VIDEO.srcObject = vidStream;
        VIDEO.play()

        VIDEO.onloadedmetadata = (e) => {
                initializePieces(SIZE.row,SIZE.column)
                updateCanvas()  
                // randomizePieces()

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
    ctx.clearRect(0,0,CANVAS.width,CANVAS.height)
    
    ctx.globalAlpha=0.05
    ctx.drawImage(VIDEO,SIZE.x,SIZE.y,SIZE.width,SIZE.height)
    ctx.globalAlpha = 1 

    for(let i=0;i<PIECES.length;i++){
        PIECES[i].draw(ctx)
    }
    
    window.requestAnimationFrame(updateCanvas)
}


class Pieces{
    constructor(row,column){
        this.rowIndex = row
        this.columnIndex = column
        this.width = SIZE.width/SIZE.column
        this.height = SIZE.height/SIZE.row
        this.x=SIZE.x+this.width*this.columnIndex
        this.y=SIZE.y+this.height*this.rowIndex
    }

    draw(){
        ctx.beginPath();

        ctx.drawImage(VIDEO,
            this.columnIndex*VIDEO.videoWidth/SIZE.column,
            this.rowIndex*VIDEO.videoHeight/SIZE.row,
            VIDEO.videoWidth/SIZE.column,
            VIDEO.videoHeight/SIZE.row,
            this.x,
            this.y,
            this.width,
            this.height)


        ctx.rect(this.x,this.y,this.width,this.height)
        ctx.stroke()
    }
}

const initializePieces = (row,column) => {

    PIECES = []

    SIZE.row = row
    SIZE.column = column

    for(let i=0;i<row;i++)
        for(let j=0;j<column;j++){
            PIECES.push(new Pieces(i,j))
        }    
}


const randomizePieces = () => {
    for (let i=0;i<PIECES.length;i++){
        let loc = {
            x: Math.random() * (CANVAS.width - PIECES[i].width),
            y: Math.random() * (CANVAS.height - PIECES[i].height)
        }

        PIECES[i].x = loc.x
        PIECES[i].y = loc.y
    }
}

startBtn.addEventListener('click', randomizePieces)