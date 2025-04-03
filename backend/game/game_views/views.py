import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from enum import Enum

from ..models import Game
from ..serializers import GameCreateSerializer, GameActionSerializer, GameSerializer

class GameProperties(Enum):
    HIT_MINE= 'hit_mine'
    FLAGGED =   'flagged'

class GameView(APIView):
    def get(self, request, game_id):
        game = get_object_or_404(Game, id=game_id, user=request.user)
        serializer = GameSerializer(game)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GameCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        createSerializer = GameCreateSerializer(data=request.data)
        if not createSerializer.is_valid():
            return Response(createSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = createSerializer.validated_data
        game = Game.objects.create(
            width=data.get('width'),
            height=data.get('height'),
            mines_count=data.get('mines_count'),
            user=request.user
        )
        game.initialize_board()
        responseSerializer = GameSerializer(game)
        return Response(responseSerializer.data, status=status.HTTP_201_CREATED)


class GameActionView(APIView):
    def post(self, request, game_id):
        game = get_object_or_404(Game, id=game_id, user=request.user)
        actionSerializer = GameActionSerializer(data=request.data, game_width=game.width, game_height=game.height)

        if not actionSerializer.is_valid():
            return Response(actionSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = actionSerializer.validated_data
        x, y, action = data.get('x'), data.get('y'), data.get('action')

        if action == 'reveal':
            _, hit_mine = game.reveal_cell(y, x)
            responseSerializer = GameSerializer(game, context={"extra_data": {GameProperties.HIT_MINE.value: hit_mine}})
            return JsonResponse(responseSerializer.data)

        elif action == 'flag':
            _, flagged = game.toggle_flag(y, x)
            responseSerializer = GameSerializer(game, context={"extra_data":{'hit_mine': False, GameProperties.FLAGGED.value: flagged}})
            return JsonResponse(responseSerializer.data)

        return Response({"error": "Unknown action"}, status=status.HTTP_400_BAD_REQUEST)

class GamesResumeView(APIView):
    def get(self, request):
        games = Game.objects.filter(user=request.user, is_over=False).order_by("-updated_at")[:5]
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
