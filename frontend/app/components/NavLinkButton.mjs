import {createElement} from '/web_modules/react.js';
import {useHistory} from '/web_modules/react-router-dom.js';

export default function NavLinkButton(props) {
    const {to, onClick, ...rest} = props;
    const history = useHistory();

    return createElement('button', {...rest, onClick: event => { history.push(to); onClick && onClick(event); }});
}