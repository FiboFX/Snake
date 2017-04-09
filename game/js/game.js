var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', {preload: preload, create: create, update: update});

var segments = new Array();
var cherry;
var cursors;
var direction = 'right';
var changeDirection;
var infoText;

var timer;

var isGameOver = false;
var isPause = false;
var isStart = false;
var timePause = 0;
var score = 0;

function preload()
{
    game.load.image('body', '../game/assets/Body.png');
    game.load.image('cherry', '../game/assets/Cherry.png');
}

function create()
{
    cursors = game.input.keyboard.createCursorKeys();
    timer = game.time.create(false);
    timer.loop(1000, subTime, this);
    timer.start();

    segments.push(game.add.sprite(60, 80, 'body'));
    segments.push(game.add.sprite(40, 80, 'body'));
    segments.push(game.add.sprite(20, 80, 'body'));

    cherry = game.add.sprite(-20, -20, 'cherry');
    generateCherryPosition();

    game.time.events.loop(Phaser.Timer.SECOND / 10, moveSnake, this);

    infoText = game.add.text(26, 26, '', {fontSize: '62px', fill: '#FFF'});
}

function update()
{
    if(cursors.left.isDown)
        changeDirection = 'left';
    else if(cursors.right.isDown)
        changeDirection = 'right';
    else if(cursors.up.isDown)
        changeDirection = 'up';
    else if(cursors.down.isDown)
        changeDirection = 'down';
    
    if(game.input.keyboard.isDown(Phaser.Keyboard.P) && timePause <= 0)
    {
        isPause = !isPause;
        timePause = 2;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && isStart == false)
    {
        isStart = true;
    }
}

function moveSnake()
{
    if(isStart)
    {
        if(!isGameOver)
        {
            if(!isPause)
            {
                infoText.text = '';

                if(changeDirection == 'left' && direction != 'right')
                    direction = changeDirection;
                else if(changeDirection == 'right' && direction != 'left')
                    direction = changeDirection;
                else if(changeDirection == 'up' && direction != 'down')
                    direction = changeDirection;
                else if(changeDirection == 'down' && direction != 'up')
                    direction = changeDirection;

                var headX = segments[0].x;
                var headY = segments[0].y;

                if(direction == 'left')
                    segments[0].x -= 20;
                else if(direction == 'right')
                    segments[0].x += 20;
                else if(direction == 'up')
                    segments[0].y -= 20;
                else if(direction == 'down')
                    segments[0].y += 20;

                segments[segments.length-1].destroy();
                segments.pop();
                segments.splice(1, 0, game.add.sprite(headX, headY, 'body'));
                
                isGameOver = checkIsOver();       
                isItCherry();
            }
            else
                infoText.text = 'Pause';
        }
        else
            infoText.text = 'GAME OVER!';
    }
}

function createSegment()
{
    segments.push(game.add.sprite(segments[1].x, segments[1].y, 'body'));
    score += 10;
    document.getElementById("score").innerHTML = "Score: " + score;
}

function generateCherryPosition()
{
    do
    {
        var posX = Math.floor((Math.random() * 780));
        var posY = Math.floor((Math.random() * 580));
    }while(checkCherryPosition(posX - (posX % 20), posY - (posY % 20)));

    cherry.x = posX - (posX % 20);
    cherry.y = posY - (posY % 20);
}

function checkIsOver()
{
    if(segments[0].x < 0 ||
        segments[0].y < 0 ||
        segments[0].x > 780 ||
        segments[0].y > 580)
    {
        return true;
    }
    
    for(var i = 1; i < segments.length; i++)
    {
        if(segments[0].x == segments[i].x && segments[0].y == segments[i].y)
            return true;
    }
    return false;
}

function isItCherry()
{
    if(segments[0].x == cherry.x && segments[0].y == cherry.y)
    {
        createSegment();
        generateCherryPosition();
    }
}

function checkCherryPosition(x , y)
{
    for(var i = 0; i < segments.length; i++)
    {
        if(segments[i].x == x && segments[i].y == y)
            return true;
    }
    return false;
}

function subTime()
{
    if(timePause > 0)
        timePause--;
}