import React, {useRef, useEffect} from '../../web_modules/react.js';
import {withRouter} from '../../web_modules/react-router-dom.js';

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