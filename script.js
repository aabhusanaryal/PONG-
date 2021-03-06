let canvas, canvasContext, ballX, ballY, ballSpeedX, ballSpeedY, paddle1Y, singleMode;
ballX = 400;
ballY = 50;
ballSpeedX = 12;
ballSpeedY = 6;
paddle1Y = 150;
paddle2Y = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 12;

let player1Score = 0;
let player2Score = 0;
let ballColor = "white";

let multiPlayer = false;
let soundOn = false;

const audio = new Audio('./out.wav');

const drawNet = () => {
    for(let i = 0; i<canvas.height; i+=30){
        canvasContext.fillStyle = 'white';
        canvasContext.fillRect(canvas.width/2-1, i+5, 2, 20);
    }
}

const drawEverything = () =>{
    //Background
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.clientWidth, canvas.height);
    //Paddle1
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(2, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    //Paddle2
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(canvas.width - PADDLE_WIDTH - 2, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    //Separator
    drawNet();
    //Ball
    colorCircle(ballX, ballY, BALL_RADIUS, ballColor)
    //Score
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(`SCORE: ${player1Score}`, 100, 100)
    canvasContext.fillText(`SCORE: ${player2Score}`, canvas.width-150, 100)
}

const randomColor = () => {
    r = Math.random() * 100 + 100;
    g = Math.random() * 200 + 50;
    b = Math.random() * 256;

    return `rgb(${r}, ${g}, ${b})`
}

const gameModeToggle = () => {
    singleMode = document.querySelector('#single').checked
    multiPlayer = !singleMode
}

const playSound = () => {
    soundOn = document.querySelector('#playSound').checked
}

const colorCircle = (centerX, centerY, radius, color) =>{
    //Ball
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

const computerMove = () =>{
    if(paddle2Y > ballY - 60){
        paddle2Y -= 5;
    }
    else if(paddle2Y < ballY + 60){
        paddle2Y += 5;
    }
}

const moveEverything = () => {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(!multiPlayer){
        computerMove();
    }
    //Ball strikes the left side
    if(ballX <  BALL_RADIUS + 5){
        //If it hits paddle
        if(ballY > paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
        }
        // If it hits empty void null space
        else{
            player2Score++;
            ballReset();
        }
    }
    //Ball strikes the right side
    if(ballX > canvas.width - BALL_RADIUS - 2){
        //If it hits paddle
        if(ballY > paddle2Y && ballY <= paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.3;
        }
        // If it hits empty void null space
        else{
            player1Score++;
            ballReset();
        }
    }
    //Ball strikes the top or bottom side
    if(ballY > canvas.height - BALL_RADIUS || ballY < BALL_RADIUS){
        ballSpeedY = -ballSpeedY;
    }
}

const calculateMousePos = evt => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y:mouseY
    }
}

const ballReset = () =>{
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballColor = randomColor();
    if(soundOn) audio.play()

    if(player1Score >=4 || player2Score >= 4){
        ballSpeedX = 15;
        ballSpeedY = 8;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
       

    let fps = 30;
    setInterval(()=>{
        drawEverything();
        moveEverything();
    }, 1000/fps)

    canvas.addEventListener('mousemove', evt =>{
        mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - PADDLE_HEIGHT/2
    })
    // Multiplayer Control
    document.addEventListener('keydown', evt => {
        if(multiPlayer){
            keyPressed = evt.key.toLowerCase();
            console.log(keyPressed)
            if(keyPressed == "w"){
                if(paddle2Y >= 0) paddle2Y -= 30;
            }
            else if(keyPressed == "s"){
                if(paddle2Y <= canvas.height - PADDLE_HEIGHT) paddle2Y += 30;
            }
        }
    })
}