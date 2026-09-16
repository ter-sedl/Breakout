import { useRef } from "react";
import "./Breakout.css"

export default function Breakout() {
    // vytvoření canvas ref, přes který se pak dostaneme k canvasRef.current, 
    // přes kterou se dostanem k Canvas API
    const canvasRef = useRef<HTMLCanvasElement>(null);


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