import { ExportType, RenderSettings } from './RenderSettings';

export interface EncodedOutput {
  exportType: ExportType;
  fileName: string;
  blobUrl: string | null;
  fileSizeEstimateBytes: number;
  dataBase64?: string;
  metadata: {
    resolution: string;
    totalFrames: number;
    encodedAt: number;
    hashSignature: string;
  };
}

export class Encoder {
  private preallocatedFrameBuffer: Uint8ClampedArray | null = null;

  /**
   * Initialize a preallocated buffer to ensure zero memory allocation spikes in render loop!
   */
  initializeBuffer(width: number, height: number) {
    const size = width * height * 4; // RGBA channels
    if (!this.preallocatedFrameBuffer || this.preallocatedFrameBuffer.length < size) {
      this.preallocatedFrameBuffer = new Uint8ClampedArray(size);
    }
  }

  /**
   * Writes frame pixel bytes in zero-allocation approach.
   */
  writeFrameToBuffer(pixels: Uint8ClampedArray) {
    if (this.preallocatedFrameBuffer && this.preallocatedFrameBuffer.length === pixels.length) {
      this.preallocatedFrameBuffer.set(pixels);
    }
  }

  /**
   * Finalizes the compilation sequence and encodes into targeted format.
   */
  encode(
    framesRaw: number,
    settings: RenderSettings,
    projectName: string
  ): EncodedOutput {
    const width = settings.resolutionPreset === 'Custom' ? settings.customWidth : 1920; 
    const height = settings.resolutionPreset === 'Custom' ? settings.customHeight : 1080;
    
    // Simulate compilation hashes
    const signature = `mOS_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const timestamp = Date.now();
    const cleanProjectName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    let extension = 'mp4';
    let bytesFactor = 152000; // Average bytes per frame for high compression video
    
    switch (settings.exportType) {
      case ExportType.PNG_SEQUENCE:
        extension = 'zip';
        bytesFactor = 750000;
        break;
      case ExportType.JPEG_SEQUENCE:
        extension = 'tar';
        bytesFactor = 280000;
        break;
      case ExportType.GIF:
        extension = 'gif';
        bytesFactor = 420000;
        break;
      case ExportType.WEBM:
        extension = 'webm';
        bytesFactor = 95000;
        break;
      case ExportType.MOTION_DNA_JSON:
        extension = 'motiondna.json';
        bytesFactor = 450;
        break;
      case ExportType.PROJECT_JSON:
        extension = 'project.json';
        bytesFactor = 1500;
        break;
      default:
        extension = 'mp4';
        bytesFactor = 152000;
    }

    const totalFrames = Math.max(1, settings.endFrame - settings.startFrame);
    const estimatedSize = totalFrames * bytesFactor;

    // Simulate dummy blob downloadable asset
    let blobUrl: string | null = null;
    let dataStr = '';
    
    if (settings.exportType === ExportType.MOTION_DNA_JSON) {
      const mockDNA = {
        meta: { generator: "MotionOS DNA Compiler", version: "1.0.0", signature, timestamp },
        dna: { style: "LUXURY", pacing: "cinematic", transitions: ["FADE", "LIGHT_FLASH"], optimizationScore: 94 }
      };
      dataStr = JSON.stringify(mockDNA, null, 2);
    } else if (settings.exportType === ExportType.PROJECT_JSON) {
      const mockProject = {
        meta: { generator: "MotionOS Project Database", signature, timestamp },
        project: { id: "p001", name: projectName, lastSaved: timestamp, version: "Milestone 15" }
      };
      dataStr = JSON.stringify(mockProject, null, 2);
    } else {
      dataStr = `MotionOS Visual Stream: [${width}x${height}] @ ${settings.fps}FPS. Total compiled frames: ${totalFrames}. Signature: ${signature}. Encoded successfully.`;
    }

    try {
      const blob = new Blob([dataStr], { type: 'application/octet-stream' });
      blobUrl = URL.createObjectURL(blob);
    } catch (e) {
      console.warn("Could not create object URL in background environment:", e);
    }

    return {
      exportType: settings.exportType,
      fileName: `${cleanProjectName}_render_${timestamp}.${extension}`,
      blobUrl,
      fileSizeEstimateBytes: estimatedSize,
      dataBase64: window.btoa ? window.btoa(dataStr.substring(0, 1000)) : undefined,
      metadata: {
        resolution: `${width}x${height}`,
        totalFrames,
        encodedAt: timestamp,
        hashSignature: signature
      }
    };
  }
}
