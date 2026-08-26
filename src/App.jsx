import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import { Game } from "./components/Game/index";
import Home from "./components/HomePage/HomePage";
import ChampionsList from "./components/ChampionsListPage/ChampionsList";
import BoardSettingsPage from "./components/BoardSettingsPage/BoardSettingsPage";
import RulesPage from "./components/RulesPage/RulesPage";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/champions" element={<ChampionsList />} />
        <Route path="/game" element={<Game />} />
        <Route path="/board" element={<BoardSettingsPage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer autoClose={2000} hideProgressBar />
    </>
  );
}

export default App;
