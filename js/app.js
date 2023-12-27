const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio('../assets/audio.mp3');

//tamanho dos quadrados
const size = 30;

//Posição inicial da Cobra
const initialPosition = { x: 270, y: 240};

let snake = [initialPosition];

//Adicionar Score 
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

//Numero aleatorio 
const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

//Posição Aleatoria 
const randomPosition = (min, max) => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
};

//Cor Aleatoria 
const randomColor = () => {
    const red = randomNumber(0,255)
    const green = randomNumber(0,255)
    const blue = randomNumber(0,255)
    
    return `rgb(${red}, ${green}, ${blue})`
}


//Comida 
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

//Desenhar Comida 
const drawfood = () => {

    const {x, y, color} = food

    ctx.shadowColor = color;
    ctx.shadowBlur = 15 ;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0 ;

}

//Direção de Movimento da Cobra
let direction, loopId

//Desenhar a Cobra 
const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if (index == snake.length - 1){
            ctx.fillStyle = "blue"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

//Mover a Cobra
const moveSnake = () => {
    if (! direction) return

    const head = snake[snake.length - 1]

    //Direita
    if (direction == "right"){
        snake.push({ x: head.x + size, y: head.y})
    }
    //Esquerda
    if (direction == "Left"){
        snake.push({ x: head.x - size, y: head.y})
    }
    //Baixa
    if (direction == "down"){
        snake.push({ x: head.x, y: head.y + size})
    }
    //Acima
    if (direction == "up"){
        snake.push({ x: head.x, y: head.y - size})
    }

    snake.shift()
}

// Desenhar uma grade no canvas
const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }


}

//Checar se a cobrinha comeu a comida
const chackEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

//Rodar o Jogo
const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid();
    drawfood();
    moveSnake();
    drawSnake();
    chackEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop()
    }, 300)
}

// Game Over (perder o jogo) 
const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallColission = 
        head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfColission = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallColission || selfColission) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(4px)"
}

gameLoop()


//Ativar Movimento pelas teclas
document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "Left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "right") {
        direction = "Left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }

}) 

//Restart 
buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})

