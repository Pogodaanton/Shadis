import React from 'react';
import { Button, ButtonAppearance } from "@microsoft/fast-components-react-msft";
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="">
        <Button appearance={ButtonAppearance.lightweight} href="#" rel="noopener noreferrer">Learn React</Button>
    </div>
  );
}

export default App;
