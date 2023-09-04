const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const h1 = document.querySelector('h1');

const audio = new Audio("assets_audio.mp3")


let dificuldade = document.querySelector('.dificuldade')
const modalInicial = document.querySelector('.deficulte')
const score = document.querySelector(".score--value")
let finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const button = document.querySelector('.btn-play')
let record = document.querySelector('.record-value')


let teste 

const size = 30

const positionInicial = { x: 270 , y:240};

let cobra = [positionInicial]

const incrementScore = ()=>{
    score.innerText = +score.innerText + 10
}

let direction,loopId

const randomNumber = (min , max) =>{
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = ()=>{
    const number = randomNumber(0,canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = ()=>{
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)

    return `rgb(${red},${green},${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

const checkColosion = ()=>{
    const head = cobra[cobra.length -1 ]
    const canvasLimit = canvas.width - size
    const neckIndex = cobra.length - 2

    const wallColidi = 
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const headColid = cobra.find((position , index)=>{
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if(wallColidi || headColid){
        gameOver()
    }
}



const gameOver = ()=>{
    direction = undefined
    menu.style.display = 'flex';
    finalScore.innerText = score.innerText
    document.removeEventListener("keydown" , moves)
    canvas.style.filter = "blur(2px)"
    
}

const armazenamento = ()=>{
    let valid = parseInt(localStorage.getItem("chave"))

    let teste = parseFloat(finalScore)

    
    if(teste == valid){
        console.log('é menor')
    }

    localStorage.setItem("chave" , finalScore.innerText)
    recordes()
}


const recordes = ()=>{
    let numeroArmazenado = localStorage.getItem("chave")
    
    if(numeroArmazenado !== null){
        record.textContent = numeroArmazenado
    }else{
        console.log('nunhem numero armazenado')
    }
}

window.onload = recordes()


const checkEat = ()=>{
    const head = cobra[cobra.length -1]

    if(head.x == food.x && head.y == food.y){
        cobra.push(head)
        audio.play()
        incrementScore()

        let x = randomPosition()
        let y = randomPosition()


        while (cobra.find((position)=> position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()

    }
}

const drawFood = ()=>{

    const { x , y , color } = food 

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x , y , size , size)
    ctx.shadowBlur = 0
}

const drawCobra = ()=>{
    ctx.fillStyle = "#ddd"
    cobra.forEach((position , index)=>{

        if(index == cobra.length -1){
            ctx.fillStyle = "blue"
        }

        ctx.fillRect(position.x , position.y , size , size )
    })
}


const moveCobra = ()=>{

    if(!direction) return

    const head = cobra[cobra.length -1]

    
    if(direction == "right"){
        cobra.push({x: head.x + size, y: head.y})
    }
    if(direction == "left"){
        cobra.push({x: head.x - size, y: head.y})
    }
    if(direction == "down"){
        cobra.push({x: head.x , y: head.y + size})
    }
    if(direction == "up"){
        cobra.push({x: head.x, y: head.y - size})
    }
    
    cobra.shift()
}

const gridGame = () =>{
    ctx.lineWidth = .2
    ctx.strokeStyle = "#80CBC4"
    
    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath()
        ctx.lineTo(i,0)
        ctx.lineTo(i,600)
        ctx.stroke()


        ctx.beginPath()
        ctx.lineTo(0,i)
        ctx.lineTo(600,i)
        ctx.stroke()

    }

}

const inicial = ()=>{
    document.removeEventListener('keydown' , moves)

    canvas.style.filter = "blur(2px)"
    
    document.querySelector('.normal')
    .addEventListener('click' , ()=>{
        teste = 150
        modalInicial.style.display = "none"
        document.addEventListener('keydown' , moves )
        canvas.style.filter = 'none'
        dificuldade.innerText = "Normal"
        dificuldade.style.color ='blue'

    })
    document.querySelector('.dificil')
    .addEventListener('click' , ()=>{
        teste = 80
        modalInicial.style.display = "none"
        document.addEventListener('keydown' , moves )
        canvas.style.filter = 'none'
        dificuldade.innerText = "Dificil"
        dificuldade.style.color ='red'
    })


}





const gameLop = ()=>{
    clearTimeout(loopId)
    ctx.clearRect(0,0,600,600)
    
    drawFood()
    moveCobra()
    drawCobra()
    gridGame()
    checkEat()
    checkColosion()
    
    
    loopId = setTimeout(()=>{
        gameLop()
    },teste)
    
}

gameLop()

const moves = ({ key }) => {

    if (key == "ArrowRight" && direction != 'left') {
        direction = "right"
    }
    if (key == "ArrowLeft" && direction != 'right') {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != 'up') {
        direction = "down"
    }
    if (key == "ArrowUp" && direction != 'down') {
        direction = "up"
    }


}

document.addEventListener('keydown' , moves )

window.onload = inicial()
button.addEventListener('click' , ()=>{
    score.innerText = "00"
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    cobra = [positionInicial]
    document.addEventListener('keydown' , moves )
    armazenamento()
})