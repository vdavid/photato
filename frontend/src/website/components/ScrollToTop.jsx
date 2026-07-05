import React, {useRef, useEffect} from 'react';
import {withRouter} from 'react-router-dom';

function ScrollToTop({history}) {
    const previousLocationRef = useRef({});
    useEffect(() => {
        return history.listen((newLocation, action) => {
            if ((action === 'PUSH') && (newLocation.pathname + newLocation.search + newLocation.hash !== previousLocationRef.current.pathname + previousLocationRef.current.search + previousLocationRef.current.hash)) {
                window.scrollTo(0, 0);
            }
            previousLocationRef.current = newLocation;
        });
    }, []);

    return null;
}

export default withRouter(ScrollToTop);