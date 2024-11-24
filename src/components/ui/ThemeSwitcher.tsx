import { SunMoonIcon } from "lucide-react";
import { useState } from "react";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark");
  }
  
  return (
    <div className="p-1 hover:bg-slate-200 dark:hover:bg-dark-100 transition-colors duration-300 rounded-md"
    onClick={() => handleToggle()}>
      <SunMoonIcon size={20} className="dark:text-white"/>
    </div>
  )
}

export default ThemeSwitcher;