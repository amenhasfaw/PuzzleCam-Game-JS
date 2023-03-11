let VIDEO = null
const canvas = document.getElementById('vid-canvas')
const startBtn = document.getElementById('start')
const restartBtn = document.getElementById('restart')
const ctx = canvas.getContext('2d')
let SIZE = {x:180,y:75,width:423,height:317,row:5,column:5}
const CANVAS = {width:800,height:500}
let PIECES = []
let SELECTED_PIECE = null


const main = () => {

    navigator.mediaDevices.getUserMedia({video:true}).then(vidStream => {
        VIDEO = document.createElement('video')
        VIDEO.srcObject = vidStream;
        VIDEO.play()

        VIDEO.onloadedmetadata = (e) => {
                initializePieces(SIZE.row,SIZE.column)
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


const addEventListeners = () => {
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
}



const onMouseDown = (e) => {
    SELECTED_PIECE = getPressedPiece(e)
    if(SELECTED_PIECE!=null){
        const index =PIECES.indexOf(SELECTED_PIECE)
        if(index>-1){
            PIECES.splice(index,1)
            PIECES.push(SELECTED_PIECE)
        }
        SELECTED_PIECE.offset={
            x:e.x-SELECTED_PIECE.x,
            y:e.y-SELECTED_PIECE.y
        }
    }
}

const onMouseMove = (e) => {
    if(SELECTED_PIECE!=null){
        SELECTED_PIECE.x=e.x-SELECTED_PIECE.offset.x
        SELECTED_PIECE.y=e.y-SELECTED_PIECE.offset.y
    }
}

const onMouseUp = (e) => {
    if(SELECTED_PIECE!=null && SELECTED_PIECE.isClose()){
        SELECTED_PIECE.snap()
    }
    SELECTED_PIECE=null
    
}

const getPressedPiece = (loc) => {
    for(let i=PIECES.length-1;i>=0;i--){
        console.log(loc.x - 180,loc.y)
        if(loc.x - 280 >PIECES[i].x && loc.x - 280<PIECES[i].x+PIECES[i].width &&
            loc.y - 40 >PIECES[i].y && loc.y - 40 <PIECES[i].y+PIECES[i].height){
                return PIECES[i]
            }
    }
    return null
}

addEventListeners()



const updateCanvas = () => {
    ctx.clearRect(0,0,CANVAS.width,CANVAS.height)
    
    ctx.globalAlpha=0.1
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
        this.xCorrect=this.x
        this.yCorrect=this.y
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

    isClose(){
        if(distance({x:this.x,y:this.y},
            {x:this.xCorrect,y:this.yCorrect}) < this.width/3){
                return true
            }
        return false
    }

    snap(){
        this.x = this.xCorrect
        this.y = this.yCorrect
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

const distance = (p1,p2) => {
    return Math.sqrt(
        (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y)
    )
}

startBtn.addEventListener('click', randomizePieces)
restartBtn.addEventListener('click', main)