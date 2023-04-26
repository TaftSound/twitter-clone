import PubSub from "pubsub-js";
import { unfollowUser } from "../../../firestore/follower-list-functions";
import ConfirmationPopup from "../../ConfirmationPopup/ConfirmationPopup";

const UnfollowWarning = (props) => {
  const { tweetData, cancelFunction } = props;
  const { userName, userId } = tweetData;

  const unfollowThisUser = async () => {
    try {
      await unfollowUser(userId);
      PubSub.publish('update follow list');
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
