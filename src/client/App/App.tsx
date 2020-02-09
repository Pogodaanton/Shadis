import React from "react";
import { Background } from "@microsoft/fast-components-react-msft";
import { neutralLayerL1 } from "@microsoft/fast-components-styles-msft";
import { Header } from "../_DesignSystem/Header";

class App extends React.Component {
  public render = (): React.ReactNode => (
    <Background className="container" value={neutralLayerL1}>
      <Header />
    </Background>
  );
}

export default App;
