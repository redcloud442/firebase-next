import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

export const getFeedback = async () => {
  const feedback = await firebaseAdmin.database().ref("feedback").once("value");

  return feedback.val();
};

export const addFeedback = async (feedback: string) => {
  await firebaseAdmin.database().ref("feedback").push(feedback);
};