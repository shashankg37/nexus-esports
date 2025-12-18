const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const setToken = (token: string): void => {
  localStorage.setItem("access_token", token);
};

export const removeToken = (): void => {
  localStorage.removeItem("access_token");
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // FastAPI OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    setToken(data.access_token);
    return data;
  },

  register: async (email: string, password: string, role: string = "player") => {
    return apiRequest<{ id: number; email: string; role: string; is_active: boolean }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      }
    );
  },

  getMe: async () => {
    return apiRequest<{ id: number; email: string; role: string; is_active: boolean }>(
      "/auth/me"
    );
  },

  logout: () => {
    removeToken();
  },
};

// Tournaments API
export const tournamentsApi = {
  getAll: async () => {
    return apiRequest<any[]>("/tournaments");
  },

  getById: async (id: number) => {
    return apiRequest<any>(`/tournaments/${id}`);
  },

  create: async (data: { name: string; start_date?: string; number_of_teams?: number; format?: string }) => {
    return apiRequest<any>("/tournaments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: Partial<{ name: string; start_date: string; number_of_teams: number; status: string; format: string }>) => {
    return apiRequest<any>(`/tournaments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// Matches API
export const matchesApi = {
  getAll: async (tournamentId?: number) => {
    const query = tournamentId ? `?tournament_id=${tournamentId}` : "";
    return apiRequest<any[]>(`/matches${query}`);
  },

  getById: async (id: number) => {
    return apiRequest<any>(`/matches/${id}`);
  },

  create: async (data: { tournament_id: number; team1_name: string; team2_name: string; scheduled_at?: string; status?: string }) => {
    return apiRequest<any>("/matches", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: Partial<{ scheduled_at: string; status: string; room_code: string; score_team1: number; score_team2: number }>) => {
    return apiRequest<any>(`/matches/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  generateFixtures: async (tournamentId: number, format: string = "Single Elimination") => {
    return apiRequest<any[]>("/matches/generate-fixtures", {
      method: "POST",
      body: JSON.stringify({ tournament_id: tournamentId, format }),
    });
  },

  generateRoomCode: async (matchId: number) => {
    return apiRequest<any>(`/matches/${matchId}/room-code`, {
      method: "PUT",
    });
  },

  getMyMatches: async () => {
    return apiRequest<any[]>("/matches/player/my-matches");
  },

  getFixtures: async (tournamentId: number) => {
    return apiRequest<any[]>(`/matches/player/fixtures/${tournamentId}`);
  },
};

// Referee API
export const refereeApi = {
  validateCode: async (code: string) => {
    return apiRequest<any>("/referee/validate-code", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  submitResult: async (
    matchId: number, 
    scoreTeam1: number, 
    scoreTeam2: number,
    team1Players: Array<{ player_id: number; score: number }>,
    team2Players: Array<{ player_id: number; score: number }>
  ) => {
    return apiRequest<any>(`/referee/matches/${matchId}/result`, {
      method: "POST",
      body: JSON.stringify({ 
        score_team1: scoreTeam1, 
        score_team2: scoreTeam2,
        team1_players: team1Players,
        team2_players: team2Players,
      }),
    });
  },

  getPendingMatches: async () => {
    return apiRequest<any[]>("/referee/pending-matches");
  },

  getCompletedMatches: async () => {
    return apiRequest<any[]>("/referee/completed-matches");
  },
};

// Players API
export const playersApi = {
  getAll: async () => {
    return apiRequest<any[]>("/players");
  },

  getMe: async () => {
    return apiRequest<any>("/players/me");
  },
};

// Leaderboard API
export const leaderboardApi = {
  get: async () => {
    return apiRequest<any[]>("/leaderboard");
  },
};

