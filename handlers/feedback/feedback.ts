import firebaseAdmin from "@/utils/firebase/firebaseAdmin";

export const getFeedback = async (params: {
  lastDocId: string;
  lastDocParentId: string;
  lastDocCollectionName: string;
  limit: number;
}) => {
  const { lastDocId, lastDocParentId, lastDocCollectionName, limit } = params;

  const firestore = firebaseAdmin.firestore();
  let query = firestore.collectionGroup("comments_feedback");

  if (lastDocId && lastDocParentId && lastDocCollectionName) {
    const fullPath = `${lastDocCollectionName}/${lastDocParentId}/comments_feedback/${lastDocId}`;
    const lastDocRef = firestore.doc(fullPath);

    const lastDocSnap = await lastDocRef.get();

    if (!lastDocSnap.exists) {
      throw new Error("Last document for pagination not found");
    }
    //@ts-expect-error - startAfter is not a valid method for firestore.collectionGroup
    query = query.startAfter(lastDocSnap);
  }

  const feedbackSnap = await query.limit(limit).get();

  const allComments = feedbackSnap.docs.map((doc) => {
    const pathSegments = doc.ref.path.split("/");
    const parentCollection = pathSegments[0];
    const parentId = pathSegments[1];

    return {
      id: doc.id,
      parentId,
      parentCollection,
      ...doc.data(),
    };
  });

  let newLastDocId = null;
  let newLastDocParentId = null;
  let newLastDocCollectionName = null;

  if (feedbackSnap.docs.length > 0) {
    const lastDoc = feedbackSnap.docs[feedbackSnap.docs.length - 1];
    const lastDocPathSegments = lastDoc.ref.path.split("/");
    newLastDocId = lastDoc.id;
    newLastDocParentId = lastDocPathSegments[1];
    newLastDocCollectionName = lastDocPathSegments[0];
  }

  return {
    comments: allComments,
    lastDocId: newLastDocId,
    lastDocParentId: newLastDocParentId,
    lastDocCollectionName: newLastDocCollectionName,
    take: limit,
  };
};
