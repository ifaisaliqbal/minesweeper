from django.urls import path

from .leader_board_views.views import LeaderboardByWinsView
from .game_views import views

urlpatterns = [
    path("<uuid:game_id>/", views.GameView.as_view(), name="get_game"),
    path('create/', views.GameCreateView.as_view(), name='create_game'),
    path('resume/', views.GamesResumeView.as_view(), name='resume_games'),
    path('<uuid:game_id>/action/', views.GameActionView.as_view(), name='action_game'),
    path('leaderboard/', LeaderboardByWinsView.as_view(), name='leaderboard_by_wins'),
]

