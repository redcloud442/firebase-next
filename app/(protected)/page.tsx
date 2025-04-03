import { auth } from "@/utils/firebase/firebase";

const page = async () => {
  const user = auth.currentUser;

  console.log(user);

  return <div>page</div>;
};

export default page;
