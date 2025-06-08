import { useEffect, useRef } from "react";
import styles from "../styles/DynamicShapes.module.css";

const DynamicShapes = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const points = [];
    const getNumPoints = () => {
      if (window.innerWidth <= 480) return 25;
      if (window.innerWidth <= 768) return 35;
      return 55;
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

      points.forEach((point1, i) => {
        points.forEach((point2, j) => {
          if (i !== j) {
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
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

        if (point.x <= 0 || point.x >= canvas.width) point.speedX *= -1;
        if (point.y <= 0 || point.y >= canvas.height) point.speedY *= -1;
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
    <div className={styles.dynamicShapesContainer}>
      <canvas ref={canvasRef} className={styles.dynamicShapesCanvas} />
    </div>
  );
};

export default DynamicShapes;
