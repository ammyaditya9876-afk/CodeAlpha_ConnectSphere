import { useEffect, useRef, useState } from 'react';

interface WhiteboardProps {
  socket: any;
  roomId: string;
}

export default function Whiteboard({ socket, roomId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    socket.on('draw-data', (data: any) => {
      const { x0, y0, x1, y1, color, size } = data;
      ctx.beginPath();
      ctx.moveTo(x0 * canvas.width, y0 * canvas.height);
      ctx.lineTo(x1 * canvas.width, y1 * canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.stroke();
      ctx.closePath();
    });

    socket.on('clear-canvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      socket.off('draw-data');
      socket.off('clear-canvas');
    };
  }, [socket]);

  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (lastPos.current) {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
      ctx.closePath();

      socket.emit('draw-data', roomId, {
        x0: lastPos.current.x / canvas.width,
        y0: lastPos.current.y / canvas.height,
        x1: x / canvas.width,
        y1: y / canvas.height,
        color,
        size: brushSize,
      });
    }

    lastPos.current = { x, y };
  };

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas', roomId);
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-900 rounded-2xl overflow-hidden relative border border-zinc-800">
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-zinc-800/80 p-2 rounded-lg backdrop-blur-md z-10">
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
        />
        <input 
          type="range" 
          min="1" max="20" 
          value={brushSize} 
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-24"
        />
        <button 
          onClick={clearCanvas}
          className="ml-2 px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 w-full h-full">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none cursor-crosshair"
        />
      </div>
    </div>
  );
}
