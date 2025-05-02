import React from 'react'
import SettingsIcon from './icons/SettingsIcon'

const Navbar = () => {
  return (
    <header className="bg-background border-b border-slate-700 dark:border-slate-700 p-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <span className="text-purple-400">Omni</span>
        <span className="text-pink-400">Search</span>
      </h1>
      <button
        onClick={() => (window.location.href = "/config")}
        className="group p-2 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <span className="text-slate-400 group-hover:text-slate-200">
          Config
        </span>
       <SettingsIcon />
      </button>
    </div>
  </header>
  )
}

export default Navbar