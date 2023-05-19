import { deleteTweet } from "../../firebase/firestore/delete-user-tweet";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import PubSub from "pubsub-js";
import { useContext } from "react";
import { UserContext } from "../../App";
import { getFollowList } from "../../firebase/firestore/follower-list-functions";

const DeleteWarning = (props) => {
  const userContext = useContext(UserContext)
  const { tweetData, cancelFunction, followers, hideTweet } = props;
  const { tweetId } = tweetData;

  const deleteThisTweet = async () => {
    try {
      hideTweet(true);
      if (tweetData.userId !== userContext.userId) {
        const followData = await getFollowList(tweetData.userId)
        await deleteTweet(tweetId, followData.followers, tweetData.userId)
      } else {
        await deleteTweet(tweetId, followers)
      }
    } catch (error) {
      console.error('Failure to delete user tweet:', error);
      hideTweet(false);
      alert("Failure to delete tweet, fake twitter apologizes for this inconvenience");
    }
  };

  return (
    <ConfirmationPopup header="Delete tweet?"
      confirmText="Delete"
      confirmFunction={deleteThisTweet}
      cancelFunction={cancelFunction}
      deleteButton={true}
      transparent={true}>
      This can’t be undone and it will be removed from your profile,
      the timeline of any accounts that follow you, and from Tweeter search results.
    </ConfirmationPopup>
  );
};

export default DeleteWarning
