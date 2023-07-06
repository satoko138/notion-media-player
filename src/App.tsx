import React, { useState } from 'react';
import './App.css';
import MediaList from './components/MediaList';
import ConditionForm from './components/ConditionForm';
import { Condition } from './types/api-types';

function App() {
    const [ condition, setCondition ] = useState<Condition|undefined>();

    return (
        <div className="App">
            <ConditionForm onChange={(condition) => setCondition(condition)} />
            <MediaList condition={condition} />
        </div>
    );
}

export default App;
