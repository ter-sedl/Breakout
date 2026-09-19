import { useRef, useEffect } from "react";
import "./Breakout.css"

export default function Breakout() {

    //-----Všechny konstanty k velikosti tvarů -----
    const BALL_RADIUS: number = 15;
    const PADDLE_WIDTH: number = 140;
    const PADDLE_HEIGHT: number = 20;
    const BRICK_WIDTH: number = 60;
    const BRICK_HEIGHT: number = 40;

    let paddleX: number = 330;
    const PADDLE_SPEED: number = 6; // o kolik se má pálka posunout

    // vytvoření canvas ref, přes který se pak dostaneme k canvasRef.current, 
    // přes kterou se dostanem k Canvas API
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current; // dostaneme skutečný <canvas> element

        if (!canvas) return; //ukončit, kdyby canvas z nějakého důvodu neexistoval

        const ctx = canvas.getContext("2d"); // získáme 2D kreslicí kontext

        if (!ctx) return; // ukončit, kdyby se kontext nepodařilo získat, kvůli TS narrowiungu do fncí zbytežné a potřeba znova definovat


        //-----Stav hry: údaje o polohách a kresbách jednotlivých prvků hry-----

        function drawBrick(ctx: CanvasRenderingContext2D) {
            const gradient = ctx.createLinearGradient(100, 100, 200, 130);
            gradient.addColorStop(0, "#7bd6eb");
            gradient.addColorStop(1, "#88f97c");

            ctx.save(); //uloží aktuální nastavení ctx
            ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.roundRect(20, 20, BRICK_WIDTH, BRICK_HEIGHT, 8);
            ctx.fill();
            ctx.restore(); // vrátí se k naposledy uloženému nastavené ctx
        }

        function drawBall(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.fillStyle = "grey";

            ctx.beginPath();
            ctx.arc(
                400,              // x
                300,              // y
                BALL_RADIUS,               // radius
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
                paddleX,  // x
                570,  // y
                PADDLE_WIDTH,  // width
                PADDLE_HEIGHT,    // height
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

            paddleX = Math.max( // rozmezí x souřadnice může být jen v rozmezí šířky, ať zastaví o stěnu
                0,
                Math.min(
                    mouseX - PADDLE_WIDTH / 2,
                    canvas.width - PADDLE_WIDTH
                )
            );
        })

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);




        // -----Vše co mení Stav hry -----
        function update() {

            // pohyb pálkou pomocí šipek
            if (keys.ArrowLeft) {
                paddleX -= PADDLE_SPEED;
            }

            if (keys.ArrowRight) {
                paddleX += PADDLE_SPEED;
            }
            paddleX = Math.max(
                0,
                Math.min(paddleX, canvas!.width - PADDLE_WIDTH)
            );
        }

        // -----Vykreslení aktuálního Stavu hry-----
        function draw(ctx: CanvasRenderingContext2D) {
            // Vyčistí canvas před každým vykreslením 
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            drawBrick(ctx);
            drawBall(ctx);
            drawPaddle(ctx);
        }

        // -----hlavní animační funkce-----
        function gameLoop() { 
            update();
            draw(ctx!);
            requestAnimationFrame(gameLoop);
        } gameLoop();
        // TODO: později přidat cleanup pro requestAnimationFrame

    }, []);

    return (
        <div className="breakout">
            <h1>Breakout</h1>
            <h2>Destroy all the bricks!</h2>

            {/* v budoucnu si dát si pozor na canvas.width vs canvas.clinetWidth */}
            <canvas ref={canvasRef} width={800}
                height={600} />

            <button>Start game</button>
        </div>
    );
}