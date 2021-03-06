// @flow
import * as Selectors from '../constants/selectors'
import Mention, {type OwnProps} from './mention'
import {connect, type TypedState} from '../util/container'
import {createGetProfile} from '../actions/tracker-gen'
import {isMobile} from '../constants/platform'
import {createShowUserProfile} from '../actions/profile-gen'

const isSpecialCaseHighlight = (username: string) =>
  username === 'channel' || username === 'here' || username === 'everyone'

const mapStateToProps = (
  state: TypedState,
  {username}: OwnProps
): {theme: $PropertyType<OwnProps, 'theme'>} => {
  if (isSpecialCaseHighlight(username)) {
    return {theme: 'highlight'}
  }

  if (Selectors.usernameSelector(state) === username) {
    return {theme: 'highlight'}
  }

  if (Selectors.amIFollowing(state, username)) {
    return {theme: 'follow'}
  }

  return {theme: 'nonFollow'}
}

const mapDispatchToProps = (dispatch, {username}: OwnProps) => ({
  onClick: isSpecialCaseHighlight(username)
    ? undefined
    : () => {
        isMobile
          ? dispatch(createShowUserProfile({username}))
          : dispatch(createGetProfile({username, ignoreCache: true, forceDisplay: true}))
      },
})

export default connect(mapStateToProps, mapDispatchToProps)(Mention)
