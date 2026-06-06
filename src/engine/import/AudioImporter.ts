export interface AudioImportResult {
  durationSec: number;
  sampleRate: number;
  channelsCount: number;
  format: 'MP3' | 'WAV' | 'OGG' | 'AAC';
}

export class AudioImporter {
  /**
   * Assesses transitions sound assets properties.
   */
  public async importAudio(fileName: string, fileSize: number): Promise<AudioImportResult> {
    const isWav = fileName.endsWith('.wav');
    return {
      durationSec: 3.5,
      sampleRate: 44100,
      channelsCount: 2,
      format: isWav ? 'WAV' : 'MP3'
    };
  }
}

export const globalAudioImporter = new AudioImporter();
