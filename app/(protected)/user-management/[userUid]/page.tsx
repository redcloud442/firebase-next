const page = async ({ params }: { params: Promise<{ userUid: string }> }) => {
  const { userUid } = await params;

  return <div>{userUid}</div>;
};

export default page;
