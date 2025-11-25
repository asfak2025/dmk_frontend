"use client";
import React, { useState, useRef } from 'react';
import { Upload, X, FileAudio, Loader2, Phone, TrendingUp, MessageSquare, User, BarChart3, Languages, Award, AlertCircle, FileText, Volume2, Users, Zap, ThumbsUp, ThumbsDown, Clock, Target } from 'lucide-react';

const CallSummaryDisplay = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [audioDuration, setAudioDuration] = useState(null);
  console.log("Audio Duration:", audioDuration);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

   const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const extractAudioDuration = (file) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        URL.revokeObjectURL(url);
        resolve(duration);
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve(0); // Return 0 if there's an error
      });
      
      audio.src = url;
    });
  };

  // const handleFileSelect = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file && file.type.startsWith('audio/')) {
  //     const url = URL.createObjectURL(file);
  //     setAudioFile({
  //       file,
  //       url,
  //       name: file.name,
  //       size: formatFileSize(file.size)
  //     });
  //     setSummaryData(null);
  //   }
  // };
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      
      // Extract audio duration
      const duration = await extractAudioDuration(file);
      const durationInMinutes = (Number(duration) / 60).toFixed(2);
      
      setAudioFile({
        file,
        url,
        name: file.name,
        size: formatFileSize(file.size)
      });
      
      setAudioDuration({
        seconds: duration,
        formatted: formatDuration(duration),
        minutes: durationInMinutes
      });
      
      setSummaryData(null);
    }
  };

  const handleRemoveFile = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.url);
      setAudioFile(null);
      setSummaryData(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files[0];
  //   if (file && file.type.startsWith('audio/')) {
  //     const url = URL.createObjectURL(file);
  //     setAudioFile({
  //       file,
  //       url,
  //       name: file.name,
  //       size: formatFileSize(file.size)
  //     });
  //     setSummaryData(null);
  //   }
  // };
  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      
      // Extract audio duration
      const duration = await extractAudioDuration(file);
      const durationInMinutes = (Number(duration) / 60).toFixed(2);
      
      setAudioFile({
        file,
        url,
        name: file.name,
        size: formatFileSize(file.size)
      });
      
      setAudioDuration({
        seconds: duration,
        formatted: formatDuration(duration),
        minutes: durationInMinutes
      });
      
      setSummaryData(null);
    }
  };

  const handleGenerate = async () => {
    if (!audioFile) return;
    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioFile.file);

      const res = await fetch('/nextApi/api/summary', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setSummaryData(data);
      } else {
        console.error('Error: ' + data.message);
        setSummaryData(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setSummaryData(null);
    } finally {
      setIsGenerating(false);
    }
  };
  const statsData = {
    interest: "Interested",
    callDuration: "12:45",
    speakingTime: "08:23",
    silencePercentage: "15%",
    talkToListenRatio: "1.8:1",
    interruptionRate: "12%",
    customerSatisfaction: "85%",
    resolutionRate: "92%"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Call Summary Generator</h1>
          <p className="text-gray-500 text-xs">AI-powered call analysis and transcription</p>
        </div>

        {/* Compact Upload Area */}
        <div className="mb-4">
          {!audioFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-300 group"
            >
              <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
              <p className="text-sm font-semibold text-gray-700 mb-1">Upload Audio File</p>
              <p className="text-xs text-gray-500">
                MP3, WAV, M4A, OGG • Max 50MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileAudio className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate text-gray-800">{audioFile.name}</p>
                    <p className="text-xs text-gray-500">{audioFile.size}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <audio controls src={audioFile.url} className="w-full h-8" />
            </div>
          )}
        </div>

        {/* Generate Button */}
        {audioFile && !summaryData && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-gray-900 hover:to-black transition-all duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Call...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                Generate Summary
              </>
            )}
          </button>
        )}

        {/* Tabbed Summary Display */}
        {summaryData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${activeTab === 'analysis'
                    ? 'text-gray-900 border-b-2 border-gray-900 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analysis
                </div>
              </button>
              <button
                onClick={() => setActiveTab('transcription')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all ${activeTab === 'transcription'
                    ? 'text-gray-900 border-b-2 border-gray-900 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transcription
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Emotion State */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Emotion State</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.emotion_state || 'N/A'}</p>
              </div>

              {/* Issue Severity */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Issue Severity</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.issue_severity || 'N/A'}</p>
              </div>

              {/* Issue Type */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Volume2 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Call Info</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.issue_type || 'N/A'}</p>
              </div>

              {/* Voter Potential */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Voter Potential</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.voter_potential || 'N/A'}</p>
              </div>

              {/* Follow Back Required */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Follow Back Required</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.follow_back_required || 'N/A'}</p>
              </div>

              {/* Gender */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Gender</p>
                <p className="text-lg font-bold text-slate-800 capitalize">{summaryData.gender?.gender || 'N/A'}</p>
              </div>

              {/* Call Result */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Call Result</p>
                <p className="text-lg font-bold text-slate-800">{summaryData.analysis?.key_points_summary?.call_result || 'N/A'}</p>
              </div>

              {/* Call Duration */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                    <ThumbsDown className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-1">Call Duration</p>
                <p className="text-lg font-bold text-slate-800">
                  {/* {summaryData.duration_seconds ? (summaryData.duration_seconds / 60).toFixed(2) : '0.00'} min */}
                  {audioDuration ? `${audioDuration.formatted} min` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Detailed Analysis Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Detailed Analysis
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Emotional State */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-5 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Emotional State</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.emotion_analysis || 'No emotion analysis available'}
                  </p>
                </div>

                {/* Agent Performance */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-5 border border-green-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Agent Performance</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.agent_performance_review || 'No agent performance data available'}
                  </p>
                </div>

                {/* Issue Severity Assessment */}
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-5 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Issue Severity Assessment</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.issue_severity_assessment || 'No severity assessment available'}
                  </p>
                </div>

                {/* Issue Type Classification */}
                <div className="bg-gradient-to-br from-cyan-50 to-white rounded-lg p-5 border border-cyan-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Issue Type Classification</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.issue_type_classification || 'No type classification available'}
                  </p>
                </div>

                {/* Voter Potential Evaluation */}
                <div className="bg-gradient-to-br from-rose-50 to-white rounded-lg p-5 border border-rose-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-rose-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Voter Potential Evaluation</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.voter_potential_evaluation || 'No voter potential evaluation available'}
                  </p>
                </div>

                {/* Voice/Gender Analysis */}
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-5 border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Voice Analysis</h3>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                      {summaryData.gender?.gender || 'Unknown'} ({summaryData.gender?.gender_confidence || 'N/A'})
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.gender?.voice_description || 'No voice description available'}
                  </p>
                </div>

                {/* Issue Context */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-5 border border-orange-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Languages className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Issue Context</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {summaryData.analysis?.detailed_process_summary?.issue_context || 'No issue context available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Overall Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Overall Call Summary</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {summaryData.analysis?.detailed_process_summary?.overall_call_summary || 'No call summary available'}
              </p>
            </div>

            {/* Additional Insights */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-green-700">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                  </div>
                  Caller Satisfaction
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {summaryData.analysis?.detailed_process_summary?.caller_satisfaction_assessment || 'No satisfaction data available'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-orange-700">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  Follow-up Recommendation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {summaryData.analysis?.detailed_process_summary?.follow_up_recommendation || 'No follow-up recommendation available'}
                </p>
              </div>
            </div>
          </div>
        )}

              {activeTab === 'transcription' && (
                <div className="space-y-2 flex flex-col">
                  {summaryData.transcription.transcription.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg mb-3 transition-all max-w-[60%]  ${item.speaker === 'agent'
                          ? 'bg-gradient-to-r from-gray-100 to-gray-100 ml-6 border-l-2 border-gray-400 self-end'
                          : 'bg-gradient-to-r from-blue-50 to-blue-50 mr-6 border-l-2 border-blue-400 self-start'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold capitalize ${item.speaker === 'agent' ? 'text-gray-700' : 'text-blue-700'
                          }`}>
                          {item.speaker === 'agent' ? '🤖 Agent' : '👤 User'}
                        </span>
                        <span className="text-xs text-gray-500">• {item.language}</span>
                        <span className="text-xs text-gray-400">• {item.confidence}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload New Button */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => {
                  handleRemoveFile();
                  setActiveTab('analysis');
                }}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload New Audio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallSummaryDisplay;