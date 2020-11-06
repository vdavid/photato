import React, {useEffect} from '../../web_modules/react.js';
import {withRouter} from '../../web_modules/react-router-dom.js';

function ScrollToTop({ history }) {
    useEffect(() => {
        return history.listen(() => window.scrollTo(0, 0));
    }, []);

    return null;
}

export default withRouter(ScrollToTop);