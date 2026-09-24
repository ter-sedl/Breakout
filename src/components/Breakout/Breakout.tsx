import { useRef, useEffect } from "react";
import "./Breakout.css"
import type { Brick, Ball, Paddle } from "../../types/gameTypes";
import { GAME_LAYOUTS } from "./gameLayouts";

export default function Breakout() {

    //-----Všechny proměnné a velikosti tvarů -----
    const BALL_SPEED = 5;
    const MAX_BOUNCE_ANGLE = 60;

    const PADDLE_SPEED = 7;

    const BRICK_WIDTH: number = 77;
    const BRICK_HEIGHT: number = 40;


    const ball: Ball = {
        x: 395,
        y: 552,
        radius: 16,
        velocityX: 0,
        velocityY: 0,
    };
    let angle: number = 0;


    const paddle: Paddle = {
        x: 330,
        y: 570,
        width: 140,
        height: 20,
    };

    // vytvoří array všech cihel podle layoutu (u každé dá x, y, width, height, alive)
    function createBricks(layout: number[][]): Brick[] {
        const bricks: Brick[] = [];

        const gap = 10;

        const startX = 12;
        const startY = 10;

        layout.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                if (cell === 1) {
                    bricks.push({
                        x: startX + columnIndex * (BRICK_WIDTH + gap),
                        y: startY + rowIndex * (BRICK_HEIGHT + gap),
                        width: BRICK_WIDTH,
                        height: BRICK_HEIGHT,
                        alive: true,
                    });
                }
            });
        });

        return bricks;
    }


    // vytvoření canvas ref, přes který se pak dostaneme k canvasRef.current, 
    // přes kterou se dostanem k Canvas API
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // vygeneruje počáteční úhel a rychlosti po ose x a y
    function startGame() {
        angle = Math.floor(Math.random() * -121) - 30;
        const radians = angle * (Math.PI / 180); //převede úhel na radiány kvůli sin a cos
        ball.velocityX = Math.cos(radians) * BALL_SPEED;
        ball.velocityY = Math.sin(radians) * BALL_SPEED;
    };



    useEffect(() => {

        const canvas = canvasRef.current; // dostaneme skutečný <canvas> element

        if (!canvas) return; //ukončit, kdyby canvas z nějakého důvodu neexistoval

        const ctx = canvas.getContext("2d"); // získáme 2D kreslicí kontext

        if (!ctx) return; // ukončit, kdyby se kontext nepodařilo získat, kvůli TS narrowiungu do fncí zbytežné a potřeba znova definovat


        //-----Stav hry: údaje o polohách a kresbách jednotlivých prvků hry-----
        // do const bricks uloží pole začátečních bricks podle náhodného layoutu

        const bricks = createBricks(GAME_LAYOUTS[Math.floor(Math.random() * GAME_LAYOUTS.length)]);
        console.log("create bricks", bricks);

        let animationId: number;


        // Vykreslení všech cihel podle array bricks vytvořené pomocí createBricks
        function drawBricks(ctx: CanvasRenderingContext2D) {
            const gradient = ctx.createLinearGradient(250, 250, 200, 130);
            gradient.addColorStop(0, "#7bd6eb");
            gradient.addColorStop(1, "#88f97c");

            bricks.forEach((brick) => {
                if (!brick.alive) return;

                ctx.save(); //uloží aktuální nastavení ctx
                ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.fillStyle = gradient;

                ctx.beginPath();
                ctx.roundRect(
                    brick.x,
                    brick.y,
                    brick.width,
                    brick.height,
                    8
                );

                ctx.fill();
                ctx.restore(); // vrátí se k naposledy uloženému nastavené ctx
            });
        }

        function checkBrickCollision() {
            for (const brick of bricks) {
                const ballLeft = ball.x - ball.radius;
                const ballRight = ball.x + ball.radius;
                const ballTop = ball.y - ball.radius;
                const ballBottom = ball.y + ball.radius;


                if (brick.alive === true) {
                    if (
                        ballRight > brick.x &&
                        ballLeft < brick.x + BRICK_WIDTH &&
                        ballBottom > brick.y &&
                        ballTop < brick.y + BRICK_HEIGHT
                    ) {
                        brick.alive = false;
                    };
                }
            }
        }


        function drawBall(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.fillStyle = "grey";

            ctx.beginPath();
            ctx.arc(
                ball.x,              // x
                ball.y,              // y
                ball.radius,               // radius
                0,                // začátek úhlu
                Math.PI * 2       // konec úhlu = celý kruh
            );
            ctx.fill();
            ctx.restore();
        }

        function drawPaddle(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.fillStyle = "blue";

            ctx.beginPath();
            ctx.roundRect(
                paddle.x,  // x
                paddle.y,  // y
                paddle.width,  // width
                paddle.height,    // height
                8 //radius
            );
            ctx.fill();
            ctx.restore();
        }
        // jestli je máčknutá šipka vlevo nabo vpravo
        const keys = {
            ArrowLeft: false,
            ArrowRight: false,
        };

        // Aktualizuje keys podle mačkání klávesnice
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                keys.ArrowLeft = true;
            }
            if (e.key === "ArrowRight") {
                keys.ArrowRight = true;
            }
        }
        function handleKeyUp(e: KeyboardEvent) {
            if (e.key === "ArrowLeft") {
                keys.ArrowLeft = false;
            }
            if (e.key === "ArrowRight") {
                keys.ArrowRight = false;
            }
        }



        // -----Event listenery-----
        // pointermove sleduje pohyb myši i prstu na obrazovce
        canvas.addEventListener("pointermove", (e) => {
            const scaleX = canvas.width / canvas.clientWidth;
            const mouseX = e.offsetX * scaleX;

            paddle.x = Math.max( // rozmezí x souřadnice může být jen v rozmezí šířky, ať zastaví o stěnu
                0,
                Math.min(
                    mouseX - paddle.width / 2,
                    canvas.width - paddle.width
                )
            );
        })

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);





        // -----Vše co mení Stav hry -----
        function update() {

            // pohyb pálkou pomocí šipek
            if (keys.ArrowLeft) {
                paddle.x -= PADDLE_SPEED;
            }
            if (keys.ArrowRight) {
                paddle.x += PADDLE_SPEED;
            }
            paddle.x = Math.max(
                0,
                Math.min(paddle.x, canvas!.width - paddle.width)
            );


            // pohyb míčku
            
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            
            // kolize se stěnami
            if (ball.x - ball.radius <= 0) { //odraz o levou stěnu
                ball.velocityX *= -1;
            }
            if (ball.x + ball.radius >= 800) { // odraz o pravou stěnu
                ball.velocityX *= -1;
            }
            if (ball.y - ball.radius <= 0) { // odraz horní části míčku o strop
                ball.velocityY *= -1;
            }
            if (ball.y + ball.radius >= 600) { // pád spodní části na zem
                ball.x = 395;
                ball.y = 552;
                ball.velocityX = 0;
                ball.velocityY = 0
            }
            
            checkBrickCollision();

            //kolize s pálkou, úhel odrazu podle toho, jak daleko od středu se odrazil
            if (
                ball.y + ball.radius >= paddle.y &&
                ball.x >= paddle.x &&
                ball.x <= paddle.x + paddle.width &&
                ball.velocityY > 0
            ) {
                const hitPosition =
                    ball.x - (paddle.x + paddle.width / 2);

                const normalizedHitPosition =
                    hitPosition / (paddle.width / 2);

                const angle =
                    normalizedHitPosition * MAX_BOUNCE_ANGLE;

                const radians = angle * (Math.PI / 180);

                ball.velocityX = Math.sin(radians) * BALL_SPEED;
                ball.velocityY = -Math.cos(radians) * BALL_SPEED; // - aby 0 znamenala nahoru a ne do prava
            }


        }

        // -----Vykreslení aktuálního Stavu hry-----
        function draw(ctx: CanvasRenderingContext2D) {
            // Vyčistí canvas před každým vykreslením 
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            drawBricks(ctx);
            drawBall(ctx);
            drawPaddle(ctx);
        }

        // -----hlavní animační funkce-----
        function gameLoop() {
            update();
            draw(ctx!);
            animationId = requestAnimationFrame(gameLoop);
        } 
        gameLoop();
        // TODO: později přidat cleanup pro requestAnimationFrame
        return () => {
            console.log("cleanup");
            cancelAnimationFrame(animationId);
        };

    }, []);

    return (
        <div className="breakout">
            <h1>Breakout</h1>
            <h2>Destroy all the bricks!</h2>

            {/* v budoucnu si dát si pozor na canvas.width vs canvas.clinetWidth */}
            <canvas ref={canvasRef} width={800}
                height={600} />

            <button onClick={startGame}>Start game</button>
        </div>
    );
}