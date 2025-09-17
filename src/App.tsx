import { Route, Routes } from "react-router-dom"
import Index from "./pages/index"
import Upload from "./pages/upload"
import Pos from "./pages/Pos"
import OpenPos from "./pages/OpenPos"
import PlatformComparison from "./pages/Platform"
import AiChatPage from "./pages/AiChat"
import Vendors from "./pages/Vendors"
import AIInsights from "./pages/AIInsights"
import Target from "./pages/Target"

export default function Page() {
  return (
    <>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Routes>
                <Route path="/" element={<Index/>} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/pos" element={<Pos />} />
                <Route path="/open-pos" element={<OpenPos />} />
                <Route path="/platform" element={<PlatformComparison />} />
                <Route path="/ai-chat" element={<AiChatPage />} />
                <Route path="/vendors" element={<Vendors />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/target" element={<Target />} />
              </Routes>
            </div>
          </div>
        </div>
    </>
  )
}
