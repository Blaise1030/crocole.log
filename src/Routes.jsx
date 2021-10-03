import React, {useContext} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import {Suspense} from "react";
import LoopCircleLoading from "react-loadingg/lib/LoopCircleLoading";
import {UserContext} from "./context/Authentication";

const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const LogPage = React.lazy(() => import("./pages/LogPage"));
const LogsPage = React.lazy(() => import("./pages/LogsPage"));
// const LoadingPage = React.lazy(() => import("./pages/LoadingPage"));

const Logs = () => {
  return (
    <Suspense fallback={<LoopCircleLoading />}>
      <LogsPage />
    </Suspense>
  );
};

const Log = () => {
  return (
    <Suspense fallback={<LoopCircleLoading />}>
      <LogPage />
    </Suspense>
  );
};
const SpaceRoute = () => {
  return (
    <Router>
      <Switch>        
        <Route exact path="/">
          <Suspense fallback={<LoopCircleLoading />}>
            <LoginPage />
          </Suspense>
        </Route>
        <PrivateRoute path="/logs" component={Logs} />
        <PrivateRoute path="/log/:id" component={Log} />
      </Switch>
    </Router>
  );
};

export default SpaceRoute;

const PrivateRoute = ({component: Component, ...rest}) => {
  const {user} = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        )
      }
    />
  );
};
