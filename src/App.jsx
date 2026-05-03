import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DetailPage from './pages/DetailPage'
import WatchPage from './pages/WatchPage'
import SearchPage from './pages/SearchPage'
import HistoryPage from './pages/HistoryPage'
import BookmarkPage from './pages/BookmarkPage'
import GenrePage from './pages/GenrePage'
import SchedulePage from './pages/SchedulePage'
import AdminPage from './pages/AdminPage'
import GenreListPage from './pages/GenreListPage'
import MoviePage from './pages/MoviePage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: '#080b10' }}>
          <Navbar/>
          <main className="md:pt-14">
            <Routes>
              <Route path="/"                 element={<Home/>}         />
              <Route path="/ongoing"          element={<Home/>}         />
              <Route path="/complete"         element={<Home/>}         />
              <Route path="/anime/:id"        element={<DetailPage/>}   />
              <Route path="/watch/:episodeId" element={<WatchPage/>}    />
              <Route path="/search"           element={<SearchPage/>}   />
              <Route path="/history"          element={<HistoryPage/>}  />
              <Route path="/bookmark"         element={<BookmarkPage/>} />
              <Route path="/genre/:genreId"   element={<GenrePage/>}    />
              <Route path="/schedule"         element={<SchedulePage/>} />
              <Route path="/admin"            element={<AdminPage/>}    />
              <Route path="/genres"           element={<GenreListPage/>}/>
              <Route path="/movies"           element={<MoviePage/>}/>
              <Route path="*"                 element={<Navigate to="/" replace/>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
