import React from 'react'
import ReactDOM from 'react-dom'
import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import 'tachyons'
import './index.css'

// __SUBSCRIPTIONS_API_ENDPOINT__ looks similar to: `wss://subscriptions.graph.cool/v1/<PROJECT_ID>`
const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj74i55y00ik001005mc65ewi', {
  reconnect: true,
  timeout: 20000
})

// __SIMPLE_API_ENDPOINT__ looks similar to: `https://api.graph.cool/simple/v1/<PROJECT_ID>`
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj74i55y00ik001005mc65ewi',
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <Switch>
      <Route exact path='/' component={ListPage} />
      <Route path='/create' component={CreatePage} />
      </Switch>
    </Router>
  </ApolloProvider>
  ),
  document.getElementById('root')
)
