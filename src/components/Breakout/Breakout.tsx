import { useRef, useEffect } from "react";
import "./Breakout.css"

export default function Breakout() {
    // vytvoření canvas ref, přes který se pak dostaneme k canvasRef.current, 
    // přes kterou se dostanem k Canvas API
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current; // dostaneme skutečný <canvas> element
        
        if (!canvas) return; //ukončit, kdyby canvas z nějakého důvodu neexistoval

        const ctx = canvas.getContext("2d"); // získáme 2D kreslicí kontext

        if (!ctx) return; // ukončit, kdyby se kontext nepodařilo získat

        const gradient = ctx.createLinearGradient(100, 100, 200, 130);
        gradient.addColorStop(0, "#7bd6eb");
        gradient.addColorStop(1, "#88f97c");

        
        // 1. Brick cihla
        ctx.save(); //uloží aktuální nastavení ctx
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.roundRect(20, 20, 60, 40, 8);
        ctx.fill();
        ctx.restore(); // vrátí se k naposledy uloženému nastavené ctx
 // 2. Ball míček
        ctx.save();
        ctx.fillStyle = "grey";
       
        ctx.beginPath();
        ctx.arc(
            400,              // x
            300,              // y
            15,               // radius
            0,                // začátek úhlu
            Math.PI * 2       // konec úhlu = celý kruh
        );
        ctx.fill();
        ctx.restore();
        
        // 3. Paddle pálka
        ctx.save();
        ctx.fillStyle = "blue";

        ctx.beginPath();
        ctx.roundRect(
            350,  // x
            570,  // y
            140,  // width
            20,    // height
            8 //radius
        );
        ctx.fill();
        ctx.restore();

        // POZDĚJI SEM PŘIJDE GAME LOOP

        // function gameLoop() {
        //     ...
        //     requestAnimationFrame(gameLoop);
        // }

        // gameLoop();

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