import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import loading from "../assets/loading.webp";

interface Position {
  x: number;
  y: number;
}

interface ApiResponse {
  results: Result[];
}

interface Result {
  anime_name: string;
  url: string;
  dimensions: Dimensions;
}

interface Dimensions {
  width: number;
  height: number;
}

const FollowMouse: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [cursorImage, setCursorImage] = useState<string>(loading);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      setPosition({ x: clientX, y: clientY });
    };

    if (enabled) {
      window.addEventListener("pointermove", handleMove);
    }

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [enabled]);

  useEffect(() => {
    document.body.classList.toggle("no-cursor", enabled);

    const fetchNewImage = async () => {
      if (enabled) {
        try {
          setCursorImage(loading);

          const res = await fetch("https://nekos.best/api/v2/smile");

          const data: ApiResponse = await res.json();

          // Tomamos la primera imagen del array
          setCursorImage(data.results[0].url);
        } catch (error) {
          console.error("Error fetching cursor image:", error);
        }
      }
    };

    fetchNewImage();

    return () => {
      document.body.classList.remove("no-cursor");
    };
  }, [enabled]);

  return (
    <>
      {enabled && (
        <div
          id="custom-cursor"
          style={{
            position: "fixed",
            backgroundImage: `url(${cursorImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "50%",
            opacity: 0.8,
            pointerEvents: "none",
            left: 0,
            top: 0,
            width: 50,
            height: 50,
            zIndex: 9999,
            transform: `translate(${position.x + 10}px, ${position.y + 10}px)`,
          }}
        />
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setEnabled(!enabled)}
        className="border-none"
      >
        {enabled ? "Desactivar" : "Activar"} seguimiento
      </motion.button>
    </>
  );
};

export default FollowMouse;