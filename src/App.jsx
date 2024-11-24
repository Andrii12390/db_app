import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "react-hot-toast";

const App = () => {
 
  return (
    <div className="h-dvh">
        <Toaster position="top-right" />
        <AppLayout/>
    </div>
  );
}

export default App;
