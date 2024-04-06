from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Comment, Score
from django.utils import timezone

import praw
from django.conf import settings

from .sentiment_model import SentimentModel


class RecentCommentsAPIView(APIView):
    def __init__(self):
        super().__init__()
        self.sentiment_model = SentimentModel(model_path='./sentiment/team-5-head-distilbert-base-uncased-go-emotion')

    def get(self, request):
        username = request.query_params.get('username', None)

        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user, created = User.objects.get_or_create(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        if user.last_checked and timezone.now() - user.last_checked < timedelta(days=1):
            comments = Comment.objects.filter(user=user)
            comment_data = []
            for comment in comments:
                scores = Score.objects.filter(comment=comment).values('label', 'score')
                comment_data_item = {
                    'comment': comment.comment_id,
                    'scores': scores
                }
                comment_data.append(comment_data_item)
            return Response({'comments': comment_data}, status=status.HTTP_200_OK)
        else:
            reddit = praw.Reddit(client_id=settings.REDDIT_CLIENT_ID,
                                 client_secret=settings.REDDIT_CLIENT_SECRET,
                                 user_agent=settings.REDDIT_USER_AGENT)
            try:
                # remove old comments
                Comment.objects.filter(user=user).delete()

                for comment in reddit.redditor(username).comments.new(limit=10):
                    comment_obj = Comment.objects.create(user=user, comment_id=comment.id)
                    probs = self.sentiment_model.predict(comment.body)
                    for key, value in probs.items():
                        Score.objects.create(comment=comment_obj, label=key, score=value)
                user.last_checked = timezone.now()
                user.save()
                return Response({'comments': Comment.objects.filter(user=user).values('comment_id')}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
