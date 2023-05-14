import { doc, setDoc, getDoc, writeBatch, arrayUnion, updateDoc } from "firebase/firestore";
import { auth } from "../auth";
import { deleteBannerImage, deleteProfileImage } from "../storage/delete-image";
import { storeBannerImage, storeProfileImage } from "../storage/store-image";
import { db } from "./firestore";


export const confirmExistingUser = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists();
  } catch (error) {
    console.error("Failure to confirm existing user:", error);
  }
};

export const createFakeUser = async (userName, displayName) => {
  try {
    if (await confirmExistingUser(userName)) { return }
    
    const batch = writeBatch(db)

    const userDocRef = doc(db, 'users', userName);
    const userNameListRef = doc(db, 'users', 'userNameList');
    const userIdListRef = doc(db, 'users', 'userIdList');
    const followerListRef = doc(db, 'followData', userName);
    const tweetReferencesRef = doc(db, 'tweetReferences', userName)

    batch.set(userNameListRef, { [userName]: true }, { merge: true });
    batch.set(userIdListRef, { [userName]: true }, { merge: true });
    batch.set(userDocRef, {
      displayName: displayName,
      userName: userName,
      userId: userName
    });
    batch.set(followerListRef, {
      following: [],
      followers: []
    });
    batch.set(tweetReferencesRef, {
      userFeed: {},
      userTweets: {}
    });

    await batch.commit()
  } catch (error) {
    console.error("Failure to create fake user:", error)    
  }
}

export const createNewUser = async (user, userName) => {
  try {
    const batch = writeBatch(db)

    const userDocRef = doc(db, 'users', user.uid);
    const userPrivateDataDocRef = doc(db, 'users', user.uid, 'private', 'contact')
    const userNameListRef = doc(db, 'users', 'userNameList');
    const userIdListRef = doc(db, 'users', 'userIdList');
    const followerListRef = doc(db, 'followData', user.uid);
    const tweetReferencesRef = doc(db, 'tweetReferences', user.uid)
    const firstFollowerRef = doc(db, 'followData', 'a16Or57x2gTriztGc1p9ZMp1BCw2')
    
    batch.set(userNameListRef, { [userName]: true }, { merge: true });
    batch.set(userIdListRef, { [user.uid]: true }, { merge: true });
    batch.set(userDocRef, {
      displayName: user.displayName,
      userName: userName,
      userId: user.uid,
      timestamp: Date.now()
    });
    batch.set(userPrivateDataDocRef, {
      email: user.email,
    })
    batch.set(followerListRef, {
      following: [],
      followers: ['a16Or57x2gTriztGc1p9ZMp1BCw2']
    });
    batch.set(tweetReferencesRef, {
      userFeed: {},
      userTweets: {}
    });
    batch.update(firstFollowerRef, {
      following: arrayUnion(user.uid)
    })

    await batch.commit()
  } catch (error) {
    auth.signOut()
    console.error("Failure to create new user account:", error);
  }
};

export const updateUserProfile = async (newData, userId = auth.currentUser.uid) => {
  try {
    const userData = {}
    if (newData.displayName) { userData.displayName = newData.displayName }
    if (newData.bio) { userData.bio = newData.bio }
    if (newData.profileImageFile) {
      await deleteProfileImage(userId)
      const profileImageUrl = await storeProfileImage(userId, newData.profileImageFile)
      userData.profileImageUrl = profileImageUrl
    }
    if (newData.bannerImageFile) {
      await deleteBannerImage(userId)
      const bannerImageUrl = await storeBannerImage(userId, newData.bannerImageFile)
      userData.bannerImageUrl = bannerImageUrl
    }
    if (newData.bannerImageFile === false) {
      await deleteBannerImage(userId)
      userData.bannerImageUrl = ""
    }
    if (newData.profileImageFile === false) {
      await deleteProfileImage(userId)
      userData.profileImageUrl = ""
    }
    if (newData.bannerImageAdjustment) {
      userData.bannerImageAdjustment = newData.bannerImageAdjustment
    }
    if (newData.profileImageAdjustment) {
      userData.profileImageAdjustment = newData.profileImageAdjustment
    }
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, userData)
  } catch (error) {
    console.error("Failure to update user profile data in firestore:", error)
  }
}

export const createGuestUser = async (user, userName) => {
  try {
    const userDocRef = doc(db, 'guestUsers', user.uid);
    await setDoc(userDocRef, {
      displayName: "Guest",
      userName: userName
    });
  } catch (error) {
    console.error("Failure to create new guest user account:", error);
  }
};

export const checkUserNameAvailability = async (userName) => {
  try {
    const docRef = doc(db, 'users', 'userNameList');
    const nameListDoc = await getDoc(docRef);
    return !nameListDoc.data()[userName];
  } catch (error) {
    console.error("Failure to check if user name is available:", error);
  }
};
