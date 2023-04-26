import { deleteTweet } from "../../../firestore/delete-user-tweet";
import ConfirmationPopup from "../../ConfirmationPopup/ConfirmationPopup";

const DeleteWarning = (props) => {
  const { tweetData, cancelFunction, followers, hideTweet } = props;
  const { tweetId } = tweetData;

  const deleteThisTweet = async () => {
    try {
      hideTweet(true);
      await deleteTweet(tweetId, followers);
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
