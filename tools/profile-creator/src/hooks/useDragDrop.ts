import { useState, useEffect, useRef } from 'preact/hooks';

export function useDragDrop(onDrop: (file: File) => void): boolean {
  const [isDragOver, setIsDragOver] = useState(false);
  const onDropRef = useRef(onDrop);

  useEffect(() => {
    onDropRef.current = onDrop;
  });

  useEffect(() => {
    let counter = 0;

    const onDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        counter++;
        setIsDragOver(true);
      }
    };

    const onDragLeave = () => {
      counter = Math.max(0, counter - 1);
      if (counter === 0) setIsDragOver(false);
    };

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };

    const onDropHandler = (e: DragEvent) => {
      e.preventDefault();
      counter = 0;
      setIsDragOver(false);
      const file = e.dataTransfer?.files[0];
      if (file) onDropRef.current(file);
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDropHandler);

    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDropHandler);
    };
  }, []);

  return isDragOver;
}
