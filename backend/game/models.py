from django.db import models
from django.contrib.auth.models import User
import uuid
import random
from enum import IntEnum

class Cell(IntEnum):
    MINE = -1
    EMPTY = 0

class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game')
    width = models.IntegerField(default=10)
    height = models.IntegerField(default=10)
    mines_count = models.IntegerField(default=10)
    
    mines = models.JSONField(default=list, blank=True)
    revealed = models.JSONField(default=list, blank=True)
    flagged = models.JSONField(default=list, blank=True)

    is_over = models.BooleanField(default=False)
    is_won = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def initialize_board(self):
        mines = set()
        while len(mines) < self.mines_count:
            x = random.randint(0, self.width - 1)
            y = random.randint(0, self.height - 1)
            mines.add((y, x))
        
        self.mines = [list(coord) for coord in mines]  # JSON serializable
        self.revealed = []
        self.flagged = []
        self.save()

    def reveal_cell(self, y, x):
        if self._is_flagged(y, x) or self._is_revealed(y, x):
            return self._reconstruct_revealed(), False

        self.revealed.append([y, x])
        board = self.get_board()

        if board[y][x] == Cell.MINE:
            self.is_over = True
            self.save()
            return self._reconstruct_revealed(), True

        if board[y][x] == Cell.EMPTY:
            self._flood_fill(y, x)

        self._check_win()
        self.save()
        return self._reconstruct_revealed(), False

    def toggle_flag(self, y, x):
        if self._is_revealed(y, x):
            return self._reconstruct_revealed(), self._reconstruct_flagged()

        if [y, x] in self.flagged:
            self.flagged.remove([y, x])
        else:
            self.flagged.append([y, x])

        self.save()
        return self._reconstruct_revealed(), self._reconstruct_flagged()
    
    def get_board(self):
        board = [[0 for _ in range(self.width)] for _ in range(self.height)]

        for y, x in self.mines:
            board[y][x] = -1
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    ny, nx = y + dy, x + dx
                    if self._in_bounds(ny, nx) and board[ny][nx] != -1:
                        board[ny][nx] += 1

        return board

    def _flood_fill(self, y, x):
        board = self.get_board()
        visited = set(tuple(coord) for coord in self.revealed)
        stack = [(y, x)]

        while stack:
            cy, cx = stack.pop()
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    ny, nx = cy + dy, cx + dx
                    coord = (ny, nx)
                    if self._in_bounds(ny, nx) and coord not in visited and not self._is_flagged(ny, nx):
                        self.revealed.append([ny, nx])
                        visited.add(coord)
                        if board[ny][nx] == 0:
                            stack.append((ny, nx))

    def _check_win(self):
        total_cells = self.width * self.height
        if total_cells - len(self.revealed) == self.mines_count:
            self.is_over = True
            self.is_won = True

    def _is_revealed(self, y, x):
        return [y, x] in self.revealed

    def _is_flagged(self, y, x):
        return [y, x] in self.flagged

    def _in_bounds(self, y, x):
        return 0 <= y < self.height and 0 <= x < self.width

    def _reconstruct_grid(self, coords, fill=False):
        grid = [[fill for _ in range(self.width)] for _ in range(self.height)]
        for y, x in coords:
            grid[y][x] = not fill
        return grid

    def _reconstruct_revealed(self):
        return self._reconstruct_grid(self.revealed, fill=False)

    def _reconstruct_flagged(self):
        return self._reconstruct_grid(self.flagged, fill=False)
