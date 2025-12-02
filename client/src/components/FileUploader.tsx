import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import { VITE_SERVER_API_URL } from '../constants';
import { DocumentInfo } from '../types';

interface FileUploaderProps {
  onDocumentUploaded: (doc: DocumentInfo) => void;
}

export const FileUploader = ({ onDocumentUploaded }: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const getFileType = (file: File) => {
    const supportedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'video/mp4'];
    const supportedAudioExts = ['.mp3', '.wav', '.m4a', '.mp4'];
    
    if (supportedAudioTypes.includes(file.type) || 
        supportedAudioExts.some(ext => file.name.toLowerCase().endsWith(ext))) {
      return 'audio';
    }
    if (file.type === 'application/pdf') return 'pdf';
    return null;
  };

  const handleFile = async (file: File) => {
    const fileType = getFileType(file);
    if (!fileType) return;
    
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (fileType === 'audio' && file.size > maxSize) {
      alert('Audio file too large. Maximum size is 25MB.');
      return;
    }

    setIsLoading(true);
    const documentInfo: DocumentInfo = {
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: 'processing'
    };
    onDocumentUploaded(documentInfo);

    try {
      const formData = new FormData();
      formData.append(fileType, file);
      const endpoint = fileType === 'audio' ? '/upload-audio' : '/upload-pdf';
      await axios.post(`${VITE_SERVER_API_URL}${endpoint}`, formData);
      onDocumentUploaded({ ...documentInfo, status: 'ready' });
    } catch (error) {
      console.error(error);
      onDocumentUploaded({ ...documentInfo, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">Upload Document or Audio</h2>
      
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          dragActive || isLoading
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="w-16 h-16 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-card-foreground mb-1">
                Drop your file here or{' '}
                <label className="text-primary cursor-pointer hover:underline">
                  browse files
                  <input
                    type="file"
                    accept=".pdf,.mp3,.wav,.m4a,.mp4"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    disabled={isLoading}
                  />
                </label>
              </p>
              <p className="text-xs text-muted-foreground">Supports PDF, MP3, WAV, M4A, MP4</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};