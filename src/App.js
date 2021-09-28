import React, { Component, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Mint from './Mint';
import Home from './Home';
import { NoMatch } from './NoMatch';
import { Layout } from './components/Layout';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/mint" component={Mint} />
              <Route exact path="/app" component={App} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
  }
}

export default App;
