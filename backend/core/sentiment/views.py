import praw
import numpy as np
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import User, Comment, Score
from .sentiment_model import SentimentModel, id2label


class RecentCommentsAPIView(APIView):
    def __init__(self):
        super().__init__()
        self.sentiment_model = SentimentModel(model_path=f'./sentiment/{settings.MODEL}')

    def get(self, request):
        username = request.query_params.get('username', None)

        if not username:
            return Response({'error': 'username is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user, created = User.objects.get_or_create(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        comment_ensemble = np.zeros((10, 28))

        if user.last_checked and timezone.now() - user.last_checked < timedelta(days=1):
            comments = Comment.objects.filter(user=user)
            for idx, comment in enumerate(comments):
                scores = Score.objects.filter(comment=comment).values_list('score', flat=True)
                comment_ensemble[idx] = scores
        else:
            reddit = praw.Reddit(client_id=settings.REDDIT_CLIENT_ID,
                                 client_secret=settings.REDDIT_CLIENT_SECRET,
                                 user_agent=settings.REDDIT_USER_AGENT)
            try:
                # remove old comments
                Comment.objects.filter(user=user).delete()

                for idx, comment in enumerate(reddit.redditor(username).comments.new(limit=10)):
                    comment_obj = Comment.objects.create(user=user, comment_id=comment.id)
                    probs = self.sentiment_model.predict(comment.body)
                    comment_ensemble[idx] = np.array(list(probs.values()))

                    for key, value in probs.items():
                        Score.objects.create(comment=comment_obj, label=key, score=value)
                user.last_checked = timezone.now()
                user.save()
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        aggregate_scores = np.mean(comment_ensemble, axis=0)
        predictions = [{"label": id2label[i], "score": aggregate_scores[i]} for i in range(len(aggregate_scores))]
        return Response(predictions, status=status.HTTP_200_OK)
