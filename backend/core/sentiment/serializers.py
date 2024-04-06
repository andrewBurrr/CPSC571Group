from rest_framework import serializers


class CommentSerializer(serializers.Serializer):
    body = serializers.CharField()
    comment_id = serializers.CharField()
    subreddit = serializers.CharField()
    created_utc = serializers.DateTimeField()
