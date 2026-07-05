import React, {useRef, useEffect} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

function ScrollToTop({history}: RouteComponentProps) {
    // justification: the ref starts empty; before the first navigation its fields are undefined on purpose, so the first PUSH always registers as a location change. The cast keeps that runtime behavior while typing the ref as a full Location.
    const previousLocationRef = useRef<RouteComponentProps['location']>({} as RouteComponentProps['location']);
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