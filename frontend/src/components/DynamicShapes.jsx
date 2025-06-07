import { useEffect, useRef } from "react";
import "../styles/DynamicShapes.css";

const DynamicShapes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const points = [];
    const getNumPoints = () => {
      if (window.innerWidth <= 480) {
        return 25;
      } else if (window.innerWidth <= 768) {
        return 35;
      } else {
        return 55;
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initializePoints = (numPoints) => {
      const newPoints = [];
      for (let i = 0; i < numPoints; i++) {
        newPoints.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
        });
      }
      return newPoints;
    };

    const drawLines = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(173, 216, 230, 0.7)";
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.shadowColor = "rgba(205, 186, 186, 0.5)";
      ctx.shadowBlur = 5;

      points.forEach((point1, index1) => {
        points.forEach((point2, index2) => {
          if (index1 !== index2) {
            const distance = Math.sqrt(
              Math.pow(point1.x - point2.x, 2) +
              Math.pow(point1.y - point2.y, 2)
            );
            if (distance < 160) {
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);
            }
          }
        });
      });

      ctx.stroke();
    };

    const updatePoints = () => {
      points.forEach((point) => {
        point.x += point.speedX;
        point.y += point.speedY;

        if (point.x <= 0 || point.x >= canvas.width) {
          point.speedX *= -1;
        }
        if (point.y <= 0 || point.y >= canvas.height) {
          point.speedY *= -1;
        }
      });
    };

    const animate = () => {
      updatePoints();
      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      resizeCanvas();
      points.length = 0;
      points.push(...initializePoints(getNumPoints()));
    };

    resizeCanvas();
    points.push(...initializePoints(getNumPoints()));
    animate();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="dynamic-shapes-container">
      <canvas ref={canvasRef} className="dynamic-shapes-canvas" />
    </div>
  );
};

export default DynamicShapes;