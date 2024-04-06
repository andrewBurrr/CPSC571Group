from django.db import models

# Create your models here.
"""
I need a user which has a username, last_checked, and collection of comment ids.
I need a comment model, which stores the user that made the comment, the commment id and the score of the comment.
The score is a score across each of the goemotions tags.
"""


class User(models.Model):
    username = models.CharField(max_length=50)
    last_checked = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_id = models.CharField(max_length=50)

    def __str__(self):
        return self.comment_id


class Score(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    label = models.CharField(max_length=50)
    score = models.FloatField()

    def __str__(self):
        return f'{self.label} - {self.score}'


