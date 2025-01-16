import logo from "../public/logo.png";
import "./App.css";
import { useOpenWidget } from "@compilot/react-sdk";

function App() {
  const openWidget = useOpenWidget();
  return (
    <>
      <div>
        <img src={logo} className="logo" alt="ComPilot logo" />
      </div>
      <h1>Example of a react app in regular mode</h1>
      <div className="card">
        <button
          id="compilot-button"
          disabled={openWidget.isLoading}
          onClick={() => openWidget.openWidget()}
        >
          Open Widget
        </button>
      </div>
    </>
  );
}

export default App;
