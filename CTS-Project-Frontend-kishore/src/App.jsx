import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
//import AboutUs from "./pages/AboutUs";
import Analysis from "./pages/Analysis";
//import Result from "./pages/Result";

function App() {
  return (
    <Router>
      {/* NavBar is outside Routes → visible on all pages */}
      <NavBar />

      <div className="pt-20"> {/* optional padding to avoid overlap with fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about-us" element={<AboutUs />} /> */}
          <Route path="/analysis" element={<Analysis />} />
          {/* <Route path="/result" element={<Result />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;