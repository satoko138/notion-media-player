import React, { useState, useMemo } from 'react';
import './App.css';
import MediaList from './components/MediaList';
import ConditionForm from './components/ConditionForm';
import { Condition } from './types/common';
import { useSearchParams } from 'react-router-dom';
import { useMounted } from './util/useMounted';

function App() {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ condition, setCondition ] = useState<Condition|undefined>();
    const [ initialized, setInitialized ] = useState(false);

    useMounted(() => {
        const keyword = searchParams.get('keyword');
        console.log('keyword', keyword);
        if (keyword) {
            setCondition({
                keyword,
            })
        }
        setInitialized(true);
        console.log('mounted', keyword);
    });

    const showCondition = useMemo(() => {
        const keyword = searchParams.get('keyword');
        return keyword === null;
    }, [searchParams])

    if (!initialized) {
        // 初期化完了前にMediaListで全件取得が動いてしまうので、初期化完了を待つ
        return null;
    }

    return (
        <div className="App">
            {showCondition &&
                <ConditionForm onChange={(condition) => setCondition(condition)} />
            }
            <MediaList condition={condition} />
        </div>
    );
}

export default App;
