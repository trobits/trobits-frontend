import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

interface UseGameHighscoreArgs {
  gameId: string;
  gameName: string;
  initialScore?: number;
}

interface UseGameHighscoreResult {
  highscore: number;
  loading: boolean;
  submitHighscore: (score: number) => Promise<void>;
}

const BASE_URL = "http://localhost:3000/api/v1";

export function useGameHighscore({ gameId, gameName, initialScore = 0 }: UseGameHighscoreArgs): UseGameHighscoreResult {
  const user = useAppSelector((state) => state.auth.user);
  const [highscore, setHighscore] = useState<number>(initialScore);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all scores for this game and extract current user's highscore
  useEffect(() => {
    if (user && gameId) {
      setLoading(true);
      fetch(`${BASE_URL}/games/${gameId}/getallscores`)
        .then(res => res.json())
        .then(data => {
          const allScores = data.scores || {};
          const userScoreObj = allScores[user.id];
          setHighscore(userScoreObj?.highscore || 0);
          setLoading(false);
        })
        .catch(() => {
          setHighscore(0);
          setLoading(false);
        });
    } else {
      setHighscore(0);
      setLoading(false);
    }
  }, [user, gameId]);

  // Function to submit new highscore
  async function submitHighscore(newScore: number) {
    if (!user || !gameId) return;
    if (newScore > highscore) {
      setHighscore(newScore);
      const scoreObj = {
        user_id: user.id,
        game_id: gameId,
        game_name: gameName,
        timestamp: new Date().toISOString(),
        highscore: newScore,
        first_name: user.firstName || "",
        last_name: user.lastName || ""
      };
      await fetch(`${BASE_URL}/${user.id}/games/${gameId}/setscore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreObj)
      });
    }
  }

  return { highscore, loading, submitHighscore };
}
