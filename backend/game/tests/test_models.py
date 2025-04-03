from django.test import TestCase
from game.models import Game
from django.contrib.auth.models import User

class GameModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_initialize_board_places_correct_number_of_mines(self):
        game = Game.objects.create(user=self.user, width=5, height=5, mines_count=4)
        game.initialize_board()
        board = game.get_board()
        mine_count = sum(row.count(-1) for row in board)
        self.assertEqual(mine_count, 4)

    def test_reveal_cell_marks_game_over_on_mine(self):
        game = Game.objects.create(user=self.user, width=3, height=3, mines_count=1)
        game.initialize_board()
        game.mines = [[0, 0]]
        game.save()
        revealed, hit_mine = game.reveal_cell(0, 0)
        game.refresh_from_db()
        self.assertTrue(hit_mine)
        self.assertTrue(game.is_over)

    def test_reveal_cell_triggers_win_when_all_safe_cells_are_revealed(self):
        game = Game.objects.create(user=self.user, width=2, height=2, mines_count=1)
        game.initialize_board()
        game.mines = [[0, 0]]
        game.save()
        game.reveal_cell(0, 1)
        game.reveal_cell(1, 0)
        game.reveal_cell(1, 1)
        game.refresh_from_db()
        self.assertTrue(game.is_over)
        self.assertTrue(game.is_won)

    def test_toggle_flag_marks_and_unmarks_cell(self):
        game = Game.objects.create(user=self.user, width=3, height=3, mines_count=0)
        game.initialize_board()
        _, flagged = game.toggle_flag(1, 1)
        self.assertTrue(flagged[1][1])
        _, flagged = game.toggle_flag(1, 1)
        self.assertFalse(flagged[1][1])