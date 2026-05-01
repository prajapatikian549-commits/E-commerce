import { useState, useEffect, useRef } from "react";

export default function useTypewriter(words, { speed = 90, deleteSpeed = 50, pause = 1800 } = {}) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    const tick = () => {
      setText((prev) => {
        if (!isDeleting) {
          const next = current.slice(0, prev.length + 1);
          if (next === current) {
            timeoutRef.current = setTimeout(() => setIsDeleting(true), pause);
            return next;
          }
          return next;
        } else {
          const next = current.slice(0, prev.length - 1);
          if (next === "") {
            setIsDeleting(false);
            setWordIndex((i) => i + 1);
          }
          return next;
        }
      });
    };

    timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeoutRef.current);
  }, [text, isDeleting, wordIndex, words, speed, deleteSpeed, pause]);

  return text;
}
