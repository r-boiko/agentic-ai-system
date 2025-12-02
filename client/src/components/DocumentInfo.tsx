import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DocumentInfo as DocumentInfoType } from '../types';

interface DocumentInfoProps {
  document: DocumentInfoType;
}

export const DocumentInfo = ({ document }: DocumentInfoProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (document.status) {
      case 'processing':
        return 'Processing...';
      case 'ready':
        return 'Ready for chat';
      case 'error':
        return 'Processing failed';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Document Info</h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">
              {document.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.size)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Status</span>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-xs font-medium text-card-foreground">
                {getStatusText()}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Uploaded</span>
            <span className="text-xs text-card-foreground">
              {document.uploadedAt.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};