import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

export default function CSVUploadComponent() {
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // simulate API call
    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#ffffff] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group
              ${isDragging
                ? 'border-green-400 bg-green-100'
                : file
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50'
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
                  ${isDragging ? 'bg-green-200' : 'bg-teal-100 group-hover:bg-teal-200'}`}>
                  <Upload className={`w-8 h-8 transition-colors duration-300 
                    ${isDragging ? 'text-green-500' : 'text-teal-500 group-hover:text-teal-600'}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {isDragging ? 'Drop your CSV file here' : 'Upload CSV File'}
                </h3>
                <p className="text-slate-500 text-sm">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  Only CSV files are supported
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                  <File className="w-8 h-8 text-teal-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 truncate">
                    {file.name}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
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
            className={`w-full rounded-[1.15rem] px-8 py-4 text-lg font-semibold transition-all duration-300 border border-slate-200
              ${!file || isSubmitting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isSubmitted
                ? 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white'
                : 'bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg hover:-translate-y-0.5'
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
          <p className="text-slate-500 text-sm">
            Upload your CSV file to process and analyze your data
          </p>
        </div>
      </div>
    </div>
  );
}