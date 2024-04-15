from django.urls import path
from sentiment.views import RecentCommentsAPIView

urlpatterns = [
    path('recent-comments/', RecentCommentsAPIView.as_view(), name='recent-comments'),
]