import PubSub from "pubsub-js";
import { useContext } from "react";
import { FollowContext, UserContext } from "../../App";
import { unfollowUser } from "../../firebase/firestore/follower-list-functions";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";

const UnfollowWarning = (props) => {
  const userContext = useContext(UserContext)
  const followContext = useContext(FollowContext)
  const { userId, userName, cancelFunction, confirmFunction, hideFunction } = props;

  const unfollowThisUser = confirmFunction
  ? async () => {
    if (hideFunction) { hideFunction() }
    await props.confirmFunction()
    // PubSub.publish('update follow list');
  }
  : async () => {
    try {
      if (hideFunction) { hideFunction() }
      await unfollowUser(userId);
      if (userContext.guest) {
        const followingDataArray = [...followContext.following]
        const userToRemove = userId
        const updatedfollowingArray = followingDataArray.filter(user => user !== userToRemove)
        PubSub.publish('update follow list', { following: updatedfollowingArray })
      }
    } catch (error) {
      console.error("Failure to unfollow user:", error);
      alert("Failure to unfollow user, fake twitter apologizes for this inconvenience");
    }
  };

  return (
    <ConfirmationPopup header={`Unfollow @${userName}?`}
      confirmText="Unfollow"
      confirmFunction={unfollowThisUser}
      cancelFunction={cancelFunction}
      transparent={true}>
      Their Tweets will no longer show up in your home timeline.
      You can still view their profile, unless their Tweets are protected.
    </ConfirmationPopup>
  );
};

export default UnfollowWarning
