import React from 'react'
import { graphql, gql } from 'react-apollo'

class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
    mutate: React.PropTypes.func,
    refresh: React.PropTypes.func,
  }

  render () {
    return (
      <div className='bg-white ma3 box post flex flex-column no-underline br2'>
        <div
          className='image'
          style={{
            backgroundImage: `url(${this.props.post.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            paddingBottom: '100%',
          }}
        />
        <div className='flex items-center black-80 fw3 description'>
          {this.props.post.description}
        </div>
      </div>
    )
  }

  handleDelete = async () => {
    await this.props.mutate({variables: {id: this.props.post.id}})
    this.props.history.replace('/')
  }
}

const deleteMutation = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`

const PostWithMutation = graphql(deleteMutation)(Post)

export default PostWithMutation
