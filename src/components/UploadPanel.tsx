import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { globalAssetImporter } from '../engine/import/AssetImporter';
import { LibraryAsset } from '../engine/assets/AssetMetadata';

interface UploadPanelProps {
  onUploadSuccess: (asset: LibraryAsset) => void;
  activeFolder?: string;
}

export function UploadPanel({ onUploadSuccess, activeFolder = '/Root' }: UploadPanelProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeFileName, setActiveFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startDummyProgress = (callback: () => void) => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(callback, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 80);
  };

  const handleFileProcess = async (file: File) => {
    try {
      setUploadState('UPLOADING');
      setActiveFileName(file.name);
      
      startDummyProgress(async () => {
        try {
          const imported = await globalAssetImporter.importFile(file, activeFolder);
          setUploadState('SUCCESS');
          onUploadSuccess(imported);
          setTimeout(() => {
            setUploadState('IDLE');
            setActiveFileName('');
          }, 2500);
        } catch (e: any) {
          setErrorMsg(e.toString() || 'Compilation constraints failed');
          setUploadState('ERROR');
        }
      });
    } catch (err: any) {
      setErrorMsg(err.toString() || 'Unknown upload exception');
      setUploadState('ERROR');
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div id="upload_panel_root" className="bg-neutral-900/60 p-4 rounded-lg border border-neutral-800/80">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-neutral-400 tracking-wider uppercase">Upload Brand Material</h4>
        <span className="text-[9px] font-mono text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-850">
          Target: {activeFolder}
        </span>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition text-center select-none ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 text-neutral-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".png,.jpeg,.jpg,.webp,.gif,.svg,.pdf,.ttf,.otf,.json"
          onChange={handleInputFile}
        />

        {uploadState === 'IDLE' && (
          <>
            <Upload size={24} className="mb-2 text-indigo-400 animate-pulse" />
            <p className="text-[11px] font-medium text-neutral-300">Drag & drop asset here, or click to browse</p>
            <p className="text-[9px] text-neutral-500 font-mono mt-1">PNG, SVG, JPG, WEBP, GIF, PDF, TTF, OTF, JSON</p>
          </>
        )}

        {uploadState === 'UPLOADING' && (
          <div className="w-full flex flex-col items-center">
            <RefreshCw size={18} className="animate-spin text-indigo-400 mb-2" />
            <p className="text-[10px] font-mono text-neutral-300 truncate max-w-xs">{activeFileName}</p>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-2 overflow-hidden border border-neutral-850">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-neutral-500 mt-1">{progress}% Ingesting...</span>
          </div>
        )}

        {uploadState === 'SUCCESS' && (
          <div className="text-center">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
            <p className="text-[11px] font-medium text-emerald-400">Import Complete</p>
            <p className="text-[9px] text-neutral-500 font-mono truncate max-w-xs mt-0.5">{activeFileName}</p>
          </div>
        )}

        {uploadState === 'ERROR' && (
          <div className="text-center">
            <AlertCircle size={24} className="text-rose-500 mx-auto mb-2" />
            <p className="text-[11px] font-medium text-rose-400">Import Blocked</p>
            <p className="text-[9px] text-neutral-500 font-mono truncate max-w-xs mt-0.5">{errorMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
