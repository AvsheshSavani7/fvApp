import "./App.css";
import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { useSelector } from "react-redux";
import useIdleTimeout from "./hooks/useIdleTimeout";
import { removeAuth } from "./services/identity.service";

const App = () => {
  const activeBtnKey = useSelector(
    (state) => state.customerReducer.activeBtnKey
  );

  const handleIdle = () => {
    removeAuth();
    window.location.reload();
  };

  const { idleTimer } = useIdleTimeout({ handleIdle, idleTime: 3600 });

  return (
    <div className={`${activeBtnKey && "slide-image"} App`} id="App">
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          scrollAngleRanges: [
            { start: 75, end: 105 },
            { start: 255, end: 285 },
          ],
        }}
      >
        <AppRoutes />
        {/* <MyPreview /> */}
      </DndProvider>
    </div>
  );
};

export default App;
