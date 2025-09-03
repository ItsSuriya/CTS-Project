import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

export default function CSVUploadComponent({ onPrediction }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const csvFile = droppedFiles.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      setFile(csvFile);
      setIsSubmitted(false);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
      setIsSubmitted(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setIsSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.predictions) {
          onPrediction(data.predictions);
        }
        setIsSubmitted(true);
      } else {
        console.error('Error submitting file');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group
              ${isDragging 
                ? 'border-pink-500 bg-pink-500/10' 
                : file 
                ? 'border-purple-500 bg-purple-500/5' 
                : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!file ? (
              <>
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
                  ${isDragging ? 'bg-pink-500/20' : 'bg-purple-500/20 group-hover:bg-purple-500/30'}`}>
                  <Upload className={`w-8 h-8 transition-colors duration-300 
                    ${isDragging ? 'text-pink-400' : 'text-purple-400 group-hover:text-purple-300'}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDragging ? 'Drop your CSV file here' : 'Upload CSV File'}
                </h3>
                <p className="text-gray-400 text-sm">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Only CSV files are supported
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <File className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!file || isSubmitting}
            className={`w-full rounded-[1.15rem] px-8 py-4 text-lg font-semibold backdrop-blur-md transition-all duration-300 border border-white/10
              ${!file || isSubmitting
                ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                : isSubmitted
                ? 'bg-green-500/90 hover:bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 hover:from-purple-500 hover:to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : isSubmitted ? (
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-5 h-5" />
                Submitted Successfully!
              </div>
            ) : (
              'Submit CSV File'
            )}
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Upload your CSV file to process and analyze your data
          </p>
        </div>
      </div>
    </div>
  );
}