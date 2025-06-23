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
  submitHighscore: (score: number) => void;
}

export function useGameHighscore({ gameId, gameName, initialScore = 0 }: UseGameHighscoreArgs): UseGameHighscoreResult {
  const user = useAppSelector((state) => state.auth.user);
  const [highscore, setHighscore] = useState<number>(initialScore);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch previous highscore on mount
  useEffect(() => {
    if (user && gameId) {
      setLoading(true);
      // Replace with real API call when backend is ready
      fetch(`/api/${user.id}/games/${gameId}`)
        .then(res => res.json())
        .then(data => {
          setHighscore(data.highscore || 0);
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
  function submitHighscore(newScore: number) {
    if (!user || !gameId) return;
    if (newScore > highscore) {
      setHighscore(newScore);
      // Replace with real API call when backend is ready
      fetch(`/api/${user.id}/games/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          game_id: gameId,
          game_name: gameName,
          timestamp: new Date().toISOString(),
          highscore: newScore
        })
      });
    }
  }

  return { highscore, loading, submitHighscore };
}
