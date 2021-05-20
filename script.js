let canvas, canvasContext, ballX, ballY, ballSpeedX, ballSpeedY, paddle1Y;
ballX = 400;
ballY = 50;
ballSpeedX = 12;
ballSpeedY = 6;
paddle1Y = 150;
paddle2Y = 100;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 12;

let player1Score = 0;
let player2Score = 0;


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
    //Ball
    colorCircle(ballX, ballY, BALL_RADIUS, 'white')
    //Score
    canvasContext.fillText(`SCORE: ${player1Score}`, 100, 100)
    canvasContext.fillText(`SCORE: ${player2Score}`, 600, 100)
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
    computerMove();
    //Ball strikes the left side
    if(ballX <  BALL_RADIUS + 5){
        if(ballY > paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
        }
        else{
            player2Score++;
            ballReset();
        }
    }
    //Ball strikes the right side
    if(ballX > canvas.width - BALL_RADIUS - 2){
        if(ballY > paddle2Y && ballY <= paddle2Y + PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
        }
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
    console.log(mouseX, mouseY)
    return {
        x: mouseX,
        y:mouseY
    }
}

const ballReset = () =>{
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
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
}