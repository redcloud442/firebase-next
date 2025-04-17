import LeaderboardTable from "./LeaderboardTable";

const LeaderboardPage = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <p>
        This is the leaderboard page. Here you can see the leaderboard of the
        users.
      </p>
      <section className="mt-4">
        <LeaderboardTable />
      </section>
    </div>
  );
};

export default LeaderboardPage;
