import { useRef } from 'preact/hooks';

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}
interface OpenFilePickerOptions { types?: FilePickerAcceptType[]; excludeAcceptAllOption?: boolean; multiple?: boolean; }
interface SaveFilePickerOptions { suggestedName?: string; types?: FilePickerAcceptType[]; excludeAcceptAllOption?: boolean; }

declare global {
  interface Window {
    showOpenFilePicker?: (opts?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker?: (opts?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}

export interface FileSystemHook {
  openFile: () => Promise<{ text: string; fileName: string } | null>;
  saveFile: (json: string) => Promise<string | null>;
  saveAs: (json: string) => Promise<string | null>;
  clearHandle: () => void;
  supportsFS: boolean;
}

export function useFileSystem(): FileSystemHook {
  const handleRef = useRef<FileSystemFileHandle | undefined>(undefined);
  const supportsFS = 'showOpenFilePicker' in window;

  const clearHandle = () => {
    handleRef.current = undefined;
  };

  const openFile = async (): Promise<{ text: string; fileName: string } | null> => {
    if (supportsFS) {
      try {
        const [handle] = await window.showOpenFilePicker!({
          types: [{ description: 'JSON files', accept: { 'application/json': ['.json'] } }],
          excludeAcceptAllOption: true,
        });
        handleRef.current = handle;
        const file = await handle.getFile();
        return { text: await file.text(), fileName: file.name };
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return null;
        throw e;
      }
    }
    return openWithInput();
  };

  const saveFile = async (json: string): Promise<string | null> => {
    if (handleRef.current) {
      const writable = await handleRef.current.createWritable();
      await writable.write(json);
      await writable.close();
      return handleRef.current.name;
    }
    return saveAs(json);
  };

  const saveAs = async (json: string): Promise<string | null> => {
    if (supportsFS) {
      try {
        const handle = await window.showSaveFilePicker!({
          suggestedName: 'index.json',
          types: [{ description: 'JSON files', accept: { 'application/json': ['.json'] } }],
        });
        handleRef.current = handle;
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        return handle.name;
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return null;
        throw e;
      }
    }
    downloadFallback(json);
    return 'index.json';
  };

  return { openFile, saveFile, saveAs, clearHandle, supportsFS };
}

function openWithInput(): Promise<{ text: string; fileName: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      resolve({ text: await file.text(), fileName: file.name });
    };
    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

function downloadFallback(json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
