import React, { Children } from 'react';
import { Link, Redirect, Route, Router, Switch, useLocation, useRouter } from 'wouter';

type NestedRouterProps = { path: string, children: React.ReactNode };
function NestedRouter({ path, children }: NestedRouterProps) {
    const router = useRouter();
    const [location] = useLocation();
    return location.startsWith(path) ? <Router base={router.base + path}>{children}</Router> : null;
}

type RouterSwitchProps = { children?: React.ReactNode };
function RouterSwitch(props: RouterSwitchProps) {
    const [location] = useLocation();
    const elems = Children.toArray(props.children);
    for (const child of elems) {
        const isElement = React.isValidElement(child);
        if (isElement && child.props.path) {
            if (location.startsWith(child.props.path)) {
                return React.cloneElement(child);
            }
        }
        else {
            // has no path and might not even be an element - assume this is the fallback
            // (i.e the switch default) and return it
            return isElement ? React.cloneElement(child) : <>{child}</>;
        }
    }
    return null;
}

export default function WouterTest() {
    return <>
        <div>Wouter test 1 - nested routers</div>
        <Link to='/'>home</Link><br />
        <Link to='/unmatched'>unmatched</Link><br />
        <Link to='/level1'>level1</Link><br />
        <RouterSwitch>
            <NestedRouter path='/level1'>
                <Link to='/level2'>level2</Link><br />
                <NestedRouter path='/level2'>
                    <Link to='/level3'>level3</Link><br />
                    <NestedRouter path='/level3'>
                        <Link to='/doc1'>doc 1</Link><br />
                        <Link to='/doc2'>doc 2 (has subdocs)</Link><br />
                        <Doc />
                    </NestedRouter>
                </NestedRouter>
            </NestedRouter>
            <Redirect to='/level1'/>
            {/* <div>404 dude</div> */}
        </RouterSwitch>
    </>;
}

function Doc() {
    const [location] = useLocation();
    const param = location.substring(1);

    return <div>
        You've reached max level doc: {param}<br />
        <NestedRouter path='/doc2'>
            doc2 has subdocs: <Link to='/subdoc1'>subdoc 1</Link> <Link to='/subdoc2'>subdoc 2</Link>
            <SubDoc />
        </NestedRouter>
    </div>;
}
function SubDoc() {
    const [location] = useLocation();
    return <div>SubDoc ({location.substring(1)})</div>;
}