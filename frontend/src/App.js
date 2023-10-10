// @bekbrace
// FARMSTACK Tutorial - Sunday 13.06.2021

import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Detail from "./components/Detail";
import KNN from "./components/KNN";


function App() {

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="detail/:keyframe" element={<Detail />} />
      <Route path="knn/:keyframe_with_location" element={<KNN />} />
    </Routes>

  );
}

export default App;