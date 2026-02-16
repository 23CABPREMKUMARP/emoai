import { useState, useEffect } from 'react'
import CameraFeed from './components/CameraFeed'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import EmotionDialog from './components/EmotionDialog'
import TextAnalyzer from './components/TextAnalyzer'
import useAnalytics from './hooks/useAnalytics' // Import client-side hook
import './index.css'

function App() {
  const [currentEmotion, setCurrentEmotion] = useState(null)
  const [mode, setMode] = useState('video'); // 'video' or 'text'

  // Use client-side analytics instead of fetching from backend
  const analyticsData = useAnalytics(currentEmotion);

  const handleEmotionUpdate = (emotionData) => {
    setCurrentEmotion(emotionData);
  };

  return (
    <div className="h-screen w-full bg-[#fdf2f8] relative overflow-hidden flex flex-col text-slate-800 font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-400/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Top Bar Navigation */}
      <nav className="h-20 px-4 md:px-8 flex items-center justify-between z-20 backdrop-blur-sm border-b border-white/30 bg-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-xl shadow-lg flex items-center justify-center text-white text-xl">
            🧠
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-indigo-600 tracking-tight leading-tight">Emotion AI</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none hidden md:block">Dashboard v2.0</p>
          </div>
        </div>

        {/* Mode Toggle - Pill Shape */}
        <div className="bg-white/40 p-1.5 rounded-full flex gap-1 shadow-inner border border-white/60 backdrop-blur-md">
          <button
            onClick={() => setMode('video')}
            className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${mode === 'video' ? 'bg-white text-pink-600 shadow-md ring-2 ring-pink-100' : 'text-gray-500 hover:bg-white/50'}`}
          >
            Video
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${mode === 'text' ? 'bg-white text-purple-600 shadow-md ring-2 ring-purple-100' : 'text-gray-500 hover:bg-white/50'}`}
          >
            Text
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">System Online</span>
        </div>
      </nav>

      {/* Main Content Area - Full Height */}
      <main className="flex-1 p-4 md:p-6 z-10 overflow-hidden relative">
        {mode === 'video' ? (
          <div className="h-full w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Panel: Camera & Live Emotion (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
              {/* Camera Feed Container */}
              <div className="flex-1 glass-panel relative overflow-hidden rounded-3xl border-0 shadow-2xl bg-black/5 flex items-center justify-center group min-h-0">
                <CameraFeed onEmotionUpdate={handleEmotionUpdate} customClass="h-full w-full object-cover" />
              </div>

              {/* Emotion Status Row */}
              <div className="h-40 shrink-0 flex justify-center">
                {currentEmotion ? (
                  <div className="w-full h-full max-w-2xl">
                    <EmotionDialog
                      emotion={currentEmotion.emotion}
                      score={currentEmotion.score}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full glass-panel rounded-3xl bg-white/30 border border-white/40 text-center flex flex-col items-center justify-center border-dashed border-2 border-pink-200">
                    <div className="text-3xl mb-1 animate-pulse">📷</div>
                    <p className="text-gray-500 font-bold">Waiting for input...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel: Analytics Sidebar (4 cols) */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6 min-h-0">
              <div className="flex-1 glass-panel rounded-3xl p-2 md:p-6 overflow-hidden flex flex-col pt-0 bg-white/40 border border-white/60 shadow-xl">
                <div className="h-full overflow-y-auto custom-scrollbar p-2">
                  <AnalyticsDashboard data={analyticsData} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">
              <TextAnalyzer />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
