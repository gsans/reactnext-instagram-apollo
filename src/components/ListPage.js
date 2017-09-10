import React from 'react'
import { Link } from 'react-router-dom'
import Post from '../components/Post'
import { graphql, gql } from 'react-apollo'

class ListPage extends React.Component {

  static propTypes = {
    data: React.PropTypes.object,
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.data.loading) {
      if (this.subscription) {
        if (newProps.data.allPosts !== this.props.data.allPosts) {
          // if the feed has changed, we need to unsubscribe before resubscribing
          this.subscription()
        } else {
          // we already have an active subscription with the right params
          return
        }
      }
      this.subscription = newProps.data.subscribeToMore({
        document: gql`
          subscription {
            Post(filter: {
              mutation_in: [CREATED]
            }) {
              node {
                id
                imageUrl
                description
              }
            }
          }
        `,
        variables: null,

        // this is where the magic happens
        updateQuery: (previousState, {subscriptionData}) => {
          const newPost = subscriptionData.data.Post.node

          return {
            allPosts: [
              {
                ...newPost
              },
              ...previousState.allPosts
            ]
          }
        },
        onError: (err) => console.error(err),
      })
    }
  }

  render () {
    if (this.props.data.loading) {
      return (
        <div className='flex w-100 h-100 items-center justify-center pt7'>
          <div>
            Loading
            (from {process.env.REACT_APP_GRAPHQL_ENDPOINT})
          </div>
        </div>
      )
    }

    let blurClass = ''

    if (this.props.location.pathname !== '/') {
      blurClass = ' blur'
    }
    return (
      <div className={'w-100 flex justify-center pa6' + blurClass}>
        <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
          <Link
            to='/create'
            className='ma3 box new-post br2 flex flex-column items-center justify-center ttu fw6 f20 black-30 no-underline'
          >
            <img
              src={require('../assets/plus.svg')}
              alt=''
              className='plus mb3'
            />
            <div>New Post</div>
          </Link>
          {this.props.data.allPosts && this.props.data.allPosts.map(post => (
            <Post
              key={post.id}
              post={post}
              refresh={() => this.props.data.refetch()}
            />
          ))}
        </div>
        {this.props.children}
      </div>
    )
  }
}

const FeedQuery = gql`query allPosts {
  allPosts(orderBy: createdAt_DESC) {
    id
    imageUrl
    description
  }
}`

const ListPageWithData = graphql(FeedQuery, {
  options: {
    forcePolicy: 'cache-and-network'
  }
})(ListPage)

export default ListPageWithData
