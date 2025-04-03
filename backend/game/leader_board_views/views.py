from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Count, Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

class LeaderboardByWinsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        leaderboard = (
            User.objects
            .annotate(
                total_games=Count('game'),
                wins=Count('game', filter=Q(game__is_won=True))
            )
            .filter(wins__gt=0)
            .order_by('-wins')[:10]
        )

        data = [
            {
                "username": user.username,
                "wins": user.wins,
                "total_games": user.total_games,
                "win_rate": round(user.wins / user.total_games * 100, 1)
            }
            for user in leaderboard
        ]

        return Response(data, status=status.HTTP_200_OK)
