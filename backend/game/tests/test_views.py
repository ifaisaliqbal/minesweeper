from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from game.models import Game

class GameViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")
        self.token = self.client.post(reverse("token_obtain_pair"), {"username": "testuser", "password": "testpass"}).data['access']
        self.auth_header = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

    def test_create_game_authenticated(self):
        url = reverse("create_game")
        data = {"width": 6, "height": 6, "mines_count": 5}
        response = self.client.post(url, data, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['width'], 6)
        self.assertEqual(response.data['mines_count'], 5)

    def test_create_game_unauthenticated(self):
        url = reverse("create_game")
        data = {"width": 6, "height": 6, "mines_count": 5}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_game_by_id(self):
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=3)
        game.initialize_board()
        url = reverse("get_game", args=[game.id])
        response = self.client.get(url, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['width'], 5)

    def test_flag_cell(self):
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=1)
        game.initialize_board()
        url = reverse("action_game", args=[game.id])
        data = {"x": 1, "y": 1, "action": "flag"}
        response = self.client.post(url, data, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("flagged", response.json())

    def test_reveal_cell(self):
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=1)
        game.initialize_board()
        url = reverse("action_game", args=[game.id])
        data = {"x": 0, "y": 0, "action": "reveal"}
        response = self.client.post(url, data, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("revealed", response.json())

    def test_resume_games_returns_unfinished(self):
        for i in range(6):
            Game.objects.create(user=self.user, width=5, height=5, mines_count=2, is_over=False).initialize_board()
        url = reverse("resume_games")
        response = self.client.get(url, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data), 5)
    def test_reveal_out_of_bounds(self):
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=1)
        game.initialize_board()
        url = reverse("action_game", args=[game.id])
        data = {"x": 6, "y": 6, "action": "reveal"}
        response = self.client.post(url, data, **self.auth_header)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_win_game_condition(self):
        # Create a 2x2 game with 1 mine, and reveal all safe cells
        game = Game.objects.create(user=self.user, width=2, height=2, mines_count=1)
        game.initialize_board()
        game.mines = [[0, 0]]
        game.save()
        url = reverse("action_game", args=[game.id])
        # Reveal all non-mine cells
        for y in range(2):
            for x in range(2):
                if [y, x] != [0, 0]:
                    data = {"x": x, "y": y, "action": "reveal"}
                    self.client.post(url, data, **self.auth_header)
        game.refresh_from_db()
        self.assertTrue(game.is_won)
        self.assertTrue(game.is_over)

    def test_lose_game_condition(self):
        # Create a game and reveal a mine cell
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=1)
        game.initialize_board()
        game.mines = [[0, 0]]
        game.save()
        url = reverse("action_game", args=[game.id])
        data = {"x": 0, "y": 0, "action": "reveal"}
        self.client.post(url, data, **self.auth_header)
        game.refresh_from_db()
        self.assertTrue(game.is_over)
        self.assertFalse(game.is_won)
