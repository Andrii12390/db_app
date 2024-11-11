import ThemeSwitcher from "../ui/ThemeSwitcher";

const Header = () => {
  return (
    <div className="w-full px-3 py-1 flex justify-between items-center bg-light-100 shadow-md dark:bg-dark-200 transition-colors duration-300">
      <h1 className="text-xl font-semibold dark:text-white">DB App</h1>
      <ThemeSwitcher/>
    </div>
  )
}

export default Header;