import numpy as np
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch


class SentimentModel:
    _instance = None
    id2label = {
        0: 'admiration',
        1: 'amusement',
        2: 'anger',
        3: 'annoyance',
        4: 'approval',
        5: 'caring',
        6: 'confusion',
        7: 'curiosity',
        8: 'desire',
        9: 'disappointment',
        10: 'disapproval',
        11: 'disgust',
        12: 'embarrassment',
        13: 'excitement',
        14: 'fear',
        15: 'gratitude',
        16: 'grief',
        17: 'joy',
        18: 'love',
        19: 'nervousness',
        20: 'optimism',
        21: 'pride',
        22: 'realization',
        23: 'relief',
        24: 'remorse',
        25: 'sadness',
        26: 'surprise',
        27: 'neutral'
    }

    def __new__(cls, model_path):
        if cls._instance is None:
            cls._instance = super(SentimentModel, cls).__new__(cls)
            cls._instance.model = AutoModelForSequenceClassification.from_pretrained(model_path)
            cls._instance.tokenizer = AutoTokenizer.from_pretrained(model_path)
        return cls._instance

    def predict(self, text):
        encoding = self.tokenizer(text, return_tensors='pt')
        # making predictions
        print("Making predictions")
        with torch.no_grad():
            outputs = self.model(**encoding)
        sigmoid = torch.nn.Sigmoid()
        probs = sigmoid(outputs.logits[0].cpu())
        probs_detach = probs.detach().numpy()
        predictions = {self.id2label[i]: probs_detach[i] for i in range(len(probs_detach))}
        return predictions
