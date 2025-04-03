from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    board = serializers.SerializerMethodField()
    revealed = serializers.SerializerMethodField()
    flagged = serializers.SerializerMethodField()
    game_id = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = [
            'game_id',
            'width',
            'height',
            'mines_count',
            'board',
            'revealed',
            'flagged',
            'is_over',
            'is_won',
        ]

    def get_game_id(self, obj):
        return str(obj.id)

    def get_board(self, obj):
        return obj.get_board()

    def get_revealed(self, obj):
        return obj._reconstruct_revealed()

    def get_flagged(self, obj):
        return obj._reconstruct_flagged()



class GameActionSerializer(serializers.Serializer):
    x = serializers.IntegerField(min_value=0)
    y = serializers.IntegerField(min_value=0)
    action = serializers.CharField()

    def __init__(self, *args, game_width=None, game_height=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.game_width = game_width
        self.game_height = game_height

    def validate(self, data):
        x = data['x']
        y = data['y']

        if x >= self.game_width or y >= self.game_height:
            raise serializers.ValidationError({
                'cell_coordinates': 'Ensure cell falls within the board width and height.'
            })

        return data

class GameCreateSerializer(serializers.Serializer):
    width = serializers.IntegerField(min_value=5, max_value=30)
    height = serializers.IntegerField(min_value=5, max_value=30)
    mines_count = serializers.IntegerField(min_value=1)

    def validate(self, data):
        width = data['width']
        height = data['height']
        mines_count = data['mines_count']
        if mines_count > width * height - 1:
            raise serializers.ValidationError({
                'mines_count': 'Ensure number of mines to not exceed total cells minus one.'
            })
        return data